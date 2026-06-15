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
    let query = supabase.from('posts').select('status, created_at')
    if (startDate) query = query.gte('created_at', startDate)
    const { data } = await query
    if (data) {
      result.totalPosts = data.length
      result.approvedPosts = data.filter(p => p.status === 'approved').length
      result.pendingPosts = data.filter(p => p.status === 'pending').length
      result.rejectedHiddenPosts = data.filter(p => ['rejected', 'hidden', 'blocked'].includes(p.status)).length
    }
  } catch (e) { /* ignore */ }

  // Users
  try {
    const { data } = await supabase.from('profiles').select('status, created_at')
    if (data) {
      result.totalUsers = data.length // always total
      result.activeUsers = data.filter(u => u.status === 'active').length
      result.lockedUsers = data.filter(u => ['locked', 'blocked'].includes(u.status)).length
      result.deletedUsers = data.filter(u => u.status === 'deleted').length
    }
  } catch (e) { /* ignore */ }

  // Saved Posts
  try {
    let query = supabase.from('saved_posts').select('*', { count: 'exact', head: true })
    if (startDate) query = query.gte('created_at', startDate)
    const { count } = await query
    if (count !== null) result.totalSavedPosts = count
  } catch (e) { /* ignore */ }

  // Comments
  try {
    let query = supabase.from('comments').select('status, created_at')
    if (startDate) query = query.gte('created_at', startDate)
    const { data } = await query
    if (data) {
      result.totalComments = data.length
      result.hiddenSpamComments = data.filter(c => ['hidden', 'spam', 'deleted'].includes(c.status)).length
    }
  } catch (e) { /* ignore */ }

  // Devices
  try {
    const { count } = await supabase.from('devices').select('*', { count: 'exact', head: true })
    if (count !== null) result.totalDevices = count
  } catch (e) { /* ignore */ }

  // Electricity checks
  try {
    let query = supabase.from('electricity_checks').select('*', { count: 'exact', head: true })
    if (startDate) query = query.gte('checked_at', startDate)
    const { count } = await query
    if (count !== null) result.totalElectricityChecks = count
  } catch (e) { /* ignore */ }

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
  } catch (e) { /* ignore */ }

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
  } catch (e) { /* ignore */ }

  return result
}

export async function getTrendData(table, dateField, range = '30 ngày qua') {
  const startDate = getDateRange(range)
  const days = range === 'Hôm nay' ? 1 : range === '7 ngày qua' ? 7 : 30

  try {
    let query = supabase.from(table).select(dateField)
    if (startDate) query = query.gte(dateField, startDate)
    query = query.order(dateField, { ascending: true })

    const { data } = await query
    if (!data || data.length === 0) return []

    // Group by day
    const grouped = {}
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      grouped[key] = 0
    }

    data.forEach(row => {
      const date = new Date(row[dateField])
      const key = date.toISOString().split('T')[0]
      if (grouped[key] !== undefined) {
        grouped[key]++
      }
    })

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      label: new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      count,
    }))
  } catch (e) {
    return []
  }
}

export async function getPostTrend(range) {
  return getTrendData('posts', 'created_at', range)
}

export async function getUserTrend(range) {
  return getTrendData('profiles', 'created_at', range)
}

export async function getCommentTrend(range) {
  return getTrendData('comments', 'created_at', range)
}

export async function getSavedPostTrend(range) {
  return getTrendData('saved_posts', 'created_at', range)
}

export async function getActivityTrend(range = '30 ngày qua') {
  const [posts, comments, saves, checks] = await Promise.all([
    getPostTrend(range),
    getCommentTrend(range),
    getSavedPostTrend(range),
    getTrendData('electricity_checks', 'checked_at', range),
  ])

  const byDate = new Map()
  ;[posts, comments, saves, checks].forEach((items, index) => {
    items.forEach((item) => {
      const current = byDate.get(item.date) ?? {
        day: item.label,
        posts: 0,
        comments: 0,
        saves: 0,
        checks: 0,
      }
      if (index === 0) current.posts = item.count
      if (index === 1) current.comments = item.count
      if (index === 2) current.saves = item.count
      if (index === 3) current.checks = item.count
      byDate.set(item.date, current)
    })
  })

  return Array.from(byDate.entries())
    .sort(([left], [right]) => new Date(left) - new Date(right))
    .map(([, value]) => value)
}

export async function getContentTypeBreakdown(range = '30 ngày qua') {
  const startDate = getDateRange(range)

  try {
    let query = supabase.from('posts').select('type, created_at')
    if (startDate) query = query.gte('created_at', startDate)
    const { data } = await query
    const counts = {
      tip: 0,
      community: 0,
      review: 0,
      qa: 0,
    }

    ;(data ?? []).forEach((item) => {
      if (counts[item.type] !== undefined) {
        counts[item.type] += 1
      }
    })

    const total = Object.values(counts).reduce((sum, value) => sum + value, 0)
    const toPercent = (value) => (total > 0 ? Math.round((value / total) * 100) : 0)

    return [
      { label: 'Mẹo tiết kiệm', raw: counts.tip, value: toPercent(counts.tip), color: '#80B155' },
      { label: 'Cộng đồng', raw: counts.community, value: toPercent(counts.community), color: '#C1D95C' },
      { label: 'Review thiết bị', raw: counts.review, value: toPercent(counts.review), color: '#4F8428' },
      { label: 'Hỏi đáp', raw: counts.qa, value: toPercent(counts.qa), color: '#EAF59D' },
    ]
  } catch (error) {
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
  } catch (error) {
    return []
  }
}

export async function getTopDevices(limit = 5) {
  try {
    const { data } = await supabase
      .from('electricity_check_items')
      .select('device_name')

    const counts = new Map()
    ;(data ?? []).forEach((item) => {
      const name = item.device_name || 'Thiết bị khác'
      counts.set(name, (counts.get(name) ?? 0) + 1)
    })

    return Array.from(counts.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, limit)
      .map(([name, count], index) => ({
        name,
        count,
        icon: ['⚡', '💻', '💡', '🧊', '🧺'][index] || '⚙️',
      }))
  } catch (error) {
    return []
  }
}
