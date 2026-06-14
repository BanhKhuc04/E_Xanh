import { supabase } from '../lib/supabase'

export async function getCurrentProfile() {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !sessionData.session) {
    return { data: null, error: new Error('Không tìm thấy phiên đăng nhập.') }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, avatar_url, bio, role, status')
    .eq('id', sessionData.session.user.id)
    .single()

  return { data, error }
}

const ALLOWED_PROFILE_FIELDS = ['name', 'bio', 'avatar_url']

function pickSafeProfileUpdates(updates = {}) {
  return Object.fromEntries(
    Object.entries(updates).filter(([key]) =>
      ALLOWED_PROFILE_FIELDS.includes(key)
    )
  )
}

export async function updateProfile(updates) {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError || !sessionData?.session?.user?.id) {
    return { 
      data: null, 
      error: new Error('Bạn cần đăng nhập để cập nhật hồ sơ.') 
    }
  }

  const safeUpdates = pickSafeProfileUpdates(updates)

  if (Object.keys(safeUpdates).length === 0) {
    return {
      data: null,
      error: new Error('Không có thông tin hợp lệ để cập nhật.')
    }
  }

  if ('name' in safeUpdates && !String(safeUpdates.name || '').trim()) {
    return { 
      data: null, 
      error: new Error('Tên hiển thị không được để trống.') 
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...safeUpdates,
      updated_at: new Date().toISOString()
    })
    .eq('id', sessionData.session.user.id)
    .select('id, email, name, bio, avatar_url, role, status, created_at, updated_at')
    .single()

  return { data, error }
}

