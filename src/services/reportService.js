import { supabase } from '../lib/supabase'
import { getCurrentSession } from './authService'
import { logError } from '../utils/logger'

export async function createReport({ postId = null, commentId = null, reason }) {
  const session = await getCurrentSession()
  if (!session?.user) {
    return { data: null, error: new Error('Bạn cần đăng nhập để gửi báo cáo.') }
  }

  const payload = {
    reporter_id: session.user.id,
    post_id: postId,
    comment_id: commentId,
    reason: reason,
    status: 'pending'
  }

  const { data, error } = await supabase
    .from('reports')
    .insert([payload])
    .select()
    .single()

  if (error) {
    logError('[ReportService] Lỗi tạo báo cáo:', error.message)
  }

  return { data, error }
}

export async function getAllReportsAdmin() {
  const { data, error } = await supabase
    .from('reports')
    .select(`
      *,
      reporter:reporter_id (name, email),
      posts (id, title),
      comments (id, content)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    logError('[ReportService] Lỗi lấy báo cáo quản trị:', error.message)
  }

  return { data, error }
}
