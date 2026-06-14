import { logError } from '../utils/logger'
import { supabase } from '../lib/supabase'
import { validateImageFile, createSafeFileName } from '../utils/fileValidation'

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

export async function uploadBannerImage(file) {
  const validation = validateImageFile(file)
  if (!validation.valid) {
    return { error: { message: validation.error } }
  }

  const safeFileName = createSafeFileName(file, 'banner')
  const filePath = `banners/${safeFileName}`

  const { error: uploadError } = await supabase.storage
    .from('website-banners')
    .upload(filePath, file, {
      cacheControl: '31536000',
      upsert: true,
      contentType: file.type,
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
    .getPublicUrl(filePath, {
      transform: {
        width: 800,
        format: 'webp',
        quality: 80,
      }
    })

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
      const urlParts = imageUrl.split('website-banners/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
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
