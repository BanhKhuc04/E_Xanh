export const POST_IMAGE_ASPECTS = {
  '16:9': {
    key: '16:9',
    label: '16:9 Ngang',
    aspect: 16 / 9,
    width: 1200,
    height: 675,
    ratioClass: 'ratio-16-9',
  },
  '1:1': {
    key: '1:1',
    label: '1:1 Vuông',
    aspect: 1,
    width: 900,
    height: 900,
    ratioClass: 'ratio-1-1',
  },
  '3:4': {
    key: '3:4',
    label: '3:4 Dọc',
    aspect: 3 / 4,
    width: 900,
    height: 1200,
    ratioClass: 'ratio-3-4',
  },
}

export const POST_IMAGE_ASPECT_ORDER = ['16:9', '1:1', '3:4']
export const DEFAULT_POST_IMAGE_ASPECT = '16:9'

export function normalizePostImageAspectKey(value) {
  if (!value) return DEFAULT_POST_IMAGE_ASPECT

  const normalized = String(value).trim()
  if (normalized === '4:3') {
    return DEFAULT_POST_IMAGE_ASPECT
  }

  return POST_IMAGE_ASPECTS[normalized] ? normalized : DEFAULT_POST_IMAGE_ASPECT
}

export function getPostImageAspectPreset(key) {
  return POST_IMAGE_ASPECTS[normalizePostImageAspectKey(key)]
}

export function getPostImageAspectOptions() {
  return POST_IMAGE_ASPECT_ORDER.map((key) => POST_IMAGE_ASPECTS[key])
}

export function detectPostImageAspectKey(width, height) {
  const safeWidth = Number(width) || 0
  const safeHeight = Number(height) || 0

  if (safeWidth <= 0 || safeHeight <= 0) {
    return DEFAULT_POST_IMAGE_ASPECT
  }

  const targetRatio = safeWidth / safeHeight

  return POST_IMAGE_ASPECT_ORDER.reduce((closestKey, currentKey) => {
    const closestRatio = POST_IMAGE_ASPECTS[closestKey].aspect
    const currentRatio = POST_IMAGE_ASPECTS[currentKey].aspect

    return Math.abs(currentRatio - targetRatio) < Math.abs(closestRatio - targetRatio)
      ? currentKey
      : closestKey
  }, DEFAULT_POST_IMAGE_ASPECT)
}
