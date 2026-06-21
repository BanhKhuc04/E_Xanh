import { logError } from '../utils/logger'
import { supabase } from '../lib/supabase'

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

const PASSWORD_RESET_CONTEXT_KEY = 'exanh-password-reset-context'
const PASSWORD_RESET_CONTEXT_TTL_MS = 30 * 60 * 1000
const PASSWORD_RESET_PATH = '/dat-lai-mat-khau'

function getPasswordResetRedirectUrl() {
  if (typeof window === 'undefined') return PASSWORD_RESET_PATH
  return `${window.location.origin}${PASSWORD_RESET_PATH}`
}

function normalizeResetSource(source) {
  return source === 'settings' ? 'settings' : 'forgot-password'
}

function canUseStorage() {
  return typeof window !== 'undefined' && window.localStorage
}

export function persistPasswordResetContext({ email, source = 'forgot-password' }) {
  if (!canUseStorage() || !email) return

  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail) return

  try {
    window.localStorage.setItem(
      PASSWORD_RESET_CONTEXT_KEY,
      JSON.stringify({
        email: normalizedEmail,
        source: normalizeResetSource(source),
        expiresAt: Date.now() + PASSWORD_RESET_CONTEXT_TTL_MS,
      }),
    )
  } catch (error) {
    logError('[E-XANH] Không thể lưu password reset context:', error)
  }
}

export function getPasswordResetContext() {
  if (!canUseStorage()) return null

  try {
    const rawValue = window.localStorage.getItem(PASSWORD_RESET_CONTEXT_KEY)
    if (!rawValue) return null

    const parsedValue = JSON.parse(rawValue)
    if (!parsedValue?.email || !parsedValue?.expiresAt || parsedValue.expiresAt < Date.now()) {
      window.localStorage.removeItem(PASSWORD_RESET_CONTEXT_KEY)
      return null
    }

    return {
      email: String(parsedValue.email).trim().toLowerCase(),
      source: normalizeResetSource(parsedValue.source),
      expiresAt: Number(parsedValue.expiresAt),
    }
  } catch (error) {
    logError('[E-XANH] Không thể đọc password reset context:', error)
    return null
  }
}

export function clearPasswordResetContext() {
  if (!canUseStorage()) return

  try {
    window.localStorage.removeItem(PASSWORD_RESET_CONTEXT_KEY)
  } catch (error) {
    logError('[E-XANH] Không thể xóa password reset context:', error)
  }
}

export function getAuthCallbackParams() {
  if (typeof window === 'undefined') return new URLSearchParams()

  const query = new URLSearchParams(window.location.search)
  const hash = window.location.hash.startsWith('#')
    ? new URLSearchParams(window.location.hash.slice(1))
    : new URLSearchParams(window.location.hash)

  const merged = new URLSearchParams()
  query.forEach((value, key) => merged.set(key, value))
  hash.forEach((value, key) => merged.set(key, value))

  return merged
}

export function hasPasswordRecoveryParams() {
  const params = getAuthCallbackParams()
  const redirectType = params.get('type')

  return Boolean(
    redirectType === 'recovery' ||
      params.get('access_token') ||
      params.get('refresh_token') ||
      params.get('code') ||
      params.get('error') ||
      params.get('error_code'),
  )
}

export function stripAuthParamsFromUrl() {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  const authKeys = [
    'access_token',
    'refresh_token',
    'expires_at',
    'expires_in',
    'provider_token',
    'provider_refresh_token',
    'token_type',
    'type',
    'code',
    'error',
    'error_code',
    'error_description',
  ]

  authKeys.forEach((key) => {
    url.searchParams.delete(key)
  })

  if (window.location.hash) {
    const nextHash = new URLSearchParams(window.location.hash.slice(1))
    authKeys.forEach((key) => {
      nextHash.delete(key)
    })

    const hashString = nextHash.toString()
    url.hash = hashString ? `#${hashString}` : ''
  }

  window.history.replaceState(window.history.state, '', url.toString())
}

export async function requestPasswordReset(email, options = {}) {
  const normalizedEmail = email.trim().toLowerCase()
  const source = normalizeResetSource(options.source)

  const result = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo: getPasswordResetRedirectUrl(),
  })

  if (!result.error) {
    persistPasswordResetContext({ email: normalizedEmail, source })
  }

  return result
}

export async function getCurrentAuthUser() {
  const { data, error } = await supabase.auth.getUser()
  return {
    user: data?.user ?? null,
    error,
  }
}

export async function updateCurrentUserPassword(password) {
  return await supabase.auth.updateUser({
    password,
  })
}

export async function signUpWithEmail({ name, email, password }) {
  // Pass name in user_metadata so the trigger can pick it up
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
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
    await syncUserProfile(data.user)
  }
}

export async function syncUserProfile(user) {
  if (!user) return { error: new Error('User required') }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .single()

  if (profileError && profileError.code !== 'PGRST116') {
    return { error: profileError }
  }

  if (!profile) {
    const email = user.email
    let name = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0]
    const avatar_url = user.user_metadata?.avatar_url || null

    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      email,
      name,
      avatar_url,
      role: 'user',
      status: 'active'
    })
    
    if (insertError) {
      logError('[E-XANH] Error creating profile:', insertError)
      return { error: insertError }
    }
  }

  return { error: null }
}

export async function signInWithEmail({ email, password }) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}

export async function logAdminLogin(adminId, success) {
  try {
    const userAgent = navigator.userAgent;
    let ipAddress = 'unknown';
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      ipAddress = data.ip;
    } catch (e) {
      // ignore
    }
    await supabase.from('admin_login_history').insert({
      admin_id: adminId,
      ip_address: ipAddress,
      user_agent: userAgent,
      success
    });
  } catch (err) {
    console.error('Lỗi ghi log đăng nhập admin:', err);
  }
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

export function getBlockedProfileMessage(profile) {
  if (!profile) return ''

  if (profile.status === 'deleted') {
    return 'Tài khoản này đã bị vô hiệu hóa. Vui lòng liên hệ support@exanh.vn để được hỗ trợ.'
  }

  if (profile.status === 'locked' || profile.status === 'blocked') {
    return profile.ban_reason
      ? `Tài khoản của bạn đã bị khóa bởi quản trị viên.\n\nLý do: ${profile.ban_reason}`
      : 'Tài khoản của bạn đã bị khóa bởi quản trị viên. Vui lòng liên hệ support@exanh.vn nếu bạn cho rằng đây là nhầm lẫn.'
  }

  return ''
}

export async function ensureActiveProfileSession(userId) {
  const profile = await getCurrentUserProfile(userId)
  const message = getBlockedProfileMessage(profile)

  if (message) {
    await signOut()
    return {
      profile,
      allowed: false,
      message,
    }
  }

  return {
    profile,
    allowed: true,
    message: '',
  }
}

export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
  return data.subscription
}
