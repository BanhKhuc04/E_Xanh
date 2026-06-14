import { supabase } from '../lib/supabase'

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
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching comments:', error?.message || error)
    return { data: null, error }
  }

  // Transform to match UI needs
  const formattedData = data.map(comment => ({
    id: comment.id,
    author: comment.profiles?.name || 'Người dùng E-XANH',
    avatar: comment.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${comment.profiles?.name || 'U'}&background=c1d95c&color=fff`,
    content: comment.content,
    createdAt: comment.created_at
  }))

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
        content: content
      }
    ])
    .select(`
      id,
      content,
      created_at,
      profiles:user_id (name, avatar_url)
    `)
    .single()

  if (error) {
    console.error('Error creating comment:', error?.message || error)
    return { data: null, error }
  }

  const formattedData = {
    id: data.id,
    author: data.profiles?.name || 'Người dùng E-XANH',
    avatar: data.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${data.profiles?.name || 'U'}&background=c1d95c&color=fff`,
    content: data.content,
    createdAt: data.created_at
  }

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
    console.error('Error fetching my comments:', error?.message || error)
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
