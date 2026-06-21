import { logError } from '../utils/logger'
import { supabase } from '../lib/supabase'
import { resolvePostImageSource } from '../utils/postMedia'
import { getCurrentSession } from './authService'

function isCommentSchemaMismatch(error) {
  const message = String(error?.message || '').toLowerCase()

  return (
    error?.code === '42703' ||
    message.includes('column') ||
    message.includes('admin_note') ||
    message.includes('moderation_reason') ||
    message.includes('hidden_at') ||
    message.includes('hidden_by') ||
    message.includes('spam_at') ||
    message.includes('spam_by') ||
    message.includes('deleted_at') ||
    message.includes('deleted_by')
  )
}

function mapCommentNotificationError(error) {
  const message = String(error?.message || '').toLowerCase()

  if (error?.code === 'PGRST205' || message.includes('could not find the table')) {
    return new Error('Supabase chưa có bảng notifications. Hãy chạy migration notification center trước khi gửi cảnh báo bình luận.')
  }

  if (
    message.includes('row-level security') ||
    message.includes('permission') ||
    message.includes('not authorized')
  ) {
    return new Error('Supabase RLS đang chặn insert vào bảng notifications. Hãy kiểm tra policy staff insert.')
  }

  if (message.includes('user_id')) {
    return new Error('Thiếu user_id hợp lệ của chủ bình luận nên không thể gửi thông báo.')
  }

  return new Error(error?.message || 'Insert notification thất bại.')
}

export async function savePost(postId) {
  const session = await getCurrentSession()
  if (!session?.user) return { error: new Error('Bạn cần đăng nhập để lưu bài viết.') }

  const { data: existing } = await supabase.from('saved_posts').select('user_id').eq('user_id', session.user.id).eq('post_id', postId).maybeSingle()
  if (existing) return { error: null } // already saved

  const { error } = await supabase
    .from('saved_posts')
    .insert({ user_id: session.user.id, post_id: postId })

  if (error) {
    if (error.code === '23505') return { error: null } // already saved, ignore and don't increment
    logError('[E-XANH] Lỗi lưu bài viết:', error?.message || error)
    return { error }
  }

  // Dùng RPC hoặc Trigger để cập nhật đếm (tránh race condition)
  await supabase.rpc('increment_saved_count', { row_id: postId })

  return { error: null }
}

export async function unsavePost(postId) {
  const session = await getCurrentSession()
  if (!session?.user) return { error: new Error('Bạn cần đăng nhập.') }

  const { data, error } = await supabase
    .from('saved_posts')
    .delete()
    .eq('user_id', session.user.id)
    .eq('post_id', postId)
    .select()

  if (error) {
    logError('[E-XANH] Lỗi bỏ lưu bài viết:', error?.message || error)
    return { error }
  }

  if (!data || data.length === 0) {
    return { error: null }
  }

  // Dùng RPC hoặc Trigger để cập nhật đếm (tránh race condition)
  await supabase.rpc('decrement_saved_count', { row_id: postId })

  return { error: null }
}

export async function getMySavedPosts(page = 1, limit = 10) {
  const session = await getCurrentSession()
  if (!session?.user) return { data: [], hasMore: false, error: new Error('Bạn cần đăng nhập.') }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data: savedRows, count, error: savedError } = await supabase
    .from('saved_posts')
    .select('post_id, created_at', { count: 'exact' })
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (savedError) {
    logError('[E-XANH] Lỗi lấy bài đã lưu:', savedError?.message || savedError)
    return { data: [], hasMore: false, error: savedError }
  }

  if (!savedRows || savedRows.length === 0) {
    return { data: [], hasMore: false, error: null }
  }

  const postIds = savedRows.map(row => row.post_id)

  const { data: postsData, error: postsError } = await supabase
    .from('posts')
    .select(`
      id, title, slug, description, image_url, category_id, type, status, author_id,
      likes_count, comments_count, saved_count, read_time,
      profiles:author_id (name, email, avatar_url)
    `)
    .in('id', postIds)

  if (postsError) {
    logError('[E-XANH] Lỗi lấy chi tiết posts:', postsError?.message || postsError)
    return { data: [], hasMore: false, error: postsError }
  }

  const postsMap = new Map(postsData.map(p => [p.id, p]))

  const mappedPosts = savedRows.map(row => {
    const post = postsMap.get(row.post_id)
    if (!post) return null
    if (post.status === 'hidden' || post.status === 'rejected') return null

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      description: post.description,
      image: resolvePostImageSource(post),
      category: post.type === 'tip' ? 'Mẹo tiết kiệm' : post.type === 'community' ? 'Cộng đồng' : 'Hỏi đáp',
      savedCategoryLabel: post.type === 'tip' ? 'Mẹo hay' : post.type === 'community' ? 'Cộng đồng' : 'Giải đáp',
      author: post.profiles?.name || post.profiles?.email || 'Người dùng',
      authorId: post.author_id,
      savedAt: new Date(row.created_at).toLocaleDateString('vi-VN'),
      likes: post.likes_count || 0,
      savedType: post.type === 'tip' ? 'Mẹo tiết kiệm' : post.type === 'community' ? 'Cộng đồng' : 'Review thiết bị',
      status: post.status,
      type: post.type,
    }
  }).filter(Boolean)

  return { data: mappedPosts, hasMore: count > to + 1, error: null }
}

