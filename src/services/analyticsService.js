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

  // Posts
  try {
    const { count: cTotalPosts } = await supabase.from('posts').select('*', { count: 'exact', head: true }).gte('created_at', startDate || '2000-01-01')
    if (cTotalPosts !== null) result.totalPosts = cTotalPosts

    const { count: cApproved } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'approved').gte('created_at', startDate || '2000-01-01')
    if (cApproved !== null) result.approvedPosts = cApproved

    const { count: cPending } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'pending').gte('created_at', startDate || '2000-01-01')
    if (cPending !== null) result.pendingPosts = cPending

    const { count: cRejected } = await supabase.from('posts').select('*', { count: 'exact', head: true }).in('status', ['rejected', 'hidden', 'blocked']).gte('created_at', startDate || '2000-01-01')
    if (cRejected !== null) result.rejectedHiddenPosts = cRejected
  } catch { /* ignore */ }

  // Users
  try {
    const { count: cTotalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', startDate || '2000-01-01')
    if (cTotalUsers !== null) result.totalUsers = cTotalUsers // always total for the range

    const { count: cActive } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'active').gte('created_at', startDate || '2000-01-01')
    if (cActive !== null) result.activeUsers = cActive

    const { count: cLocked } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).in('status', ['locked', 'blocked']).gte('created_at', startDate || '2000-01-01')
    if (cLocked !== null) result.lockedUsers = cLocked

    const { count: cDeleted } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'deleted').gte('created_at', startDate || '2000-01-01')
    if (cDeleted !== null) result.deletedUsers = cDeleted
  } catch { /* ignore */ }

  // Saved Posts
  try {
    let query = supabase.from('saved_posts').select('*', { count: 'exact', head: true })
    if (startDate) query = query.gte('created_at', startDate)
    const { count } = await query
    if (count !== null) result.totalSavedPosts = count
  } catch { /* ignore */ }

  // Comments
  try {
    const { count: cTotalComments } = await supabase.from('comments').select('*', { count: 'exact', head: true }).gte('created_at', startDate || '2000-01-01')
    if (cTotalComments !== null) result.totalComments = cTotalComments

    const { count: cHidden } = await supabase.from('comments').select('*', { count: 'exact', head: true }).in('status', ['hidden', 'spam', 'deleted']).gte('created_at', startDate || '2000-01-01')
    if (cHidden !== null) result.hiddenSpamComments = cHidden
  } catch { /* ignore */ }

  // Devices
  try {
    const { count } = await supabase.from('devices').select('*', { count: 'exact', head: true })
    if (count !== null) result.totalDevices = count
  } catch { /* ignore */ }

  // Electricity checks
  try {
    let query = supabase.from('electricity_checks').select('*', { count: 'exact', head: true })
    if (startDate) query = query.gte('checked_at', startDate)
    const { count } = await query
    if (count !== null) result.totalElectricityChecks = count
  } catch { /* ignore */ }

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
