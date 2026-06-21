import { supabase } from '../lib/supabase'

function getDateRange(range) {
  const now = new Date()
  let start = null

  if (range === 'Hôm nay') {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  } else if (range === '7 ngày qua') {
    start = new Date(now)
    start.setDate(start.getDate() - 7)
  } else if (range === '30 ngày qua') {
    start = new Date(now)
    start.setDate(start.getDate() - 30)
  } else if (range === 'Tháng này') {
    start = new Date(now.getFullYear(), now.getMonth(), 1)
  }

  return start ? start.toISOString() : null
}

export async function getAdminStats(range = '30 ngày qua') {
  const startDate = getDateRange(range)
  const result = {
    totalPosts: 0,
    approvedPosts: 0,
    pendingPosts: 0,
    rejectedHiddenPosts: 0,
    totalUsers: 0,
    activeUsers: 0,
    lockedUsers: 0,
    deletedUsers: 0,
    totalSavedPosts: 0,
    totalComments: 0,
    hiddenSpamComments: 0,
    totalDevices: 0,
    totalElectricityChecks: 0,
    recentPosts: [],
    pendingPostsList: [],
  }

  try {
    const { data: stats, error } = await supabase.rpc('get_admin_dashboard_stats', {
      start_date: startDate || '2000-01-01'
    })

    if (!error && stats) {
      Object.assign(result, {
        totalPosts: stats.totalPosts || 0,
        approvedPosts: stats.approvedPosts || 0,
        pendingPosts: stats.pendingPosts || 0,
        rejectedHiddenPosts: stats.rejectedHiddenPosts || 0,
        totalUsers: stats.totalUsers || 0,
        activeUsers: stats.activeUsers || 0,
        lockedUsers: stats.lockedUsers || 0,
        deletedUsers: stats.deletedUsers || 0,
        totalSavedPosts: stats.totalSavedPosts || 0,
        totalComments: stats.totalComments || 0,
        hiddenSpamComments: stats.hiddenSpamComments || 0,
        totalDevices: stats.totalDevices || 0,
        totalElectricityChecks: stats.totalElectricityChecks || 0,
      })
    }
  } catch { /* ignore error and fall back to 0 */ }

  try {
    const { data } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        status,
        created_at,
        published_at,
        profiles:author_id(name)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    result.recentPosts = data ?? []
  } catch { /* ignore */ }

  try {
    const { data } = await supabase
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
      .limit(8)

    result.pendingPostsList = data ?? []
  } catch { /* ignore */ }

  return result
}

export async function getActivityTrend(range = '30 ngày qua') {
  const days = range === 'Hôm nay' ? 1 : range === '7 ngày qua' ? 7 : 30
  try {
    const { data, error } = await supabase.rpc('get_activity_trend', { days_count: days })
    if (error) throw error
    return data.sort((a, b) => new Date(a.date) - new Date(b.date)).map(item => ({
      day: item.label,
      posts: parseInt(item.posts || 0),
      comments: parseInt(item.comments || 0),
      saves: parseInt(item.saves || 0),
      checks: parseInt(item.checks || 0),
    }))
  } catch (err) {
    console.error('[Analytics] Lỗi khi lấy activity trend bằng RPC:', err)
    return []
  }
}

export async function getContentTypeBreakdown(range = '30 ngày qua') {
  const startDate = getDateRange(range)

  try {
    const types = ['tip', 'community', 'review', 'qa']
    const counts = { tip: 0, community: 0, review: 0, qa: 0 }
    const promises = types.map((type) => {
      let query = supabase.from('posts').select('*', { count: 'exact', head: true }).eq('type', type)
      if (startDate) query = query.gte('created_at', startDate)
      return query.then(({ count }) => {
        counts[type] = count || 0
      })
    })

    await Promise.all(promises)

    const total = Object.values(counts).reduce((sum, value) => sum + value, 0)
    const toPercent = (value) => (total > 0 ? Math.round((value / total) * 100) : 0)

    return [
      { label: 'Mẹo tiết kiệm', raw: counts.tip, value: toPercent(counts.tip), color: '#80B155' },
      { label: 'Cộng đồng', raw: counts.community, value: toPercent(counts.community), color: '#C1D95C' },
      { label: 'Review thiết bị', raw: counts.review, value: toPercent(counts.review), color: '#4F8428' },
      { label: 'Hỏi đáp', raw: counts.qa, value: toPercent(counts.qa), color: '#EAF59D' },
    ]
  } catch {
    return []
  }
}

export async function getTopSavedPosts(limit = 5) {
  try {
    const { data } = await supabase
      .from('posts')
      .select('id, title, saved_count')
      .order('saved_count', { ascending: false })
      .limit(limit)

    return (data ?? []).map((item) => ({
      title: item.title || 'Bài viết chưa đặt tiêu đề',
      saves: item.saved_count || 0,
    }))
  } catch {
    return []
  }
}

export async function getTopDevices(limit = 5) {
  try {
    const { data, error } = await supabase.rpc('get_top_devices', { limit_count: limit })
    if (error) throw error
    return (data ?? []).map((item, index) => ({
      name: item.name,
      count: parseInt(item.count || 0),
      icon: ['⚡', '💻', '💡', '🧊', '🧺'][index] || '⚙️',
    }))
  } catch (err) {
    console.error('[Analytics] Lỗi khi lấy top devices bằng RPC:', err)
    return []
  }
}
