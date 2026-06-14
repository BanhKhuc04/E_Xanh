import { logError } from '../utils/logger'
import { supabase } from '../lib/supabase'
import { getCurrentSession } from './authService'

export async function savePost(postId) {
  const session = await getCurrentSession()
  if (!session?.user) return { error: new Error('Bạn cần đăng nhập để lưu bài viết.') }

  const { data: existing } = await supabase.from('saved_posts').select('user_id').eq('user_id', session.user.id).eq('post_id', postId).maybeSingle()
  if (existing) return { error: null } // already saved

  const { error } = await supabase
    .from('saved_posts')
    .insert({ user_id: session.user.id, post_id: postId })

  if (error && error.code !== '23505') {
    logError('[E-XANH] Lỗi lưu bài viết:', error?.message || error)
    return { error }
  }

  // Cập nhật đếm
  const { data: post } = await supabase.from('posts').select('saved_count').eq('id', postId).single()
  if (post) {
    await supabase.from('posts').update({ saved_count: (post.saved_count || 0) + 1 }).eq('id', postId)
  }

  return { error: null }
}

export async function unsavePost(postId) {
  const session = await getCurrentSession()
  if (!session?.user) return { error: new Error('Bạn cần đăng nhập.') }

  const { error } = await supabase
    .from('saved_posts')
    .delete()
    .eq('user_id', session.user.id)
    .eq('post_id', postId)

  if (error) {
    logError('[E-XANH] Lỗi bỏ lưu bài viết:', error?.message || error)
    return { error }
  }

  // Cập nhật đếm (không để âm)
  const { data: post } = await supabase.from('posts').select('saved_count').eq('id', postId).single()
  if (post && post.saved_count > 0) {
    await supabase.from('posts').update({ saved_count: post.saved_count - 1 }).eq('id', postId)
  }

  return { error: null }
}

export async function getMySavedPosts() {
  const session = await getCurrentSession()
  if (!session?.user) return { data: [], error: new Error('Bạn cần đăng nhập.') }

  const { data: savedRows, error: savedError } = await supabase
    .from('saved_posts')
    .select('post_id, created_at')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (savedError) {
    logError('[E-XANH] Lỗi lấy bài đã lưu:', savedError?.message || savedError)
    return { data: [], error: savedError }
  }

  if (!savedRows || savedRows.length === 0) {
    return { data: [], error: null }
  }

  const postIds = savedRows.map(row => row.post_id)

  const { data: postsData, error: postsError } = await supabase
    .from('posts')
    .select(`
      id, title, slug, description, image_url, category_id, type, status,
      likes_count, comments_count, saved_count, read_time,
      profiles (name, email, avatar_url)
    `)
    .in('id', postIds)

  if (postsError) {
    logError('[E-XANH] Lỗi lấy chi tiết posts:', postsError?.message || postsError)
    return { data: [], error: postsError }
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
      image: post.image_url,
      category: post.type === 'tip' ? 'Mẹo tiết kiệm' : post.type === 'community' ? 'Cộng đồng' : 'Hỏi đáp',
      author: post.profiles?.name || post.profiles?.email || 'Người dùng',
      savedAt: new Date(row.created_at).toLocaleDateString('vi-VN'),
      likes: post.likes_count || 0,
      savedType: 'Tất cả',
      status: post.status
    }
  }).filter(Boolean)

  return { data: mappedPosts, error: null }
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

  if (error && error.code !== '23505') {
    logError('[E-XANH] Lỗi thích bài viết:', error?.message || error)
    return { error }
  }

  const { data: post } = await supabase.from('posts').select('likes_count').eq('id', postId).single()
  if (post) {
    await supabase.from('posts').update({ likes_count: (post.likes_count || 0) + 1 }).eq('id', postId)
  }

  return { error: null }
}

export async function unlikePost(postId) {
  const session = await getCurrentSession()
  if (!session?.user) return { error: new Error('Bạn cần đăng nhập.') }

  const { error } = await supabase
    .from('post_likes')
    .delete()
    .eq('user_id', session.user.id)
    .eq('post_id', postId)

  if (error) {
    logError('[E-XANH] Lỗi bỏ thích bài viết:', error?.message || error)
    return { error }
  }

  const { data: post } = await supabase.from('posts').select('likes_count').eq('id', postId).single()
  if (post && post.likes_count > 0) {
    await supabase.from('posts').update({ likes_count: post.likes_count - 1 }).eq('id', postId)
  }

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
      profiles (name, email, avatar_url, role)
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
      profiles (name, email, avatar_url, role)
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
      profiles (name, email, avatar_url),
      posts (title)
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
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) {
    logError('[E-XANH] Lỗi xóa bình luận (admin):', error?.message || error)
    return { error }
  }
  return { error: null }
}

export async function followUser(followingId) {
  const session = await getCurrentSession()
  if (!session?.user) return { error: new Error('Bạn cần đăng nhập để theo dõi.') }

  if (session.user.id === followingId) {
    return { error: new Error('Không thể tự theo dõi chính mình.') }
  }

  const { error } = await supabase
    .from('user_follows')
    .insert({ follower_id: session.user.id, following_id: followingId })

  if (error && error.code !== '23505') {
    logError('[E-XANH] Lỗi theo dõi người dùng:', error?.message || error)
    return { error }
  }

  return { error: null }
}

export async function unfollowUser(followingId) {
  const session = await getCurrentSession()
  if (!session?.user) return { error: new Error('Bạn cần đăng nhập.') }

  const { error } = await supabase
    .from('user_follows')
    .delete()
    .eq('follower_id', session.user.id)
    .eq('following_id', followingId)

  if (error) {
    logError('[E-XANH] Lỗi hủy theo dõi người dùng:', error?.message || error)
    return { error }
  }

  return { error: null }
}

export async function checkFollowStatus(followingId) {
  const session = await getCurrentSession()
  if (!session?.user) return { data: false, error: null }

  const { data, error } = await supabase
    .from('user_follows')
    .select('following_id')
    .eq('follower_id', session.user.id)
    .eq('following_id', followingId)
    .maybeSingle()

  if (error) {
    logError('[E-XANH] Lỗi kiểm tra theo dõi:', error?.message || error)
    return { data: false, error }
  }
  
  return { data: !!data, error: null }
}
