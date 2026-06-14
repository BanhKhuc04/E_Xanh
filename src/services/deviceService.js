import { supabase } from '../lib/supabase'

export async function getAllDevicesAdmin() {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[E-XANH] Lỗi lấy danh sách thiết bị admin:', error?.message || error)
    return { data: [], error }
  }
  return { data, error: null }
}

export async function createDevice(payload) {
  const { data, error } = await supabase
    .from('devices')
    .insert(payload)
    .select()
    .single()
  
  if (error) {
    console.error('[E-XANH] Lỗi thêm thiết bị:', error?.message || error)
    return { data: null, error }
  }
  return { data, error: null }
}

export async function updateDevice(id, payload) {
  const { data, error } = await supabase
    .from('devices')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
    
  if (error) {
    console.error('[E-XANH] Lỗi cập nhật thiết bị:', error?.message || error)
    return { data: null, error }
  }
  return { data, error: null }
}

export async function deleteDevice(id) {
  const { error } = await supabase
    .from('devices')
    .delete()
    .eq('id', id)
    
  if (error) {
    console.error('[E-XANH] Lỗi xóa thiết bị:', error?.message || error)
    return { error }
  }
  return { error: null }
}

export async function bulkUpdateDeviceVisibility(ids, isVisible) {
  const { error } = await supabase
    .from('devices')
    .update({ is_visible: isVisible })
    .in('id', ids)
    
  if (error) {
    console.error('[E-XANH] Lỗi cập nhật hiển thị hàng loạt:', error?.message || error)
    return { error }
  }
  return { error: null }
}

export async function bulkDeleteDevices(ids) {
  const { error } = await supabase
    .from('devices')
    .delete()
    .in('id', ids)
    
  if (error) {
    console.error('[E-XANH] Lỗi xóa hàng loạt:', error?.message || error)
    return { error }
  }
  return { error: null }
}
