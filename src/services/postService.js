import { logError } from '../utils/logger'
import { supabase } from '../lib/supabase'
import { logAdminAction } from './adminLogService'
import { createNotificationForUser } from './notificationService'
import { normalizeAvatarUrl } from '../utils/avatar'

import { uploadOptimizedImage } from './mediaUploadService'
import { extractPlainTextFromBlocks } from '../utils/postBlocks'

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 6)
}

export async function checkRecentPostRateLimit(userId) {
  if (!userId) {
    return {
      allowed: false,
      error: new Error('Thiếu thông tin người dùng để kiểm tra tần suất đăng bài.'),
    }
  }

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000

  const { data, error } = await supabase
    .from('posts')
    .select('id, created_at')
    .eq('author_id', userId)
    .gte('created_at', oneDayAgo)
    .order('created_at', { ascending: false })

  if (error) {
    return { allowed: true, error }
  }

  const recentPosts = data || []
  const postsInLastTenMinutes = recentPosts.filter((post) => {
    const createdAt = new Date(post.created_at).getTime()
    return Number.isFinite(createdAt) && createdAt >= tenMinutesAgo
  }).length

  const postsInLastDay = recentPosts.length

  return {
    allowed: postsInLastTenMinutes < 3 && postsInLastDay < 20,
    postsInLastTenMinutes,
    postsInLastDay,
    error: null,
  }
}

export async function uploadPostImage(file, userId) {
  const result = await uploadOptimizedImage({
    file,
    bucket: 'post-images',
    folder: `posts/${userId}`,
    preset: 'postDetail',
    variants: true,
    userId,
  })

  if (result.error) {
    return { publicUrl: null, error: result.error }
  }

  // The database only has one column `image_url` or `cover_url`, so we return the best one
  // but if the component wants thumbnail, it should access it if we stored it as JSON, 
  // but for now we just return the detailUrl or publicUrl to avoid breaking old schema.
  const bestUrl = result.detailUrl || result.cardUrl || result.thumbUrl || result.publicUrl
  
  return { 
    publicUrl: bestUrl, 
    thumbUrl: result.thumbUrl,
    cardUrl: result.cardUrl,
    detailUrl: result.detailUrl,
    error: null 
  }
}

export async function uploadPostInlineImage(file, userId) {
  const result = await uploadOptimizedImage({
    file,
    bucket: 'post-images',
    folder: `posts/${userId}/inline`,
    preset: 'postDetail',
    variants: false,
    userId,
  })

  if (result.error) {
    return { publicUrl: null, error: result.error }
  }

  return { publicUrl: result.publicUrl, error: null }
}

export async function createPost(postData) {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !sessionData.session) {
    return { data: null, error: new Error('Bạn cần đăng nhập để tạo bài viết') }
  }

  const userId = sessionData.session.user.id
  const slug = generateSlug(postData.title)

  const normalizedTypeMap = {
    'Mẹo tiết kiệm': 'tip',
    'Cộng đồng': 'community',
    'Chia sẻ cộng đồng': 'community',
    'Hỏi đáp': 'qa',
    'Review thiết bị': 'review',
    'tip': 'tip',
    'community': 'community',
    'qa': 'qa',
    'review': 'review',
  }
  
  const validType = normalizedTypeMap[postData.type] || 'community'

  let imageUrl = null
  let thumbUrl = null
  let cardUrl = null
  let detailUrl = null

  if (postData.coverFile) {
    const uploadResult = await uploadPostImage(postData.coverFile, userId)
    if (uploadResult.error) {
      logError('Debug: Error uploading image:', uploadResult.error?.message || uploadResult.error)
      return { data: null, error: new Error('Lỗi tải ảnh lên: ' + uploadResult.error.message) }
    }
    imageUrl = uploadResult.publicUrl
    thumbUrl = uploadResult.thumbUrl || imageUrl
    cardUrl = uploadResult.cardUrl || imageUrl
    detailUrl = uploadResult.detailUrl || imageUrl
  } else if (postData.image_url) {
    imageUrl = postData.image_url
    thumbUrl = postData.cover_thumb_url || imageUrl
    cardUrl = postData.cover_card_url || imageUrl
    detailUrl = postData.cover_detail_url || imageUrl
  }

  const payload = {
    author_id: userId,
    title: postData.title,
    slug: slug,
    description: postData.description,
    content: postData.content_blocks ? extractPlainTextFromBlocks(postData.content_blocks, postData.content) : postData.content,
    content_blocks: postData.content_blocks || null,
    type: validType,
    status: postData.status || 'pending',
    image_url: imageUrl,
    cover_thumb_url: thumbUrl,
    cover_card_url: cardUrl,
    cover_detail_url: detailUrl,
    // category_id: mapped if possible, null for now since form category is text
  }

  const { data, error } = await supabase
    .from('posts')
    .insert([payload])
    .select()
    .single()

  if (error) {
    logError('Debug: Error inserting post:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
    })
  }

  return { data, error }
}

