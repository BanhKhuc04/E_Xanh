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

export async function updateProfile(updates) {
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData?.session) {
    return { data: null, error: new Error('Bạn cần đăng nhập.') }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', sessionData.session.user.id)
    .select()
    .single()

  return { data, error }
}
