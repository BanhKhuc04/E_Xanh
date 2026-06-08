import { supabase } from '../lib/supabase'

export async function getDashboardStats() {
  const result = {
    totalPosts: 0,
    approvedPosts: 0,
    pendingPosts: 0,
    rejectedHiddenPosts: 0,
    totalUsers: '-',
    totalSavedPosts: '-',
    recentPosts: [],
    pendingPostsList: []
  }

  // 1. Posts counts
  try {
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('status')
    
    if (!postsError && postsData) {
      result.totalPosts = postsData.length
      result.approvedPosts = postsData.filter(p => p.status === 'approved').length
      result.pendingPosts = postsData.filter(p => p.status === 'pending').length
      result.rejectedHiddenPosts = postsData.filter(p => p.status === 'rejected' || p.status === 'hidden').length
    } else if (postsError) {
      console.warn('Lỗi lấy thống kê bài viết:', postsError)
    }
  } catch (err) {
    console.warn('Exception lấy thống kê bài viết:', err)
  }

  // 2. Profiles count
  try {
    const { count, error: profileError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      
    if (!profileError && count !== null) {
      result.totalUsers = count
    } else if (profileError) {
      console.warn('RLS chặn đếm profiles:', profileError.message)
    }
  } catch (err) {
    console.warn('Exception đếm profiles:', err)
  }

  // 3. Saved posts count (Admin không có policy đọc toàn bộ bảng saved_posts)
  try {
    const { count, error: savedError } = await supabase
      .from('saved_posts')
      .select('*', { count: 'exact', head: true })

    if (!savedError && count !== null) {
      result.totalSavedPosts = count
    } else if (savedError) {
      console.warn('RLS chặn đếm saved_posts:', savedError.message)
    }
  } catch (err) {
    console.warn('Exception đếm saved_posts:', err)
  }

  // 4. Recent posts (limit 5)
  try {
    const { data: recent, error: recentError } = await supabase
      .from('posts')
      .select(`
        id, 
        title, 
        status, 
        created_at, 
        profiles:author_id(name)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    if (!recentError && recent) {
      result.recentPosts = recent
    } else if (recentError) {
      console.warn('Lỗi lấy bài viết gần đây:', recentError)
    }
  } catch (err) {
    console.warn('Exception lấy bài viết gần đây:', err)
  }

  // 5. Pending posts list
  try {
    const { data: pending, error: pendingError } = await supabase
      .from('posts')
      .select(`
        id, 
        title, 
        status, 
        created_at, 
        profiles:author_id(name)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (!pendingError && pending) {
      result.pendingPostsList = pending
    } else if (pendingError) {
      console.warn('Lỗi lấy bài viết chờ duyệt:', pendingError)
    }
  } catch (err) {
    console.warn('Exception lấy bài viết chờ duyệt:', err)
  }

  return result
}
