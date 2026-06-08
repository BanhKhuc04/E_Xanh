import { supabase } from '../lib/supabase'

export async function getAdminUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, name, avatar_url, role, status, created_at')
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function updateUserRole(userId, newRole, currentUserId) {
  // 1. Nếu Admin đang tự tác động lên chính mình
  if (userId === currentUserId && newRole !== 'admin') {
    // 2. Kiểm tra xem hệ thống còn bao nhiêu admin
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'admin')

    if (countError) {
      return { error: { message: 'Lỗi khi kiểm tra số lượng admin hệ thống.' } }
    }

    if (count <= 1) {
      return { error: { message: 'Không thể hạ quyền chính mình vì hệ thống cần ít nhất 1 admin.' } }
    }
  }

  // Thực hiện update
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)
    .select()

  return { data, error }
}

export async function updateUserStatus(userId, newStatus, currentUserId) {
  // 1. Không cho Admin tự khóa tài khoản của chính mình
  if (userId === currentUserId && newStatus !== 'active') {
    return { error: { message: 'Bạn không thể tự khóa tài khoản của chính mình.' } }
  }

  // Thực hiện update
  const { data, error } = await supabase
    .from('profiles')
    .update({ status: newStatus })
    .eq('id', userId)
    .select()

  return { data, error }
}
