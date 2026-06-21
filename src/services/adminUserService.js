import { supabase } from '../lib/supabase'
import { logError, logWarn } from '../utils/logger'
import { logAdminAction } from './adminLogService'
import { createNotificationForUser } from './notificationService'

export const BLOCKED_USER_STATUSES = ['locked', 'blocked']
const PROFILE_SELECT_FULL =
  'id, email, name, avatar_url, role, status, ban_reason, banned_at, banned_by, deleted_at, deleted_by, admin_note, created_at, updated_at'
const PROFILE_SELECT_BASIC =
  'id, email, name, avatar_url, role, status, created_at, updated_at'
const OPTIONAL_TABLES = {
  saved_posts: null,
  notifications: null,
  admin_action_logs: null,
}

function buildServiceError(message, sourceError = null) {
  return {
    message,
    source: sourceError,
  }
}

function isMissingRelationError(error) {
  const message = String(error?.message || '').toLowerCase()
  return error?.code === '42P01' || error?.code === 'PGRST205' || message.includes('does not exist')
}

function isPermissionError(error) {
  const message = String(error?.message || '').toLowerCase()
  return (
    message.includes('permission') ||
    message.includes('row-level security') ||
    message.includes('policy') ||
    message.includes('not authorized') ||
    message.includes('forbidden')
  )
}



function isProfileSchemaMismatch(error) {
  const message = String(error?.message || '').toLowerCase()

  return (
    error?.code === '42703' ||
    message.includes('column') ||
    message.includes('ban_reason') ||
    message.includes('banned_at') ||
    message.includes('banned_by') ||
    message.includes('deleted_at') ||
    message.includes('deleted_by') ||
    message.includes('admin_note')
  )
}

async function fetchProfilesWithFallback({
  userId = null,
  single = false,
  includeOrder = false,
} = {}) {
  const buildQuery = (selectClause) => {
    let query = supabase.from('profiles').select(selectClause)

    if (userId) {
      query = query.eq('id', userId)
    }

    if (includeOrder) {
      query = query.order('created_at', { ascending: false })
    }

    return single ? query.single() : query
  }

  const fullResult = await buildQuery(PROFILE_SELECT_FULL)
  if (!fullResult.error) {
    return {
      data: fullResult.data,
      error: null,
      usedFallback: false,
    }
  }

  if (!isProfileSchemaMismatch(fullResult.error)) {
    return {
      data: fullResult.data,
      error: fullResult.error,
      usedFallback: false,
    }
  }

  logWarn('[AdminUsers] Profiles schema cũ, dùng fallback query cơ bản.', fullResult.error)

  const basicResult = await buildQuery(PROFILE_SELECT_BASIC)
  if (basicResult.error) {
    return {
      data: basicResult.data,
      error: basicResult.error,
      usedFallback: true,
    }
  }

  const normalizedRows = (Array.isArray(basicResult.data) ? basicResult.data : [basicResult.data]).map((profile) => ({
    ...profile,
    ban_reason: null,
    banned_at: null,
    banned_by: null,
    deleted_at: null,
    deleted_by: null,
    admin_note: null,
  }))

  return {
    data: single ? normalizedRows[0] ?? null : normalizedRows,
    error: null,
    usedFallback: true,
  }
}

function ensureSupabase() {
  if (!supabase) {
    return buildServiceError('Supabase chưa được cấu hình trong môi trường hiện tại.')
  }

  return null
}

export function isBlockedUserStatus(status) {
  return BLOCKED_USER_STATUSES.includes(status)
}

export function normalizeManagedUserStatus(status) {
  if (status === 'blocked') {
    return 'locked'
  }

  return status
}

export function isDeletedUserStatus(status) {
  return status === 'deleted'
}

function isLegacyProfileStatus(status) {
  return ['active', 'locked', 'pending'].includes(status)
}

export function formatUserDateTime(dateString) {
  if (!dateString) return 'Chưa có dữ liệu'

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return 'Chưa có dữ liệu'
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date)
}