export async function getPostMetrics(postId) {
  const { data: likesCount } = await supabase.from('post_likes').select('id', { count: 'exact' }).eq('post_id', postId)
  const { data: savesCount } = await supabase.from('saved_posts').select('id', { count: 'exact' }).eq('post_id', postId)
  return { likes: likesCount?.length || 0, saves: savesCount?.length || 0 }
}

export async function getUserInteractionMap(userId) {
  if (!userId) return { likedMap: {}, savedMap: {} }
  const [{ data: likes }, { data: saves }] = await Promise.all([
    supabase.from('post_likes').select('post_id').eq('user_id', userId),
    supabase.from('saved_posts').select('post_id').eq('user_id', userId)
  ])
  const likedMap = {}
  const savedMap = {}
  likes?.forEach(l => likedMap[l.post_id] = true)
  saves?.forEach(s => savedMap[s.post_id] = true)
  return { likedMap, savedMap }
}

export async function isPostSaved(postId) {
  const session = await getCurrentSession()
  if (!session?.user) return { data: false, error: null }

  const { data, error } = await supabase
    .from('saved_posts')
    .select('post_id')
    .eq('user_id', session.user.id)
    .eq('post_id', postId)
    .maybeSingle()

  if (error) {
    logError('[E-XANH] Lỗi kiểm tra bài đã lưu:', error?.message || error)
    return { data: false, error }
  }
  
  return { data: !!data, error: null }
}

export async function likePost(postId) {
  const session = await getCurrentSession()
  if (!session?.user) return { error: new Error('Bạn cần đăng nhập để thích bài viết.') }

  const { data: existing } = await supabase.from('post_likes').select('user_id').eq('user_id', session.user.id).eq('post_id', postId).maybeSingle()
  if (existing) return { error: null } // already liked

  const { error } = await supabase
    .from('post_likes')
    .insert({ user_id: session.user.id, post_id: postId })

  if (error) {
    if (error.code === '23505') return { error: null } // already liked, ignore and don't increment
    logError('[E-XANH] Lỗi thích bài viết:', error?.message || error)
    return { error }
  }

  // Dùng RPC hoặc Trigger để cập nhật đếm (tránh race condition)
  await supabase.rpc('increment_likes_count', { row_id: postId })

  return { error: null }
}

export async function unlikePost(postId) {
  const session = await getCurrentSession()
  if (!session?.user) return { error: new Error('Bạn cần đăng nhập.') }

  const { data, error } = await supabase
    .from('post_likes')
    .delete()
    .eq('user_id', session.user.id)
    .eq('post_id', postId)
    .select()

  if (error) {
    logError('[E-XANH] Lỗi bỏ thích bài viết:', error?.message || error)
    return { error }
  }

  if (!data || data.length === 0) {
    return { error: null }
  }

  // Dùng RPC hoặc Trigger để cập nhật đếm (tránh race condition)
  await supabase.rpc('decrement_likes_count', { row_id: postId })

  return { error: null }
}

export async function isPostLiked(postId) {
  const session = await getCurrentSession()
  if (!session?.user) return { data: false, error: null }

  const { data, error } = await supabase
    .from('post_likes')
    .select('post_id')
    .eq('user_id', session.user.id)
    .eq('post_id', postId)
    .maybeSingle()

  if (error) {
    logError('[E-XANH] Lỗi kiểm tra bài đã thích:', error?.message || error)
    return { data: false, error }
  }
  
  return { data: !!data, error: null }
}

export async function addComment(postId, content) {
  const session = await getCurrentSession()
  if (!session?.user) return { data: null, error: new Error('Bạn cần đăng nhập để bình luận.') }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: session.user.id,
      content,
      status: 'visible'
    })
    .select(`
      *,
      profiles:user_id (name, email, avatar_url, role)
    `)
    .single()

  if (error) {
    logError('[E-XANH] Lỗi thêm bình luận:', error?.message || error)
    return { data: null, error }
  }
  return { data, error: null }
}

