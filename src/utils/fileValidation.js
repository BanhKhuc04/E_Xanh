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

function formatAllowedTypesLabel(allowedTypes) {
  const labels = []

  if (allowedTypes.includes('image/jpeg')) labels.push('JPG')
  if (allowedTypes.includes('image/png')) labels.push('PNG')
  if (allowedTypes.includes('image/webp')) labels.push('WebP')
  if (allowedTypes.includes('image/gif')) labels.push('GIF')

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

export function createSafeFileName(file, prefix = 'image') {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) ? ext : 'jpg'
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`

  return `${prefix}-${id}.${safeExt}`
}
