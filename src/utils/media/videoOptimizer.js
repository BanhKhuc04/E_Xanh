import { MEDIA_VALIDATION } from './mediaConfig'

export function validateVideo(file) {
  if (!file) return { valid: false, error: 'Không có file video.' }

  const { ALLOWED_TYPES, MAX_SIZE_MB } = MEDIA_VALIDATION.VIDEO
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Định dạng video không được hỗ trợ. Vui lòng dùng: ${ALLOWED_TYPES.join(', ')}`,
    }
  }

  const maxBytes = MAX_SIZE_MB * 1024 * 1024
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `Video quá nặng (${(file.size / (1024 * 1024)).toFixed(1)}MB). Vui lòng chọn video dưới ${MAX_SIZE_MB}MB.`,
    }
  }

  return { valid: true }
}

export function generateVideoPoster(videoFile) {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const url = URL.createObjectURL(videoFile)
    
    let isResolved = false

    const cleanup = () => {
      URL.revokeObjectURL(url)
      video.removeAttribute('src')
      video.load()
    }

    video.onloadeddata = () => {
      video.currentTime = Math.min(1, video.duration / 2) // Lấy frame ở 1s hoặc giữa video
    }

    video.onseeked = () => {
      if (isResolved) return
      isResolved = true
      
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob((blob) => {
        cleanup()
        if (blob) {
          const posterFile = new File([blob], `poster-${Date.now()}.jpg`, { type: 'image/jpeg' })
          resolve(posterFile)
        } else {
          resolve(null)
        }
      }, 'image/jpeg', 0.8)
    }

    video.onerror = () => {
      if (!isResolved) {
        isResolved = true
        cleanup()
        resolve(null)
      }
    }

    video.src = url
    video.load()
  })
}
