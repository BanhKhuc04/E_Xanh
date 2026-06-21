import { supabase } from '../lib/supabase'
import { uploadOptimizedImage } from './mediaUploadService'

export const DEFAULT_USER_PREFERENCES = {
  profile_visibility: 'public',
  show_facebook: true,
  show_public_posts: true,
  allow_search_index: true,
  notify_system: true,
  notify_post_review: false,
  notify_comment_moderation: true,
  notify_interactions: false,
}

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

export function normalizeUserPreferences(value) {
  const source = isObject(value) ? value : {}

  return {
    ...DEFAULT_USER_PREFERENCES,
    ...source,
    profile_visibility: ['public', 'authenticated', 'private'].includes(source.profile_visibility)
      ? source.profile_visibility
      : DEFAULT_USER_PREFERENCES.profile_visibility,
    show_facebook: source.show_facebook ?? DEFAULT_USER_PREFERENCES.show_facebook,
    show_public_posts: source.show_public_posts ?? DEFAULT_USER_PREFERENCES.show_public_posts,
    allow_search_index: source.allow_search_index ?? DEFAULT_USER_PREFERENCES.allow_search_index,
    notify_system: source.notify_system ?? DEFAULT_USER_PREFERENCES.notify_system,
    notify_post_review: source.notify_post_review ?? DEFAULT_USER_PREFERENCES.notify_post_review,
    notify_comment_moderation: source.notify_comment_moderation ?? DEFAULT_USER_PREFERENCES.notify_comment_moderation,
    notify_interactions: source.notify_interactions ?? DEFAULT_USER_PREFERENCES.notify_interactions,
  }
}

export function normalizeProfileRecord(record = {}) {
  return {
    ...record,
    avatar_url: record?.avatar_url || '',
    cover_url: record?.cover_url || '',
    bio: record?.bio || '',
    facebook_url: record?.facebook_url || '',
    website_url: record?.website_url || '',
    user_preferences: normalizeUserPreferences(record?.user_preferences),
  }
}

export function isProfileSettingsMigrationRequired(error) {
  const message = String(error?.message || '').toLowerCase()
  return (
    error?.code === '42703' ||
    message.includes('column') ||
    message.includes('user_preferences') ||
    message.includes('website_url') ||
    message.includes('cover_url')
  )
}

export async function getPublicProfile(userId) {
  if (!userId) return { data: null, error: new Error('User ID required') }
  const { data, error } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) return { data: null, error }
  return { data: normalizeProfileRecord(data), error: null }
}
export async function getCurrentProfile() {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !sessionData.session) {
    return { data: null, error: new Error('Không tìm thấy phiên đăng nhập.') }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', sessionData.session.user.id)
    .single()

  return { data: data ? normalizeProfileRecord(data) : null, error }
}

const ALLOWED_PROFILE_FIELDS = ['name', 'bio', 'avatar_url', 'cover_url', 'facebook_url', 'website_url']

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
    .select('id, email, name, bio, avatar_url, cover_url, facebook_url, website_url, role, status, created_at, updated_at')
    .single()

  return { data: data ? normalizeProfileRecord(data) : null, error }
}

export async function updateProfilePreferences(preferences = {}) {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

  if (sessionError || !sessionData?.session?.user?.id) {
    return {
      data: null,
      error: new Error('Bạn cần đăng nhập để cập nhật cài đặt tài khoản.'),
    }
  }

  const nextPreferences = normalizeUserPreferences(preferences)

  const { data, error } = await supabase
    .from('profiles')
    .update({
      user_preferences: nextPreferences,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionData.session.user.id)
    .select('id, user_preferences, updated_at')
    .single()

  return {
    data: data
      ? {
          ...data,
          user_preferences: normalizeUserPreferences(data.user_preferences),
        }
      : null,
    error,
  }
}

export async function uploadAvatarImage(file) {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !sessionData?.session?.user?.id) {
    return {
      publicUrl: null,
      error: new Error('Bạn cần đăng nhập để tải ảnh đại diện.'),
    }
  }

  const result = await uploadOptimizedImage({
    file,
    bucket: 'profile-avatars',
    folder: 'avatars',
    preset: 'avatar',
    variants: false,
    userId: sessionData.session.user.id,
  })

  if (result.error) {
    return { publicUrl: null, error: result.error }
  }

  return { publicUrl: result.publicUrl, error: null }
}

export async function uploadProfileCover(file) {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !sessionData?.session?.user?.id) {
    return {
      publicUrl: null,
      error: new Error('Bạn cần đăng nhập để tải ảnh bìa.'),
    }
  }

  const result = await uploadOptimizedImage({
    file,
    bucket: 'profile-covers',
    folder: 'covers',
    preset: 'postDetail', 
    variants: false,
    userId: sessionData.session.user.id,
  })

  if (result.error) {
    return { publicUrl: null, error: result.error }
  }

  return { publicUrl: result.publicUrl, error: null }
}
