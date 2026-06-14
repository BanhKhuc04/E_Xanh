import { logError } from '../utils/logger'
import { supabase } from '../lib/supabase'
import { validateImageFile, createSafeFileName } from '../utils/fileValidation'
import {
  compressImageToWebp,
  isCompressibleImageType,
} from '../utils/imageCompress'

function getBannerFilePathFromUrl(imageUrl) {
  if (!imageUrl || !imageUrl.includes('website-banners/')) {
    return null
  }

  const urlParts = imageUrl.split('website-banners/')
  if (urlParts.length <= 1) {
    return null
  }

  return urlParts[1].split('?')[0]
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
  return { data, error }
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
  return { data: data || [], error }
}

export async function fetchFirstActiveBanner(pageKey) {
  const { data, error } = await fetchBanners(pageKey, true)

  if (error) {
    return { data: null, error }
  }

  return { data: data?.[0] || null, error: null }
}

export async function uploadBannerImage(file) {
  const validation = validateImageFile(file)
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

  const safeFileName = createSafeFileName(uploadFile, 'banner')
  const filePath = `banners/${safeFileName}`

  const { error: uploadError } = await supabase.storage
    .from('website-banners')
    .upload(filePath, uploadFile, {
      cacheControl: '31536000',
      upsert: true,
      contentType: uploadFile.type || file.type,
    })

  if (uploadError) {
    let viMessage = 'Upload ảnh thất bại, vui lòng thử lại.'
    const msg = uploadError.message?.toLowerCase() || ''
    
    if (msg.includes('bucket not found') || msg.includes('could not find bucket')) {
      viMessage = 'Chưa tìm thấy bucket website-banners.'
    } else if (msg.includes('violates row-level security') || msg.includes('unauthorized') || msg.includes('jwt') || msg.includes('forbidden')) {
      viMessage = 'Bạn không có quyền upload banner.'
    }
    return { error: { message: viMessage, original: uploadError } }
  }

  const { data: publicUrlData } = supabase.storage
    .from('website-banners')
    .getPublicUrl(filePath)

  return { publicUrl: publicUrlData.publicUrl, filePath }
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
    } else if (msg.includes('violates row-level security') || msg.includes('unauthorized') || msg.includes('forbidden')) {
      viMessage = 'Bạn không có quyền upload banner.'
    }
    return { error: { message: viMessage, original: error } }
  }

  return { data, error }
}

export async function updateBanner(id, updates) {
  const { data, error } = await supabase
    .from('website_banners')
    .update(updates)
    .eq('id', id)
    .select()

  return { data, error }
}

export async function deleteBanner(id, imageUrl) {
  // Try to extract file path from URL if it's from our storage
  if (imageUrl && imageUrl.includes('website-banners')) {
    try {
      const filePath = getBannerFilePathFromUrl(imageUrl)
      if (filePath) {
        await supabase.storage.from('website-banners').remove([filePath])
      }
    } catch (err) {
      logError('Failed to delete image from storage:', err?.message || err)
    }
  }

  const { error } = await supabase
    .from('website_banners')
    .delete()
    .eq('id', id)

  return { error }
}