function formatRelativeTime(dateString) {
  if (!dateString) return 'Chưa có dữ liệu'

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return 'Chưa có dữ liệu'
  }

  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.round(diffMs / 60000)

  if (diffMinutes <= 0) return 'Vừa xong'
  if (diffMinutes < 60) return `${diffMinutes} phút trước`

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} giờ trước`

  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 30) return `${diffDays} ngày trước`

  return formatUserDateTime(dateString)
}

function buildAvatarFallback(name, email) {
  const source = name?.trim() || email?.trim() || 'U'
  return source.charAt(0).toUpperCase()
}



function buildRecentActivityMap({ posts, comments, saves, electricityChecks }) {
  const events = new Map()

  function pushEvent(userId, entry) {
    if (!userId || !entry?.createdAt) return

    const current = events.get(userId) ?? []
    current.push(entry)
    events.set(userId, current)
  }

  posts.forEach((post) => {
    pushEvent(post.author_id, {
      createdAt: post.created_at,
      label: `Đã đăng bài "${post.title || 'Không có tiêu đề'}"`,
    })
  })

  comments.forEach((comment) => {
    const snippet = String(comment.content || '').trim().slice(0, 80)
    pushEvent(comment.user_id, {
      createdAt: comment.created_at,
      label: snippet
        ? `Đã bình luận: "${snippet}${snippet.length >= 80 ? '...' : ''}"`
        : 'Đã gửi một bình luận mới',
    })
  })

  saves.forEach((save) => {
    pushEvent(save.user_id, {
      createdAt: save.created_at,
      label: save.posts?.title
        ? `Đã lưu bài "${save.posts.title}"`
        : 'Đã lưu một bài viết',
    })
  })

  electricityChecks.forEach((check) => {
    pushEvent(check.user_id, {
      createdAt: check.checked_at,
      label: 'Đã thực hiện kiểm tra tiền điện',
    })
  })

  return events
}

function pickLastActiveAt(profile, posts, comments, saves, electricityChecks) {
  const candidates = [
    profile.updated_at,
    ...posts.map((item) => item.created_at),
    ...comments.map((item) => item.created_at),
    ...saves.map((item) => item.created_at),
    ...electricityChecks.map((item) => item.checked_at),
  ].filter(Boolean)

  if (candidates.length === 0) {
    return null
  }

  return candidates.reduce((latest, current) => {
    if (!latest) return current
    return new Date(current) > new Date(latest) ? current : latest
  }, null)
}

async function checkTableAvailability(tableName) {
  const knownAvailability = OPTIONAL_TABLES[tableName]
  if (knownAvailability !== null) {
    return knownAvailability
  }

  const missingSupabase = ensureSupabase()
  if (missingSupabase) {
    OPTIONAL_TABLES[tableName] = false
    return false
  }

  const { error } = await supabase.from(tableName).select('*').limit(1)
  if (isMissingRelationError(error)) {
    logWarn(`[AdminUsers] ${tableName} chưa sẵn sàng`, error)
    OPTIONAL_TABLES[tableName] = false
    return false
  }

  if (error && !isPermissionError(error)) {
    logWarn(`[AdminUsers] Không thể kiểm tra ${tableName} bằng probe select`, error)
  }

  OPTIONAL_TABLES[tableName] = true
  return true
}



async function getProfileById(userId) {
  const missingSupabase = ensureSupabase()
  if (missingSupabase) {
    return { data: null, error: missingSupabase }
  }

  const { data, error } = await fetchProfilesWithFallback({
    userId,
    single: true,
  })

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

async function getAdminCount() {
  const missingSupabase = ensureSupabase()
  if (missingSupabase) {
    return { count: 0, error: missingSupabase }
  }

  const { count, error } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'admin')

  return { count: count ?? 0, error }
}

async function createUserNotification(payload) {
  const { user_id, ...restPayload } = payload
  const result = await createNotificationForUser(user_id, restPayload)
  return { data: result.data, skipped: false, warning: result.error ? result.error.message : null }
}

async function createAuditLog(payload) {
  const result = await logAdminAction({
    action: payload.action,
    targetType: payload.target_type,
    targetId: payload.target_id,
    metadata: payload.metadata,
  })
  return { data: result.data, skipped: false, warning: result.error ? result.error.message : null }
}

function getPrivilegeError(actor, target) {
  if (!actor) {
    return 'Không xác định được tài khoản quản trị hiện tại.'
  }

  if (actor.role !== 'admin') {
    return 'Chỉ admin mới được phép thay đổi role hoặc trạng thái người dùng.'
  }

  if (!target) {
    return 'Không tìm thấy người dùng mục tiêu.'
  }

  return null
}

export async function getAdminUsers() {
  const missingSupabase = ensureSupabase()
  if (missingSupabase) {
    return { data: null, error: missingSupabase }
  }

  const warnings = []

  const {
    data: profiles,
    error: profilesError,
    usedFallback: usedProfileFallback,
  } = await fetchProfilesWithFallback({
    includeOrder: true,
  })

  if (profilesError) {
    logError('[AdminUsers] Lỗi lấy profiles', profilesError)
    return {
      data: null,
      error: buildServiceError('Không thể tải danh sách người dùng từ bảng profiles.', profilesError),
    }
  }

  if (usedProfileFallback) {
    warnings.push('Supabase của bạn chưa có đủ cột moderation mới trong bảng profiles. Trang đang dùng chế độ tương thích, hãy apply migration admin để mở đầy đủ tính năng khóa/vô hiệu hóa.')
  }

  if (!profiles?.length) {
    return {
      data: {
        users: [],
        stats: [
          { label: 'Tổng người dùng', value: 0, icon: 'total', accent: 'success' },
          { label: 'Người dùng hoạt động', value: 0, icon: 'active', accent: 'highlight' },
          { label: 'Tài khoản bị khóa', value: 0, icon: 'locked', accent: 'warning' },
          { label: 'Admin / Moderator', value: 0, icon: 'staff', accent: 'muted' },
        ],
        warnings,
      },
      error: null,
    }
  }

  const userIds = profiles.map((profile) => profile.id)
  const canReadSavedPosts = await checkTableAvailability('saved_posts')

  const postCountMap = {}
  const commentCountMap = {}
  const saveCountMap = {}
  const electricityCountMap = {}

  // Thực hiện truy vấn count tổng hợp bằng RPC
  const { data: statsData, error: statsError } = await supabase.rpc('get_users_activity_stats', { uid_array: userIds })
  let countPromises = []
  
  if (statsData && !statsError) {
    statsData.forEach(stat => {
      postCountMap[stat.user_id] = parseInt(stat.post_count, 10) || 0
      commentCountMap[stat.user_id] = parseInt(stat.comment_count, 10) || 0
      saveCountMap[stat.user_id] = parseInt(stat.saved_post_count, 10) || 0
      electricityCountMap[stat.user_id] = parseInt(stat.electricity_check_count, 10) || 0
    })
  } else {
    logWarn('[AdminUsers] Lỗi gọi RPC get_users_activity_stats:', statsError)
  }

  // Fetch giới hạn hoạt động gần đây để không tải quá nhiều dữ liệu
  const recentPromises = [
    supabase.from('posts').select('id, author_id, title, created_at, status').in('author_id', userIds).order('created_at', { ascending: false }).limit(200),
    supabase.from('comments').select('id, user_id, content, created_at, status').in('user_id', userIds).order('created_at', { ascending: false }).limit(200),
    canReadSavedPosts
      ? supabase.from('saved_posts').select('user_id, created_at, posts(title)').in('user_id', userIds).order('created_at', { ascending: false }).limit(200)
      : Promise.resolve({ data: [], error: null }),
    supabase.from('electricity_checks').select('id, user_id, checked_at').in('user_id', userIds).order('checked_at', { ascending: false }).limit(200)
  ]

  await Promise.all(countPromises)
  const [
    postsResult,
    commentsResult,
    savedPostsResult,
    electricityChecksResult,
  ] = await Promise.all(recentPromises)

  if (postsResult.error) {
    logWarn('[AdminUsers] Lỗi lấy posts count', postsResult.error)
    warnings.push('Không thể lấy số bài viết của người dùng.')
  }

  if (commentsResult.error) {
    logWarn('[AdminUsers] Lỗi lấy comments count', commentsResult.error)
    warnings.push('Không thể lấy số bình luận của người dùng.')
  }

  if (savedPostsResult.error) {
    logWarn('[AdminUsers] Lỗi lấy saved posts count', savedPostsResult.error)
    warnings.push('Không thể lấy số bài đã lưu của người dùng. Hãy apply policy staff cho saved_posts.')
  } else if (!canReadSavedPosts) {
    warnings.push('Bảng hoặc policy saved_posts cho admin chưa sẵn sàng, số bài đã lưu đang hiển thị 0.')
  }

  if (electricityChecksResult.error) {
    logWarn('[AdminUsers] Lỗi lấy electricity checks count', electricityChecksResult.error)
    warnings.push('Không thể lấy số lần kiểm tra điện của người dùng.')
  }

  const posts = postsResult.data ?? []
  const comments = commentsResult.data ?? []
  const savedPosts = savedPostsResult.data ?? []
  const electricityChecks = electricityChecksResult.data ?? []

  const recentActivityMap = buildRecentActivityMap({
    posts,
    comments,
    saves: savedPosts,
    electricityChecks,
  })

  const users = profiles.map((profile) => {
    const userPosts = posts.filter((item) => item.author_id === profile.id)
    const userComments = comments.filter((item) => item.user_id === profile.id)
    const userSaves = savedPosts.filter((item) => item.user_id === profile.id)
    const userElectricityChecks = electricityChecks.filter((item) => item.user_id === profile.id)
    const lastActiveAt = pickLastActiveAt(
      profile,
      userPosts,
      userComments,
      userSaves,
      userElectricityChecks,
    )
    const activities = (recentActivityMap.get(profile.id) ?? [])
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
      .slice(0, 5)
      .map((item) => item.label)

    return {
      id: profile.id,
      name: profile.name || 'Người dùng ẩn danh',
      email: profile.email || 'Không có email',
      role: profile.role,
      status: profile.status,
      banReason: profile.ban_reason || '',
      bannedAt: profile.banned_at || null,
      deletedAt: profile.deleted_at || null,
      avatar: buildAvatarFallback(profile.name, profile.email),
      avatarUrl: profile.avatar_url || '',
      postsCount: postCountMap[profile.id] ?? 0,
      commentsCount: commentCountMap[profile.id] ?? 0,
      savedCount: saveCountMap[profile.id] ?? 0,
      electricityChecks: electricityCountMap[profile.id] ?? 0,
      joinedAt: formatUserDateTime(profile.created_at),
      joinedAtValue: profile.created_at,
      lastActive: formatRelativeTime(lastActiveAt),
      lastActiveAt,
      lastActiveFull: formatUserDateTime(lastActiveAt),
      recentActivities: activities.length > 0 ? activities : ['Chưa có hoạt động nổi bật'],
      adminNote: profile.admin_note ?? '',
    }
  })

  const stats = [
    {
      label: 'Tổng người dùng',
      value: users.length,
      icon: 'total',
      accent: 'success',
    },
    {
      label: 'Người dùng hoạt động',
      value: users.filter((user) => user.status === 'active').length,
      icon: 'active',
      accent: 'highlight',
    },
    {
      label: 'Tài khoản bị khóa',
      value: users.filter((user) => isBlockedUserStatus(user.status)).length,
      icon: 'locked',
      accent: 'warning',
    },
    {
      label: 'Đã vô hiệu hóa',
      value: users.filter((user) => user.status === 'deleted').length,
      icon: 'locked',
      accent: 'muted',
    },
    {
      label: 'Admin / Moderator',
      value: users.filter((user) => ['admin', 'moderator'].includes(user.role)).length,
      icon: 'staff',
      accent: 'muted',
    },
  ]

  return {
    data: {
      users,
      stats,
      warnings,
    },
    error: null,
  }
}

export async function updateUserRole({
  userId,
  newRole,
  currentUser,
  reason = '',
  noteToUser = '',
}) {
  const missingSupabase = ensureSupabase()
  if (missingSupabase) {
    return { data: null, error: missingSupabase, warnings: [] }
  }

  const warnings = []
  const { data: targetUser, error: targetError } = await getProfileById(userId)
  if (targetError) {
    return {
      data: null,
      error: buildServiceError('Không thể lấy thông tin người dùng mục tiêu để đổi vai trò.', targetError),
      warnings,
    }
  }

  const privilegeError = getPrivilegeError(currentUser, targetUser)
  if (privilegeError) {
    return { data: null, error: buildServiceError(privilegeError), warnings }
  }

  if (targetUser.role === newRole) {
    return { data: targetUser, error: null, warnings }
  }

  if (currentUser.id === userId && newRole !== 'admin') {
    const { count, error: countError } = await getAdminCount()
    if (countError) {
      return {
        data: null,
        error: buildServiceError('Không thể kiểm tra số lượng admin hiện tại.', countError),
        warnings,
      }
    }

    if (count <= 1) {
      return {
        data: null,
        error: buildServiceError('Không thể tự hạ quyền vì hệ thống cần ít nhất một admin.'),
        warnings,
      }
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      role: newRole,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select(PROFILE_SELECT_BASIC)
    .single()

  if (error) {
    logError('[AdminUsers] Lỗi cập nhật role', error)
    return {
      data: null,
      error: buildServiceError('Không thể cập nhật vai trò người dùng. Kiểm tra RLS của bảng profiles.', error),
      warnings,
    }
  }

  const notificationResult = await createUserNotification({
    user_id: userId,
    title: 'Vai trò tài khoản đã được cập nhật',
    message:
      noteToUser?.trim() ||
      `Vai trò tài khoản của bạn đã được cập nhật thành "${newRole}". Bạn có thể cần đăng nhập lại để quyền mới có hiệu lực.`,
    type: 'role',
    related_type: 'user',
    related_id: userId,
    created_by: currentUser.id,
  })
  if (notificationResult.warning) {
    warnings.push(notificationResult.warning)
  }

  const auditResult = await createAuditLog({
    admin_id: currentUser.id,
    target_id: userId,
    target_type: 'user',
    action: 'update_user_role',
    metadata: {
      old_value: { role: targetUser.role },
      new_value: { role: newRole },
      reason: reason || noteToUser || null,
    },
  })
  if (auditResult.warning) {
    warnings.push(auditResult.warning)
  }

  return { data, error: null, warnings }
}

export async function updateUserStatus({
  userId,
  newStatus,
  currentUser,
  reason = '',
  noteToUser = '',
}) {
  const missingSupabase = ensureSupabase()
  if (missingSupabase) {
    return { data: null, error: missingSupabase, warnings: [] }
  }

  const warnings = []
  const { data: targetUser, error: targetError } = await getProfileById(userId)
  if (targetError) {
    return {
      data: null,
      error: buildServiceError('Không thể lấy thông tin người dùng mục tiêu để cập nhật trạng thái.', targetError),
      warnings,
    }
  }

  const privilegeError = getPrivilegeError(currentUser, targetUser)
  if (privilegeError) {
    return { data: null, error: buildServiceError(privilegeError), warnings }
  }

  const normalizedStatus = normalizeManagedUserStatus(newStatus)
  if (targetUser.status === normalizedStatus) {
    return { data: targetUser, error: null, warnings }
  }

  if (currentUser.id === userId && isBlockedUserStatus(normalizedStatus)) {
    return {
      data: null,
      error: buildServiceError('Bạn không thể tự khóa tài khoản của chính mình.'),
      warnings,
    }
  }

  if (targetUser.role === 'admin' && isBlockedUserStatus(normalizedStatus)) {
    const { count, error: countError } = await getAdminCount()
    if (countError) {
      return {
        data: null,
        error: buildServiceError('Không thể kiểm tra số lượng admin hiện tại.', countError),
        warnings,
      }
    }

    if (count <= 1) {
      return {
        data: null,
        error: buildServiceError('Không thể khóa admin cuối cùng của hệ thống.'),
        warnings,
      }
    }
  }

  const fullPayload = {
    status: normalizedStatus,
    ban_reason: isBlockedUserStatus(normalizedStatus)
      ? reason || noteToUser || targetUser.ban_reason || null
      : null,
    banned_at: isBlockedUserStatus(normalizedStatus) ? new Date().toISOString() : null,
    banned_by: isBlockedUserStatus(normalizedStatus) ? currentUser.id : null,
    deleted_at: normalizedStatus === 'deleted' ? new Date().toISOString() : null,
    deleted_by: normalizedStatus === 'deleted' ? currentUser.id : null,
    updated_at: new Date().toISOString(),
  }

  let { data, error } = await supabase
    .from('profiles')
    .update(fullPayload)
    .eq('id', userId)
    .select(PROFILE_SELECT_BASIC)
    .single()

  if (error && isProfileSchemaMismatch(error)) {
    logWarn('[AdminUsers] Profiles schema cũ, thử fallback update status cơ bản.', error)

    if (!isLegacyProfileStatus(normalizedStatus)) {
      return {
        data: null,
        error: buildServiceError('Supabase hiện tại chưa được migrate để hỗ trợ trạng thái này. Hãy chạy migration admin-upgrade trước khi vô hiệu hóa tài khoản.', error),
        warnings,
      }
    }

    const fallbackResult = await supabase
      .from('profiles')
      .update({
        status: normalizedStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select(PROFILE_SELECT_BASIC)
      .single()

    data = fallbackResult.data
    error = fallbackResult.error
    if (!error) {
      warnings.push('Đã cập nhật trạng thái bằng chế độ tương thích vì bảng profiles chưa có đủ cột moderation mới.')
    }
  }

  if (error) {
    logError('[AdminUsers] Lỗi cập nhật status', error)
    return {
      data: null,
      error: buildServiceError('Không thể cập nhật trạng thái người dùng. Kiểm tra RLS của bảng profiles.', error),
      warnings,
    }
  }

  const isUnlockAction = normalizedStatus === 'active'
  const isDeleteAction = normalizedStatus === 'deleted'
  const notificationResult = await createUserNotification({
    user_id: userId,
    title: isUnlockAction
      ? 'Tài khoản đã được mở khóa'
      : isDeleteAction
        ? 'Tài khoản đã bị vô hiệu hóa'
        : 'Tài khoản đã bị khóa',
    message:
      noteToUser?.trim() ||
      (isUnlockAction
        ? 'Tài khoản của bạn đã được mở khóa và có thể sử dụng lại các tính năng phù hợp.'
        : isDeleteAction
          ? `Tài khoản của bạn đã bị vô hiệu hóa.${reason ? ` Lý do: ${reason}.` : ''}`
          : `Tài khoản của bạn đã bị khóa.${reason ? ` Lý do: ${reason}.` : ''}`),
    type: 'account',
    related_type: 'user',
    related_id: userId,
    created_by: currentUser.id,
  })
  if (notificationResult.warning) {
    warnings.push(notificationResult.warning)
  }

  const auditResult = await createAuditLog({
    admin_id: currentUser.id,
    target_id: userId,
    target_type: 'user',
    action: isUnlockAction
      ? 'unlock_user_account'
      : isDeleteAction
        ? 'deactivate_user_account'
        : 'lock_user_account',
    metadata: {
      old_value: { status: targetUser.status },
      new_value: { status: normalizedStatus },
      reason: reason || noteToUser || null,
    },
  })
  if (auditResult.warning) {
    warnings.push(auditResult.warning)
  }

  return { data, error: null, warnings }
}

export async function saveAdminUserNote({ userId, note, currentUser }) {
  const missingSupabase = ensureSupabase()
  if (missingSupabase) {
    return { data: null, error: missingSupabase, warnings: [] }
  }

  if (!currentUser || !['admin', 'moderator'].includes(currentUser.role)) {
    return {
      data: null,
      error: buildServiceError('Chỉ admin hoặc moderator mới được lưu ghi chú admin.'),
      warnings: [],
    }
  }

  const warnings = []

  const { data, error } = await supabase
    .from('profiles')
    .update({ admin_note: note, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select(PROFILE_SELECT_BASIC)
    .single()

  if (error) {
    logError('[AdminUsers] Lỗi lưu admin note', error)
    return {
      data: null,
      error: buildServiceError('Không thể lưu ghi chú admin. Kiểm tra RLS của bảng profiles.', error),
      warnings,
    }
  }

  const auditResult = await createAuditLog({
    admin_id: currentUser.id,
    target_id: userId,
    target_type: 'user',
    action: 'save_admin_user_note',
    metadata: {
      old_value: null,
      new_value: { note },
      reason: 'Admin note updated',
    },
  })
  if (auditResult.warning) {
    warnings.push(auditResult.warning)
  }

  return { data, error: null, warnings }
}
