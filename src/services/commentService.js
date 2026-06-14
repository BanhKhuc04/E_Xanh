import { logError } from '../utils/logger'
import { supabase } from '../lib/supabase'

export function formatComment(comment) {
  return {
    id: comment.id,
    author: comment.profiles?.name || 'Người dùng E-XANH',
    avatar:
      comment.profiles?.avatar_url ||
      `https://ui-avatars.com/api/?name=${comment.profiles?.name || 'U'}&background=c1d95c&color=fff`,
    content: comment.content,
    createdAt: comment.created_at,
  }
}

export async function getCommentsByPost(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      content,
      created_at,
      profiles:user_id (name, avatar_url)
    `)
    .eq('post_id', postId)
    .eq('status', 'visible')
    .order('created_at', { ascending: false })

  if (error) {
    logError('Error fetching comments:', error?.message || error)
    return { data: null, error }
  }

  const formattedData = data.map(formatComment)

  return { data: formattedData, error: null }
}

export async function createComment(postId, content) {
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData?.session) {
    return { data: null, error: new Error('Bạn cần đăng nhập để bình luận') }
  }

  const userId = sessionData.session.user.id

  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        post_id: postId,
        user_id: userId,
        content,
      },
    ])
    .select(`
      id,
      content,
      created_at,
      profiles:user_id (name, avatar_url)
    `)
    .single()

  if (error) {
    logError('Error creating comment:', error?.message || error)
    return { data: null, error }
  }

  const formattedData = formatComment(data)

  return { data: formattedData, error: null }
}

export async function getMyComments(userId) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      content,
      created_at,
      posts (title, slug, id)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    logError('Error fetching my comments:', error?.message || error)
    return { data: null, error }
  }

  const formattedData = data.map(comment => ({
    id: comment.id,
    content: comment.content,
    postTitle: comment.posts?.title || 'Bài viết không xác định',
    postId: comment.posts?.id,
    postSlug: comment.posts?.slug,
    time: new Date(comment.created_at).toLocaleDateString('vi-VN')
  }))

  return { data: formattedData, error: null }
}
