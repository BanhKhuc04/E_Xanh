import { supabase } from '../lib/supabase'
import { createSafeFileName } from '../utils/fileValidation'
import { optimizeImage, generateImageVariants } from '../utils/media/imageOptimizer'
import { validateVideo, generateVideoPoster } from '../utils/media/videoOptimizer'
import { MEDIA_VALIDATION } from '../utils/media/mediaConfig'
import { logError } from '../utils/logger'

async function uploadFileToSupabase(file, bucket, filePath) {
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '31536000',
      upsert: false,
      contentType: file.type,
    })

  if (uploadError) {
    return { error: uploadError }
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return { publicUrl: publicUrlData.publicUrl, filePath }
}

export async function uploadOptimizedImage({
  file,
  bucket = 'posts',
  folder = 'images',
  preset = 'postDetail',
  variants = false,
  userId = 'anonymous',
}) {
  try {
    // 1. Validation
    if (!MEDIA_VALIDATION.IMAGE.ALLOWED_TYPES.includes(file.type)) {
      return { error: new Error('Định dạng ảnh không được hỗ trợ.') }
    }
    if (file.size > MEDIA_VALIDATION.IMAGE.MAX_SIZE_MB * 1024 * 1024) {
      return { error: new Error(`File quá lớn. Vui lòng chọn file dưới ${MEDIA_VALIDATION.IMAGE.MAX_SIZE_MB}MB.`) }
    }

    // 2. Generate multiple variants if requested
    if (variants) {
      const results = await generateImageVariants(file)
      
      const uploadedUrls = {}
      let finalMetadata = null

      for (const [key, variantData] of Object.entries(results)) {
        const safeName = createSafeFileName(variantData.file, `${key}-${userId}`)
        const path = `${folder}/${userId}/${safeName}`
        
        const { publicUrl, error } = await uploadFileToSupabase(variantData.file, bucket, path)
        if (error) {
          logError(`Lỗi upload variant ${key}`, error)
          continue
        }
        
        uploadedUrls[`${key}Url`] = publicUrl
        if (key === preset || !finalMetadata) {
          finalMetadata = variantData
        }
      }

      if (Object.keys(uploadedUrls).length === 0) {
        return { error: new Error('Upload các bản thu nhỏ thất bại.') }
      }

      return {
        ...uploadedUrls,
        metadata: finalMetadata,
      }
    }

    // 3. Single optimization
    const optimized = await optimizeImage(file, preset)
    const safeName = createSafeFileName(optimized.file, `${preset}-${userId}`)
    const path = `${folder}/${userId}/${safeName}`

    const { publicUrl, error } = await uploadFileToSupabase(optimized.file, bucket, path)
    if (error) {
      return { error }
    }

    return {
      publicUrl,
      path,
      metadata: optimized,
    }

  } catch (error) {
    logError('Image optimization/upload failed', error)
    return { error }
  }
}

export async function uploadOptimizedVideo({
  file,
  bucket = 'posts',
  folder = 'videos',
  userId = 'anonymous',
}) {
  const validation = validateVideo(file)
  if (!validation.valid) {
    return { error: new Error(validation.error) }
  }

  try {
    const posterFile = await generateVideoPoster(file)
    let posterUrl = null

    if (posterFile) {
      const posterName = createSafeFileName(posterFile, `poster-${userId}`)
      const posterPath = `${folder}/${userId}/${posterName}`
      const uploadResult = await uploadFileToSupabase(posterFile, bucket, posterPath)
      if (!uploadResult.error) {
        posterUrl = uploadResult.publicUrl
      }
    }

    const safeName = createSafeFileName(file, `video-${userId}`)
    const path = `${folder}/${userId}/${safeName}`

    const { publicUrl, error } = await uploadFileToSupabase(file, bucket, path)
    if (error) {
      return { error }
    }

    return {
      publicUrl,
      posterUrl,
      path,
    }
  } catch (error) {
    logError('Video upload failed', error)
    return { error }
  }
}
