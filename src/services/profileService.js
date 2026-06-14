import { supabase } from '../lib/supabase'
import {
  ALLOWED_PROFILE_IMAGE_TYPES,
  createSafeFileName,
  validateImageFile,
} from '../utils/fileValidation'
import {
  compressImageToWebp,
  isCompressibleImageType,
} from '../utils/imageCompress'
import { logError } from '../utils/logger'

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

export async function uploadAvatarImage(file) {
  const validation = validateImageFile(file, {
    allowedTypes: ALLOWED_PROFILE_IMAGE_TYPES,
    invalidTypeMessage: 'Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.',
    sizeMessage: 'Ảnh đại diện không được vượt quá 5MB.',
  })

  if (!validation.valid) {
    return { publicUrl: null, error: new Error(validation.error) }
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !sessionData?.session?.user?.id) {
    return {
      publicUrl: null,
      error: new Error('Bạn cần đăng nhập để tải ảnh đại diện.'),
    }
  }

  let uploadFile = file

  if (isCompressibleImageType(file)) {
    try {
      uploadFile = await compressImageToWebp(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.75,
        maxBytes: 80 * 1024,
        minQuality: 0.55,
      })
    } catch (error) {
      logError('Avatar compression failed, using original avatar image.', error)
    }
  }

  const fileName = createSafeFileName(uploadFile, 'avatar')
  const filePath = `avatars/${sessionData.session.user.id}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('profile-avatars')
    .upload(filePath, uploadFile, {
      cacheControl: '31536000',
      upsert: true,
      contentType: uploadFile.type || file.type,
    })

  if (uploadError) {
    return {
      publicUrl: null,
      error: new Error(uploadError.message || 'Upload ảnh đại diện thất bại.'),
    }
  }

  const { data: publicUrlData } = supabase.storage
    .from('profile-avatars')
    .getPublicUrl(filePath)

  return { publicUrl: publicUrlData.publicUrl, error: null }
}
