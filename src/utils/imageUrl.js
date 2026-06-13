import { supabase } from '../lib/supabase'

export function getImageUrl(pathOrUrl, width = 800, quality = 80) {
  if (!pathOrUrl) return ''

  // Nếu không phải Supabase Storage URL thì trả nguyên
  if (!pathOrUrl.includes('/storage/v1/object/public/')) {
    return pathOrUrl
  }

  try {
    // Trích xuất bucket và path từ URL
    // Format: https://[project-id].supabase.co/storage/v1/object/public/[bucket]/[path...]
    const urlParts = pathOrUrl.split('/storage/v1/object/public/')
    if (urlParts.length !== 2) return pathOrUrl
    
    const bucketAndPath = urlParts[1]
    const firstSlashIndex = bucketAndPath.indexOf('/')
    if (firstSlashIndex === -1) return pathOrUrl

    const bucket = bucketAndPath.substring(0, firstSlashIndex)
    const filePath = bucketAndPath.substring(firstSlashIndex + 1)

    // Sử dụng getPublicUrl với transform cho webp
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath, {
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