export async function getAllAdminPosts({
  page = 1,
  pageSize = 20,
  status = 'Tất cả',
  search = '',
  category = 'Tất cả',
  dateRange = 'Tất cả',
  authorFilterId = ''
} = {}) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (name)
    `, { count: 'exact' })

  // Map status string to DB enum value
  const statusLabelToKey = {
    'Chờ duyệt': 'pending',
    'Đã duyệt': 'approved',
    'Bị từ chối': 'rejected',
    'Đã khóa': 'blocked',
  }
  const statusKey = statusLabelToKey[status]
  if (statusKey) {
    query = query.eq('status', statusKey)
  }

  // category maps to type
  if (category === 'Mẹo tiết kiệm') query = query.eq('type', 'tip')
  else if (category === 'Cộng đồng') query = query.eq('type', 'community')

  if (authorFilterId) {
    query = query.eq('author_id', authorFilterId)
  }

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  if (dateRange !== 'Tất cả') {
    const now = new Date()
    if (dateRange === 'Hôm nay') {
      const today = new Date(now.setHours(0,0,0,0)).toISOString()
      query = query.gte('created_at', today)
    } else if (dateRange === '7 ngày qua') {
      const weekAgo = new Date(now)
      weekAgo.setDate(weekAgo.getDate() - 7)
      query = query.gte('created_at', weekAgo.toISOString())
    } else if (dateRange === 'Tháng này') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      query = query.gte('created_at', firstDay)
    }
  }

  query = query.order('created_at', { ascending: false }).range(from, to)

  const { data, count, error } = await query
  
  return { 
    data, 
    count, 
    page, 
    pageSize, 
    totalPages: Math.ceil((count || 0) / pageSize), 
    error 
  }
}

export async function getPendingPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(`*, profiles:author_id (name)`)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(100)

  return { data, error }
}

export async function getApprovedPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error || !data) {
    return { data, error }
  }

  const hydratedPosts = await attachPublicProfilesToPosts(data)
  return { data: hydratedPosts, error: null }
}

export async function getTipPosts({ page = 1, limit = 10, category = '', search = '' } = {}) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  let selectStr = '*, categories:category_id (id, name, slug), profiles:author_id(name, avatar_url, role)'
  
  if (category && category !== 'Tất cả') {
    selectStr = '*, categories!inner (id, name, slug), profiles:author_id(name, avatar_url, role)'
  }

  let query = supabase
    .from('posts')
    .select(selectStr, { count: 'exact' })
    .eq('status', 'approved')
    .eq('type', 'tip')

  if (category && category !== 'Tất cả') {
    query = query.eq('categories.name', category)
  }

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  query = query.order('created_at', { ascending: false }).range(from, to)

  const { data, count, error } = await query

  if (error || !data) {
    return { data: [], hasMore: false, error }
  }

  const hydratedPosts = await attachPublicProfilesToPosts(data)
  return { 
    data: hydratedPosts, 
    hasMore: count > to + 1,
    error: null 
  }
}

async function hydrateAndCheckPostAccess(postData) {
  let profileData = null
  if (postData.author_id) {
    if (postData.status === 'approved') {
      const profileMap = await fetchPublicProfilesMap([postData.author_id])
      profileData = profileMap.get(postData.author_id) || null
    } else {
      const { data: pData } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, bio, role')
        .eq('id', postData.author_id)
        .single()
      profileData = pData
    }
  }
  
  const data = { ...postData, profiles: profileData }

  if (data.status !== 'approved') {
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData?.session) return { data: null, error: new Error('Không có quyền xem') }
    const userId = sessionData.session.user.id
    if (data.author_id !== userId) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single()
      if (profile?.role !== 'admin' && profile?.role !== 'moderator') {
         return { data: null, error: new Error('Không có quyền xem') }
      }
    }
  }

  return { data, error: null }
}

export async function getPostBySlug(slug) {
  const { data: postData, error } = await supabase
    .from('posts')
    .select(`*`)
    .eq('slug', slug)
    .single()

  if (error || !postData) return { data: null, error }

  return hydrateAndCheckPostAccess(postData)
}

export async function getPostById(id) {
  const { data: postData, error } = await supabase
    .from('posts')
    .select(`*`)
    .eq('id', id)
    .single()

  if (error || !postData) return { data: null, error }

  return hydrateAndCheckPostAccess(postData)
}

export async function getCommunityPosts(page = 1, limit = 10, filter = 'Tất cả') {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('posts')
    .select('id, title, description, slug, type, author_id, status, created_at, published_at, likes_count, comments_count, saved_count, image_url, cover_thumb_url, cover_card_url, cover_detail_url, profiles:author_id(name, avatar_url, role, user_preferences)', { count: 'exact' })
    .eq('status', 'approved')

  if (filter === 'Hỏi đáp') query = query.eq('type', 'qa');
  else if (filter === 'Kinh nghiệm') query = query.eq('type', 'community');
  else query = query.in('type', ['community', 'qa', 'review']);

  if (filter === 'Đã lưu nhiều') {
    query = query.order('saved_count', { ascending: false }).order('published_at', { ascending: false, nullsFirst: false });
  } else if (filter === 'Nhiều tương tác') {
    query = query.order('likes_count', { ascending: false }).order('published_at', { ascending: false, nullsFirst: false });
  } else {
    query = query.order('published_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);

  if (error || !data) {
    return { data: [], count: 0, hasMore: false, error }
  }

  const hydratedPosts = await attachPublicProfilesToPosts(data)
  return { data: hydratedPosts, count, hasMore: count > to + 1, error: null }
}

export async function getRecentCommunityPosts(limitCount = 2) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'approved')
    .eq('type', 'community')
    .order('created_at', { ascending: false })
    .limit(limitCount)

  if (error || !data) {
    return { data, error }
  }

  const hydratedPosts = await attachPublicProfilesToPosts(data)
  return { data: hydratedPosts, error: null }
}

async function attachPublicProfilesToPosts(posts = []) {
  const authorIds = [...new Set(
    posts
      .map((post) => post.author_id)
      .filter(Boolean),
  )]

  if (authorIds.length === 0) {
    return posts.map((post) => ({ ...post, profiles: null }))
  }

  const profileMap = await fetchPublicProfilesMap(authorIds)

  return posts.map((post) => ({
    ...post,
    profiles: profileMap.get(post.author_id) || post.profiles || null,
  }))
}

async function fetchPublicProfilesMap(authorIds = []) {
  if (authorIds.length === 0) {
    return new Map()
  }

  const { data: profiles, error } = await supabase
    .from('public_profiles')
    .select('id, name, avatar_url, bio, cover_url, facebook_url, website_url, user_preferences')
    .in('id', authorIds)

  if (error) {
    logError('[fetchPublicProfilesMap] Failed to fetch public profiles.', error)
    return new Map()
  }

  return new Map((profiles || []).map((profile) => {
    const prefs = profile.user_preferences || {}
    return [
      profile.id,
      {
        ...profile,
        user_preferences: {
          profile_visibility: prefs.profile_visibility || 'public',
          show_public_posts: prefs.show_public_posts !== false && prefs.show_public_posts !== 'false',
          show_facebook: prefs.show_facebook !== false && prefs.show_facebook !== 'false',
          allow_search_index: prefs.allow_search_index !== false && prefs.allow_search_index !== 'false',
        },
      },
    ]
  }))
}

function isMissingRelationError(error) {
  return error?.code === '42P01' || String(error?.message || '').toLowerCase().includes('does not exist')
}

function normalizeActiveMember(member = {}) {
  const name = String(member.name || '').trim() || 'Thành viên E-XANH'
  const avatarUrl = normalizeAvatarUrl(member.avatar_url || member.avatarUrl || member.avatar || '')

  return {
    id: member.id || null,
    name,
    avatarUrl,
    avatar_url: avatarUrl,
    postCount: Number(member.post_count ?? member.postCount ?? member.approved_posts_count ?? 0),
    approved_posts_count: Number(member.post_count ?? member.postCount ?? member.approved_posts_count ?? 0),
    latestPostAt: member.latest_post_at || member.latestPostAt || null,
  }
}

async function getActiveMembersFromProfiles(limitCount = 5) {
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('author_id, created_at')
    .eq('status', 'approved')
    .eq('type', 'community')
    .not('author_id', 'is', null)
    .order('created_at', { ascending: false })

  if (postsError) {
    return { data: null, error: postsError }
  }

  const countMap = new Map()
  const latestMap = new Map()

  for (const post of posts || []) {
    countMap.set(post.author_id, (countMap.get(post.author_id) || 0) + 1)

    const currentLatest = latestMap.get(post.author_id)
    if (!currentLatest || new Date(post.created_at) > new Date(currentLatest)) {
      latestMap.set(post.author_id, post.created_at)
    }
  }

  const userIds = [...countMap.keys()]
  if (userIds.length === 0) {
    return { data: [], error: null }
  }

  const { data: profiles, error: profilesError } = await supabase
    .from('public_profiles')
    .select('id, name, avatar_url')
    .in('id', userIds)

  if (profilesError) {
    return { data: null, error: profilesError }
  }

  const profileMap = new Map((profiles || []).map((profile) => [profile.id, profile]))

  const normalizedMembers = userIds
    .map((userId) => {
      const profile = profileMap.get(userId)

      return normalizeActiveMember({
        id: userId,
        name: profile?.name,
        avatar_url: profile?.avatar_url,
        post_count: countMap.get(userId) || 0,
        latest_post_at: latestMap.get(userId) || null,
      })
    })
    .sort((first, second) => {
      if (second.postCount !== first.postCount) {
        return second.postCount - first.postCount
      }

      return new Date(second.latestPostAt || 0) - new Date(first.latestPostAt || 0)
    })
    .slice(0, limitCount)

  return { data: normalizedMembers, error: null }
}

export async function getTopActiveMembers(limitCount = 3) {
  const { data, error } = await supabase
    .from('community_active_members')
    .select('id, name, avatar_url, post_count, latest_post_at')
    .order('post_count', { ascending: false })
    .order('latest_post_at', { ascending: false })
    .limit(limitCount)

  if (!error) {
    return {
      data: (data || []).map(normalizeActiveMember),
      error: null,
    }
  }

  if (!isMissingRelationError(error)) {
    return getActiveMembersFromProfiles(limitCount)
  }

  return getActiveMembersFromProfiles(limitCount)
}

export async function getFeaturedPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'approved')
    .eq('type', 'tip')
    .order('likes_count', { ascending: false })
    .limit(3)

  if (error || !data) {
    return { data, error }
  }

  const hydratedPosts = await attachPublicProfilesToPosts(data)
  return { data: hydratedPosts, error: null }
}

export async function getMyPosts(userId, page = 1, limit = 10) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('author_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to)

  return { data, hasMore: count > to + 1, error }
}

export async function getPublicPostsByUser(userId, page = 1, limit = 10) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await supabase
    .from('posts')
    .select(`
      *, 
      profiles:author_id (name, avatar_url, role)
    `, { count: 'exact' })
    .eq('author_id', userId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(from, to)

  return { data, hasMore: count > to + 1, error }
}


export async function updatePostStatus(postId, status, adminNote = null) {
  const updatePayload = { status }
  
  if (status === 'rejected' && adminNote !== null) {
    updatePayload.rejection_reason = adminNote
  }

  const { data, error } = await supabase
    .from('posts')
    .update(updatePayload)
    .eq('id', postId)
    .select()

  if (!error && (!data || data.length === 0)) {
    return { data: null, error: new Error('Không tìm thấy bài viết hoặc bạn không có quyền cập nhật.') }
  }

  if (data && data.length > 0) {
    const post = data[0]
    if (post && post.author_id) {
      let title = ''
      let message = ''
      let notifType = 'post_status'
      
      if (status === 'approved') {
        title = 'Bài viết đã được duyệt'
        message = 'Bài viết của bạn đã được duyệt và hiển thị công khai.'
        notifType = 'post_approved'
      } else if (status === 'rejected') {
        title = 'Bài viết bị từ chối'
        message = adminNote ? `Bài viết của bạn chưa được duyệt. Lý do: ${adminNote}` : 'Bài viết của bạn chưa được duyệt. Vui lòng kiểm tra lại nội dung.'
        notifType = 'post_rejected'
      } else if (status === 'blocked') {
        title = 'Bài viết bị khóa'
        message = 'Bài viết của bạn đã bị khóa do vi phạm quy định.'
        notifType = 'post_blocked'
      }
      
      if (title) {
        await createNotificationForUser(post.author_id, {
          title,
          message,
          type: notifType,
          actionUrl: `/cong-dong/post/${post.slug}`,
          relatedType: 'post',
          relatedId: postId
        })
      }

      await logAdminAction({
        action: `update_post_status_${status}`,
        targetType: 'post',
        targetId: postId,
        metadata: { new_status: status, admin_note: adminNote }
      })
    }
  }

  return { data, error }
}

export async function approvePost(postId) {
  return updatePostStatus(postId, 'approved')
}

export async function rejectPost(postId, adminNote) {
  return updatePostStatus(postId, 'rejected', adminNote)
}

export async function blockPost(postId) {
  return updatePostStatus(postId, 'blocked')
}


export async function updatePost(postId, postData) {
  const normalizedTypeMap = {
    'Mẹo tiết kiệm': 'tip',
    'Cộng đồng': 'community',
    'Chia sẻ cộng đồng': 'community',
    'Hỏi đáp': 'qa',
    'Review thiết bị': 'review',
    'tip': 'tip',
    'community': 'community',
    'qa': 'qa',
    'review': 'review',
  }
  


  const payload = {
    title: postData.title,
    description: postData.description,
  }

  if (postData.content_blocks) {
    payload.content_blocks = postData.content_blocks
    payload.content = extractPlainTextFromBlocks(postData.content_blocks, postData.content)
  } else if (postData.content !== undefined) {
    payload.content = postData.content
  }

  if (postData.type) {
    payload.type = normalizedTypeMap[postData.type] || 'community'
  }

  const { data: currentPost } = await supabase.from('posts').select('status, author_id').eq('id', postId).single()
  
  if (postData.status) {
    payload.status = postData.status
  }

  // Auto reset to pending if owner updates a rejected post
  if (currentPost?.status === 'rejected') {
    payload.status = 'pending'
  }

  // Nếu có ảnh mới upload
  if (postData.coverFile) {
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData?.session) {
      const uploadResult = await uploadPostImage(postData.coverFile, sessionData.session.user.id)
      if (!uploadResult.error) {
        payload.image_url = uploadResult.publicUrl
        payload.cover_thumb_url = uploadResult.thumbUrl || uploadResult.publicUrl
        payload.cover_card_url = uploadResult.cardUrl || uploadResult.publicUrl
        payload.cover_detail_url = uploadResult.detailUrl || uploadResult.publicUrl
      }
    }
  } else {
    if (postData.image_url !== undefined) payload.image_url = postData.image_url || null
    if (postData.cover_thumb_url !== undefined) payload.cover_thumb_url = postData.cover_thumb_url || null
    if (postData.cover_card_url !== undefined) payload.cover_card_url = postData.cover_card_url || null
    if (postData.cover_detail_url !== undefined) payload.cover_detail_url = postData.cover_detail_url || null
  }

  const { data, error } = await supabase
    .from('posts')
    .update(payload)
    .eq('id', postId)
    .select()

  return { data, error }
}

export async function deletePost(postId) {
  const { data, error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  return { data, error }
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  return { data, error }
}

export async function getTopCategories(limit = 5) {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, posts(id)')

  if (error) return { data: null, error }

  const mapped = data.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    count: cat.posts ? cat.posts.length : 0
  })).sort((a, b) => b.count - a.count)

  return { data: mapped.slice(0, limit), error: null }
}
