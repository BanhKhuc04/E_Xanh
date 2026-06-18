import { supabase } from '../lib/supabase'
import { getCurrentSession } from './authService'
import { logError } from '../utils/logger'

/**
 * Ghi log hành động của admin vào bảng admin_action_logs
 * @param {Object} params
 * @param {string} params.action - Tên hành động (vd: 'approve_post', 'lock_user')
 * @param {string} params.targetType - Loại đối tượng bị tác động ('post', 'user', 'comment')
 * @param {string} params.targetId - ID của đối tượng bị tác động
 * @param {Object} [params.metadata] - Dữ liệu bổ sung (JSON)
 * @returns {Promise<{data: any, error: any}>}
 */
export async function logAdminAction({ action, targetType, targetId, metadata = {} }) {
  if (!supabase) {
    return { data: null, error: new Error('Supabase chưa được cấu hình') }
  }

  try {
    const session = await getCurrentSession()
    if (!session?.user?.id) {
      return { data: null, error: new Error('Không có session đăng nhập') }
    }

    const payload = {
      admin_id: session.user.id,
      action: action,
      target_type: targetType,
      target_id: String(targetId),
      metadata: metadata,
    }

    const { data, error } = await supabase
      .from('admin_action_logs')
      .insert(payload)
      .select()
      .single()

    if (error) {
      logError('[AdminLog] Lỗi ghi log:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    logError('[AdminLog] Lỗi exception khi ghi log:', err)
    return { data: null, error: err }
  }
}
