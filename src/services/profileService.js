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

export async function updateProfile(updates) {
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData?.session) {
    return { data: null, error: new Error('Bạn cần đăng nhập.') }
  }

  const safeUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) =>
      ALLOWED_PROFILE_FIELDS.includes(key)
    )
  )

  if (safeUpdates.name !== undefined && safeUpdates.name.trim() === '') {
    return { data: null, error: new Error('Tên không được để trống.') }
  }

  if (Object.keys(safeUpdates).length === 0) {
    return {
      data: null,
      error: new Error('Không có trường hợp lệ để cập nhật.')
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(safeUpdates)
    .eq('id', sessionData.session.user.id)
    .select()
    .single()

  return { data, error }
}
