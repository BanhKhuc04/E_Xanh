import { supabase } from '../lib/supabase'

export async function followUser(targetUserId) {
  const { data: session } = await supabase.auth.getSession()
  if (!session?.session?.user) {
    return { data: null, error: new Error('Vui lòng đăng nhập để theo dõi người dùng này.') }
  }

  const currentUserId = session.session.user.id

  if (currentUserId === targetUserId) {
    return { data: null, error: new Error('Không thể theo dõi chính mình.') }
  }

  const { data, error } = await supabase
    .from('user_follows')
    .insert([{ follower_id: currentUserId, following_id: targetUserId }])
    .select()
    .single()

  return { data, error }
}

export async function unfollowUser(targetUserId) {
  const { data: session } = await supabase.auth.getSession()
  if (!session?.session?.user) {
    return { data: null, error: new Error('Vui lòng đăng nhập để hủy theo dõi.') }
  }

  const currentUserId = session.session.user.id

  const { data, error } = await supabase
    .from('user_follows')
    .delete()
    .eq('follower_id', currentUserId)
    .eq('following_id', targetUserId)
    .select()

  return { data, error }
}

export async function isFollowing(targetUserId) {
  const { data: session } = await supabase.auth.getSession()
  if (!session?.session?.user) {
    return { data: false, error: null }
  }

  const currentUserId = session.session.user.id

  const { data, error } = await supabase
    .from('user_follows')
    .select('id')
    .eq('follower_id', currentUserId)
    .eq('following_id', targetUserId)
    .maybeSingle()

  if (error) {
    return { data: false, error }
  }

  return { data: !!data, error: null }
}

export async function getFollowStats(userId) {
  const [followersResult, followingResult] = await Promise.all([
    supabase
      .from('user_follows')
      .select('id', { count: 'exact', head: true })
      .eq('following_id', userId),
    supabase
      .from('user_follows')
      .select('id', { count: 'exact', head: true })
      .eq('follower_id', userId)
  ])

  return {
    followersCount: followersResult.count || 0,
    followingCount: followingResult.count || 0,
    error: followersResult.error || followingResult.error
  }
}
