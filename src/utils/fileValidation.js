export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

export const ALLOWED_PROFILE_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm']
export const MAX_VIDEO_SIZE = 10 * 1024 * 1024

function formatAllowedTypesLabel(allowedTypes) {
  const labels = []

  if (allowedTypes.includes('image/jpeg')) labels.push('JPG')
  if (allowedTypes.includes('image/png')) labels.push('PNG')
  if (allowedTypes.includes('image/webp')) labels.push('WebP')
  if (allowedTypes.includes('image/gif')) labels.push('GIF')
  if (allowedTypes.includes('video/mp4')) labels.push('MP4')
  if (allowedTypes.includes('video/webm')) labels.push('WebM')

  return labels.join(', ')
}

export function validateImageFile(file, options = {}) {
  const {
    allowedTypes = ALLOWED_IMAGE_TYPES,
    maxSize = MAX_IMAGE_SIZE,
    emptyMessage = 'Vui lòng chọn ảnh.',
    invalidTypeMessage,
    sizeMessage,
  } = options

  if (!file) {
    return { valid: false, error: emptyMessage }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error:
        invalidTypeMessage ||
        `Chỉ chấp nhận ảnh ${formatAllowedTypesLabel(allowedTypes)}.`,
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error:
        sizeMessage ||
        `Ảnh không được vượt quá ${Math.round(maxSize / (1024 * 1024))}MB.`,
    }
  }

  return { valid: true, error: null }
}

export function validateVideoFile(file, options = {}) {
  const {
    allowedTypes = ALLOWED_VIDEO_TYPES,
    maxSize = MAX_VIDEO_SIZE,
    emptyMessage = 'Vui lòng chọn video.',
    invalidTypeMessage,
    sizeMessage,
  } = options

  if (!file) {
    return { valid: false, error: emptyMessage }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error:
        invalidTypeMessage ||
        `Chỉ chấp nhận video ${formatAllowedTypesLabel(allowedTypes)}.`,
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error:
        sizeMessage ||
        `Video không được vượt quá ${Math.round(maxSize / (1024 * 1024))}MB.`,
    }
  }

  return { valid: true, error: null }
}

export function createSafeFileName(file, prefix = 'image') {
  const ext = file?.name?.split('.').pop()?.toLowerCase() || 'jpg'
  const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'webm'].includes(ext) ? ext : 'jpg'
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`

  return `${prefix}-${id}.${safeExt}`
}
