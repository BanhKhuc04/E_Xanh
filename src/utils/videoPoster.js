function waitForEvent(target, eventName, errorName, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    let timeoutId = null

    const handleSuccess = () => {
      cleanup()
      resolve()
    }

    const handleError = () => {
      cleanup()
      reject(new Error(errorName))
    }

    const cleanup = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
      target.removeEventListener(eventName, handleSuccess)
      target.removeEventListener('error', handleError)
    }

    target.addEventListener(eventName, handleSuccess, { once: true })
    target.addEventListener('error', handleError, { once: true })

    timeoutId = window.setTimeout(() => {
      cleanup()
      reject(new Error(errorName))
    }, timeoutMs)
  })
}

function buildPosterFileName(file) {
  const baseName = file?.name?.replace(/\.[^.]+$/, '') || `video-${Date.now()}`
  return `${baseName}-poster.webp`
}

function createCanvasPoster({
  width = 1280,
  height = 720,
  title = 'E-XANH',
  subtitle = 'Banner video',
  outputType = 'image/webp',
  quality = 0.82,
  fileName = `video-${Date.now()}-poster.webp`,
}) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Trình duyệt không hỗ trợ Canvas để tạo poster.')
  }

  const gradient = context.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#eaf59d')
  gradient.addColorStop(0.55, '#80b155')
  gradient.addColorStop(1, '#336a29')
  context.fillStyle = gradient
  context.fillRect(0, 0, width, height)

  context.fillStyle = 'rgba(255, 255, 255, 0.16)'
  context.beginPath()
  context.arc(width * 0.16, height * 0.18, width * 0.11, 0, Math.PI * 2)
  context.fill()

  context.beginPath()
  context.arc(width * 0.86, height * 0.78, width * 0.18, 0, Math.PI * 2)
  context.fill()

  context.fillStyle = 'rgba(255, 255, 255, 0.96)'
  context.font = '700 72px Arial'
  context.fillText(title, 84, height - 170)

  context.fillStyle = 'rgba(255, 255, 255, 0.88)'
  context.font = '400 34px Arial'
  context.fillText(subtitle, 84, height - 110)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error('Không thể tạo poster mặc định.'))
          return
        }

        resolve(
          new File([result], fileName, {
            type: outputType,
            lastModified: Date.now(),
          }),
        )
      },
      outputType,
      quality,
    )
  })
}

export async function generateVideoPosterFile(
  file,
  {
    captureTime = 0.1,
    outputType = 'image/webp',
    quality = 0.82,
    maxWidth = 1280,
    maxHeight = 720,
  } = {},
) {
  if (!(file instanceof Blob)) {
    throw new Error('Video không hợp lệ để tạo poster.')
  }

  const objectUrl = URL.createObjectURL(file)
  const video = document.createElement('video')
  video.preload = 'metadata'
  video.muted = true
  video.playsInline = true
  video.src = objectUrl
  video.load()

  try {
    await waitForEvent(video, 'loadeddata', 'Không thể đọc dữ liệu video để tạo poster.')

    const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0
    const safeCaptureTime = duration > 0 ? Math.min(captureTime, Math.max(duration - 0.05, 0)) : 0

    if (safeCaptureTime > 0) {
      const seekPromise = waitForEvent(video, 'seeked', 'Không thể tua video để tạo poster.')
      video.currentTime = safeCaptureTime
      await seekPromise
    }

    const widthRatio = maxWidth ? maxWidth / video.videoWidth : 1
    const heightRatio = maxHeight ? maxHeight / video.videoHeight : 1
    const scale = Math.min(widthRatio, heightRatio, 1)
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(video.videoWidth * scale))
    canvas.height = Math.max(1, Math.round(video.videoHeight * scale))

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Trình duyệt không hỗ trợ Canvas để tạo poster video.')
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (!result) {
            reject(new Error('Không thể xuất poster từ video.'))
            return
          }

          resolve(result)
        },
        outputType,
        quality,
      )
    })

    return new File([blob], buildPosterFileName(file), {
      type: outputType,
      lastModified: Date.now(),
    })
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export async function inspectVideoFilePlayback(file) {
  if (!(file instanceof Blob)) {
    return {
      playable: false,
      reason: 'Video không hợp lệ.',
    }
  }

  console.log('[DEBUG] Inspecting video:', {
    name: file.name,
    type: file.type,
    size: file.size,
    canPlayMp4: document.createElement('video').canPlayType('video/mp4')
  })

  const objectUrl = URL.createObjectURL(file)
  const video = document.createElement('video')
  video.preload = 'metadata'
  video.muted = true
  video.playsInline = true
  video.src = objectUrl
  video.load()

  video.addEventListener('error', () => {
    console.log('[DEBUG] Video error event:', video.error)
  })

  try {
    await waitForEvent(
      video,
      'loadedmetadata',
      'Video này có thể đang dùng codec chưa hỗ trợ trên web. Hãy xuất lại bằng MP4 H.264/AVC, tắt HEVC/H.265/HDR.',
    )

    console.log('[DEBUG] Metadata loaded:', {
      duration: video.duration,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight
    })

    if (!video.videoWidth || !video.videoHeight) {
      return {
        playable: false,
        reason: 'Video không có khung hình hợp lệ để phát trên trình duyệt.',
      }
    }

    return {
      playable: true,
      width: video.videoWidth,
      height: video.videoHeight,
      duration: Number.isFinite(video.duration) ? video.duration : 0,
    }
  } catch (error) {
    console.error('[DEBUG] Inspect error:', error)
    return {
      playable: false,
      reason: error.message || 'Video chưa tương thích để phát trên trình duyệt.',
    }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export async function generateFallbackPosterFile(fileName = 'banner-video') {
  return createCanvasPoster({
    title: 'E-XANH',
    subtitle: 'Poster fallback cho banner video',
    fileName: `${fileName.replace(/\.[^.]+$/, '') || 'banner-video'}-fallback-poster.webp`,
  })
}
