import { supabase } from '../lib/supabase'
import { createSafeFileName } from '../utils/fileValidation'
import { optimizeImage, generateImageVariants } from '../utils/media/imageOptimizer'
import { validateImage } from '../utils/media/imageValidation'
import { validateVideo, generateVideoPoster } from '../utils/media/videoOptimizer'
import { MEDIA_VALIDATION } from '../utils/media/mediaConfig'
import { logError } from '../utils/logger'

async function uploadFileToSupabase(file, bucket, filePath) {
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '31536000',
      upsert: false,
      contentType: file.type || 'image/webp',
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
  bucket = 'post-images', // defaulting to post-images for Phase 3
  folder = 'posts',
  preset = 'post', // use 'post', 'banner', or 'avatar'
  variants = true,
  userId = 'anonymous',
  postId = 'new'
}) {
  try {
    // 1. Validation
    const validation = validateImage(file)
    if (!validation.isValid) {
      return { error: new Error(validation.error) }
    }

    // 2. Generate variants
    if (variants) {
      const results = await generateImageVariants(file, preset)
      const uploadedUrls = {}
      let finalMetadata = null

      const timestamp = Date.now();

      for (const [key, variantData] of Object.entries(results)) {
        // e.g. post-images/posts/{postId}/thumb-{timestamp}.webp
        // or avatars/{userId}/avatar-{timestamp}.webp
        let path = '';
        if (preset === 'avatar') {
          path = `${userId}/${key}-${timestamp}.webp`;
        } else if (preset === 'banner') {
          path = `${postId}/${key}-${timestamp}.webp`;
        } else {
          path = `${folder}/${postId}/${key}-${timestamp}.webp`;
        }

        const { publicUrl, error } = await uploadFileToSupabase(variantData.file, bucket, path)
        if (error) {
          logError(`Lỗi upload variant ${key}`, error)
          continue
        }
        
        uploadedUrls[`${key}Url`] = publicUrl
        if (!finalMetadata || key === 'detail' || key === 'banner' || key === 'avatar') {
          finalMetadata = variantData
        }
      }

      if (Object.keys(uploadedUrls).length === 0) {
        return { error: new Error('Upload các bản thu nhỏ thất bại.') }
      }

      return {
        ...uploadedUrls,
        width: finalMetadata?.width,
        height: finalMetadata?.height,
        aspectRatio: finalMetadata?.aspectRatio
      }
    }

    // Single optimization fallback
    const optimized = await optimizeImage(file, 1440) // detail size
    const timestamp = Date.now();
    const path = `${folder}/${postId}/single-${timestamp}.webp`

    const { publicUrl, error } = await uploadFileToSupabase(optimized.file, bucket, path)
    if (error) {
      return { error }
    }

    return {
      publicUrl,
      path,
      width: optimized.width,
      height: optimized.height,
      aspectRatio: optimized.aspectRatio
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
