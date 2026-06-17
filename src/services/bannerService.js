import { logError } from '../utils/logger'
import { supabase } from '../lib/supabase'
import {
  validateImageFile,
  validateVideoFile,
  createSafeFileName,
  ALLOWED_PROFILE_IMAGE_TYPES,
} from '../utils/fileValidation'
import {
  compressImageToWebp,
  isCompressibleImageType,
} from '../utils/imageCompress'

function getBannerFilePathFromUrl(fileUrl) {
  if (!fileUrl || !fileUrl.includes('website-banners/')) {
    return null
  }

  const urlParts = fileUrl.split('website-banners/')
  if (urlParts.length <= 1) {
    return null
  }

  return urlParts[1].split('?')[0]
}

function normalizeBannerRecord(record) {
  if (!record) return null

  const hasVideo = record.media_type === 'video' && Boolean(record.video_url)
  const posterUrl = record.poster_url || record.image_url || ''

  return {
    ...record,
    media_type: hasVideo ? 'video' : 'image',
    image_url: record.image_url || '',
    video_url: record.video_url || '',
    poster_url: posterUrl,
  }
}

function normalizeBannerRecords(records) {
  return Array.isArray(records) ? records.map(normalizeBannerRecord) : []
}

function getUploadErrorMessage(uploadError, kindLabel) {
  let viMessage = `Upload ${kindLabel} thất bại, vui lòng thử lại.`
  const msg = uploadError.message?.toLowerCase() || ''

  if (msg.includes('bucket not found') || msg.includes('could not find bucket')) {
    viMessage = 'Chưa tìm thấy bucket website-banners.'
  } else if (msg.includes('violates row-level security') || msg.includes('unauthorized') || msg.includes('jwt') || msg.includes('forbidden')) {
    viMessage = `Bạn không có quyền upload ${kindLabel}.`
  }

  return { message: viMessage, original: uploadError }
}

async function uploadBannerAsset(file, { folder, kindLabel, prefix, contentType }) {
  const safeFileName = createSafeFileName(file, prefix)
  const filePath = `${folder}/${safeFileName}`

  const { error: uploadError } = await supabase.storage
    .from('website-banners')
    .upload(filePath, file, {
      cacheControl: '31536000',
      upsert: false,
      contentType: contentType || file.type,
    })

  if (uploadError) {
    return { error: getUploadErrorMessage(uploadError, kindLabel) }
  }

  const { data: publicUrlData } = supabase.storage
    .from('website-banners')
    .getPublicUrl(filePath)

  return { publicUrl: publicUrlData.publicUrl, filePath }
}

export async function removeBannerStorageFiles(urls = []) {
  const filePaths = Array.from(
    new Set(
      urls
        .map((url) => getBannerFilePathFromUrl(url))
        .filter(Boolean),
    ),
  )

  if (filePaths.length === 0) {
    return { error: null }
  }

  const { error } = await supabase.storage.from('website-banners').remove(filePaths)
  if (error) {
    logError('Failed to delete banner files from storage:', error?.message || error)
  }

  return { error }
}

export async function fetchBanners(pageKey, activeOnly = false) {
  let query = supabase
    .from('website_banners')
    .select('*')
    .eq('page_key', pageKey)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query
  return { data: normalizeBannerRecords(data), error }
}

export async function fetchBannersByPageKeys(pageKeys, activeOnly = false) {
  if (!Array.isArray(pageKeys) || pageKeys.length === 0) {
    return { data: [], error: null }
  }

  let query = supabase
    .from('website_banners')
    .select('*')
    .in('page_key', pageKeys)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query
  return { data: normalizeBannerRecords(data), error }
}

export async function fetchFirstActiveBanner(pageKey) {
  const { data, error } = await fetchBanners(pageKey, true)

  if (error) {
    return { data: null, error }
  }

  return { data: normalizeBannerRecord(data?.[0] || null), error: null }
}

export async function uploadBannerImage(file, options = {}) {
  const validation = validateImageFile(file, {
    allowedTypes: ALLOWED_PROFILE_IMAGE_TYPES,
    invalidTypeMessage: 'Chỉ chấp nhận ảnh JPG, JPEG, PNG hoặc WebP.',
    ...options.validation,
  })
  if (!validation.valid) {
    return { error: { message: validation.error } }
  }

  let uploadFile = file

  if (isCompressibleImageType(file)) {
    try {
      uploadFile = await compressImageToWebp(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.76,
        maxBytes: 300 * 1024,
        minQuality: 0.6,
      })
    } catch (error) {
      logError('Banner compression failed, using original banner image.', error)
    }
  }

  return uploadBannerAsset(uploadFile, {
    folder: options.folder || 'images',
    kindLabel: 'ảnh',
    prefix: options.prefix || 'banner',
    contentType: uploadFile.type || file.type,
  })
}

export async function uploadBannerVideo(file, options = {}) {
  const validation = validateVideoFile(file, options.validation)
  if (!validation.valid) {
    return { error: { message: validation.error } }
  }

  return uploadBannerAsset(file, {
    folder: options.folder || 'videos',
    kindLabel: 'video',
    prefix: options.prefix || 'banner-video',
    contentType: file.type,
  })
}

export async function addBanner(bannerData) {
  const { data, error } = await supabase
    .from('website_banners')
    .insert([bannerData])
    .select()

  if (error) {
    let viMessage = 'Lưu thông tin banner thất bại.'
    const msg = error.message?.toLowerCase() || ''

    if (msg.includes('does not exist') || msg.includes('relation "public.website_banners"')) {
      viMessage = 'Chưa tìm thấy table website_banners.'
    } else if (msg.includes('column') && (msg.includes('media_type') || msg.includes('video_url') || msg.includes('poster_url'))) {
      viMessage = 'Database chưa có cột media_type/video_url/poster_url. Hãy chạy migration banner video trước.'
    } else if (msg.includes('violates row-level security') || msg.includes('unauthorized') || msg.includes('forbidden')) {
      viMessage = 'Bạn không có quyền upload banner.'
    }
    return { error: { message: viMessage, original: error } }
  }

  return { data: normalizeBannerRecords(data), error }
}

export async function updateBanner(id, updates) {
  const { data, error } = await supabase
    .from('website_banners')
    .update(updates)
    .eq('id', id)
    .select()

  return { data: normalizeBannerRecords(data), error }
}

export async function deleteBanner(bannerOrId, imageUrl = '') {
  const banner = typeof bannerOrId === 'object' && bannerOrId !== null
    ? normalizeBannerRecord(bannerOrId)
    : null
  const id = banner?.id || bannerOrId

  try {
    await removeBannerStorageFiles([
      banner?.image_url || imageUrl,
      banner?.poster_url,
      banner?.video_url,
    ])
  } catch (err) {
    logError('Failed to delete banner media from storage:', err?.message || err)
  }

  const { error } = await supabase
    .from('website_banners')
    .delete()
    .eq('id', id)

  return { error }
}
