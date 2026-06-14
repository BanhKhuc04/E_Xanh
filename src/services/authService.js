import { logError } from '../utils/logger'
import { supabase } from '../lib/supabase'

export async function signUpWithEmail({ name, email, password }) {
  // Pass name in user_metadata so the trigger can pick it up
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
      },
    },
  })

  // Edge case fallback: Ensure profile name is set if trigger missed it somehow,
  // but only if signup succeeded and we got a session.
  // Actually, Supabase might require email confirmation, so session could be null.
  if (!error && data?.user) {
    // We can try to update profile if needed, but the trigger does it.
    // Let's explicitly do an update just to be safe as requested.
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ name })
      .eq('id', data.user.id)
    
    if (profileError) {
      console.warn('[E-XANH] Lỗi cập nhật tên profile:', profileError.message)
    }
  }

  return { data, error }
}

export async function signInWithEmail({ email, password }) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signOut() {
  return await supabase.auth.signOut()
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    logError('[E-XANH] Lỗi lấy session:', error.message)
    return null
  }
  return data.session
}

export async function getCurrentUserProfile(userId) {
  if (!userId) return null
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    logError('[E-XANH] Lỗi lấy profile:', error.message)
    return null
  }
  return data
}

export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
  return data.subscription
}