export async function getCommentsByPostId(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id (name, email, avatar_url, role)
    `)
    .eq('post_id', postId)
    .eq('status', 'visible')
    .order('created_at', { ascending: true })

  if (error) {
    logError('[E-XANH] Lỗi lấy bình luận:', error?.message || error)
    return { data: [], error }
  }
  return { data, error: null }
}

export async function deleteMyComment(commentId) {
  const session = await getCurrentSession()
  if (!session?.user) return { error: new Error('Bạn cần đăng nhập.') }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', session.user.id)

  if (error) {
    logError('[E-XANH] Lỗi xóa bình luận:', error?.message || error)
    return { error }
  }
  return { error: null }
}

export async function getAllCommentsAdmin() {
  const session = await getCurrentSession()
  if (!session?.user) return { data: [], error: new Error('Not logged in') }

  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id (name, email, avatar_url),
      posts (title),
      reports (id, reason)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    logError('[E-XANH] Lỗi lấy tất cả bình luận:', error?.message || error)
    return { data: [], error }
  }
  return { data, error: null }
}

export async function updateCommentStatusAdmin(commentId, status) {
  const { data, error } = await supabase
    .from('comments')
    .update({ status })
    .eq('id', commentId)
    .select()
    .single()

  if (error) {
    logError('[E-XANH] Lỗi cập nhật trạng thái bình luận:', error?.message || error)
    return { data: null, error }
  }
  return { data, error: null }
}

export async function deleteCommentAdmin(commentId) {
  const session = await getCurrentSession()
  const adminId = session?.user?.id || null

  let { data, error } = await supabase
    .from('comments')
    .update({
      status: 'deleted',
      deleted_at: new Date().toISOString(),
      deleted_by: adminId,
    })
    .eq('id', commentId)
    .select()
    .single()

  if (error && isCommentSchemaMismatch(error)) {
    logError('[E-XANH] Comments schema cũ, fallback xóa mềm cơ bản.', error)

    const fallbackResult = await supabase
      .from('comments')
      .update({
        status: 'deleted',
      })
      .eq('id', commentId)
      .select()
      .single()

    data = fallbackResult.data
    error = fallbackResult.error
  }

  if (error) {
    logError('[E-XANH] Lỗi xóa mềm bình luận (admin):', error?.message || error)
    return { error }
  }
  return { data, error: null }
}

export async function updateCommentAdminNote(commentId, adminNote, moderationReason) {
  const updates = {}
  if (adminNote !== undefined) updates.admin_note = adminNote
  if (moderationReason !== undefined) updates.moderation_reason = moderationReason

  let { data, error } = await supabase
    .from('comments')
    .update(updates)
    .eq('id', commentId)
    .select()
    .single()

  if (error && isCommentSchemaMismatch(error)) {
    logError('[E-XANH] Comments schema cũ, chưa lưu được admin note.', error)
    return {
      data: null,
      error: new Error('Supabase hiện tại chưa có cột ghi chú moderation cho comments. Hãy chạy migration admin-upgrade để dùng ghi chú admin.'),
    }
  }

  if (error) {
    logError('[E-XANH] Lỗi lưu ghi chú admin:', error?.message || error)
    return { data: null, error }
  }
  return { data, error: null }
}

export async function updateCommentStatusAdminFull(commentId, status, adminId) {
  const updates = { status }

  if (status === 'hidden') {
    updates.hidden_at = new Date().toISOString()
    updates.hidden_by = adminId
  } else if (status === 'spam') {
    updates.spam_at = new Date().toISOString()
    updates.spam_by = adminId
  } else if (status === 'visible') {
    updates.hidden_at = null
    updates.hidden_by = null
    updates.spam_at = null
    updates.spam_by = null
    updates.deleted_at = null
    updates.deleted_by = null
  }

  let { data, error } = await supabase
    .from('comments')
    .update(updates)
    .eq('id', commentId)
    .select()
    .single()

  if (error && isCommentSchemaMismatch(error)) {
    logError('[E-XANH] Comments schema cũ, fallback cập nhật status cơ bản.', error)

    const fallbackResult = await supabase
      .from('comments')
      .update({ status })
      .eq('id', commentId)
      .select()
      .single()

    data = fallbackResult.data
    error = fallbackResult.error
  }

  if (error) {
    logError('[E-XANH] Lỗi cập nhật trạng thái bình luận:', error?.message || error)
    return { data: null, error }
  }
  return { data, error: null }
}

export async function sendCommentNotification(userId, commentContent, action, postTitle, commentId = null) {
  const session = await getCurrentSession()
  if (!session?.user) return { error: new Error('Not logged in') }

  const actionMessages = {
    hidden: 'Bình luận của bạn đã bị ẩn vì vi phạm quy định cộng đồng.',
    spam: 'Bình luận của bạn đã bị đánh dấu spam.',
    deleted: 'Bình luận của bạn đã bị xóa vì vi phạm quy định cộng đồng.',
    warning: 'Bạn nhận được cảnh báo về bình luận vi phạm quy định cộng đồng.',
  }

  const message = actionMessages[action] || `Bình luận của bạn trong bài "${postTitle}" đã bị xử lý bởi quản trị viên.`
  const notificationType = action === 'warning' ? 'comment_warning' : 'moderation'
  const severity = action === 'warning' ? 'warning' : 'critical'

  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Thông báo về bình luận',
        message: `${message}\n\nNội dung: "${commentContent?.slice(0, 100)}${commentContent?.length > 100 ? '...' : ''}"${postTitle ? `\nBài viết: ${postTitle}` : ''}`,
        type: notificationType,
        severity,
        related_type: 'comment',
        related_id: commentId ? String(commentId) : null,
        created_by: session.user.id,
      })

    if (error) {
      logError('[E-XANH] Lỗi gửi thông báo bình luận:', error?.message || error)
      return { error: mapCommentNotificationError(error) }
    }
    return { error: null }
  } catch (err) {
    logError('[E-XANH] Exception gửi thông báo:', err)
    return { error: mapCommentNotificationError(err) }
  }
}

