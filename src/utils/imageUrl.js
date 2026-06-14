import { supabase } from '../lib/supabase'

const STORAGE_PUBLIC_MARKERS = [
  '/storage/v1/object/public/',
  '/storage/v1/render/image/public/',
]

export const IMAGE_TRANSFORM_WIDTHS = Object.freeze({
  bannerMobile: 640,
  postCard: 800,
  bannerDesktop: 1080,
})

export function extractSupabaseStoragePath(pathOrUrl) {
  if (!pathOrUrl) return null

  const marker = STORAGE_PUBLIC_MARKERS.find((item) => pathOrUrl.includes(item))
  if (!marker) return null

  const urlParts = pathOrUrl.split(marker)
  if (urlParts.length !== 2) return null

  const bucketAndPath = urlParts[1].split('?')[0]
  const firstSlashIndex = bucketAndPath.indexOf('/')
  if (firstSlashIndex === -1) return null

  return {
    bucket: bucketAndPath.substring(0, firstSlashIndex),
    filePath: bucketAndPath.substring(firstSlashIndex + 1),
  }
}

export function getImageUrl(pathOrUrl, width = IMAGE_TRANSFORM_WIDTHS.postCard, quality = 80) {
  if (!pathOrUrl) return ''

  const storagePath = extractSupabaseStoragePath(pathOrUrl)
  if (!storagePath) {
    return pathOrUrl
  }

  try {
    const { data } = supabase.storage
      .from(storagePath.bucket)
      .getPublicUrl(storagePath.filePath, {
        transform: {
          width,
          format: 'webp',
          quality
        }
      })

    return data?.publicUrl || pathOrUrl
  } catch (err) {
    console.error('Error transforming image URL:', err)
    return pathOrUrl
  }
}

export function getBannerImageSources(pathOrUrl) {
  return {
    mobile: getImageUrl(pathOrUrl, IMAGE_TRANSFORM_WIDTHS.bannerMobile, 74),
    desktop: getImageUrl(pathOrUrl, IMAGE_TRANSFORM_WIDTHS.bannerDesktop, 78),
  }
}
