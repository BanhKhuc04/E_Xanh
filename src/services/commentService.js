import { logError } from '../utils/logger'
import { supabase } from '../lib/supabase'

export function formatComment(comment) {
  let authorName = 'Người dùng E-XANH'
  let avatarUrl = `https://ui-avatars.com/api/?name=U&background=c1d95c&color=fff`

  if (comment.profiles === undefined) {
    // Fallback if not processed
    authorName = 'Người dùng E-XANH'
  } else if (comment.profiles === null) {
    authorName = 'Người dùng đã ẩn'
  } else {
    if (comment.profiles.name && comment.profiles.name.trim() !== '') {
      authorName = comment.profiles.name
    }
    if (comment.profiles.avatar_url) {
      avatarUrl = comment.profiles.avatar_url
    } else {
      avatarUrl = `https://ui-avatars.com/api/?name=${authorName}&background=c1d95c&color=fff`
    }
  }

  return {
    id: comment.id,
    authorId: comment.user_id,
    author: authorName,
    avatar: avatarUrl,
    content: comment.content,
    createdAt: comment.created_at,
  }
}

export async function getCommentsByPost(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      user_id,
      content,
      created_at
    `)
    .eq('post_id', postId)
    .eq('status', 'visible')
    .order('created_at', { ascending: false })

  if (error) {
    logError('Error fetching comments:', error?.message || error)
    return { data: null, error }
  }

  const userIds = [...new Set(data.map(c => c.user_id))]
  if (userIds.length > 0) {
    const { data: profilesData } = await supabase
      .from('public_profiles')
      .select('id, name, avatar_url')
      .in('id', userIds)

    if (profilesData) {
      const profileMap = Object.fromEntries(profilesData.map(p => [p.id, p]))
      data.forEach(comment => {
        comment.profiles = profileMap[comment.user_id] || null
      })
    } else {
      data.forEach(comment => {
        comment.profiles = null
      })
    }
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
      user_id,
      content,
      created_at
    `)
    .single()

  if (error) {
    logError('Error creating comment:', error?.message || error)
    return { data: null, error }
  }

  const { data: profile } = await supabase
    .from('public_profiles')
    .select('name, avatar_url')
    .eq('id', userId)
    .single()
    
  data.profiles = profile || null

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
