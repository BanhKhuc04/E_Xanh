const WEBP_MIME_TYPE = 'image/webp'
const JPEG_MIME_TYPE = 'image/jpeg'

let cachedWebpSupport = null

export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

function detectOutputType() {
  if (cachedWebpSupport !== null) {
    return cachedWebpSupport ? WEBP_MIME_TYPE : JPEG_MIME_TYPE
  }

  try {
    const canvas = document.createElement('canvas')
    cachedWebpSupport = canvas.toDataURL(WEBP_MIME_TYPE).startsWith(`data:${WEBP_MIME_TYPE}`)
  } catch {
    cachedWebpSupport = false
  }

  return cachedWebpSupport ? WEBP_MIME_TYPE : JPEG_MIME_TYPE
}

function buildOutputName(fileName = 'post-image', outputType = detectOutputType()) {
  const sanitizedBaseName = String(fileName || 'post-image').replace(/\.[^.]+$/, '')
  const extension = outputType === WEBP_MIME_TYPE ? 'webp' : 'jpg'
  return `${sanitizedBaseName}.${extension}`
}

function canvasToBlob(canvas, outputType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'))
        return
      }

      resolve(blob)
    }, outputType, quality)
  })
}

export async function cropImageSourceToFile(
  imageSrc,
  pixelCrop,
  {
    targetWidth = Math.max(1, Math.round(pixelCrop?.width || 1)),
    targetHeight = Math.max(1, Math.round(pixelCrop?.height || 1)),
    fileName = 'post-image',
    outputType = detectOutputType(),
    quality = 0.86,
  } = {},
) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Trình duyệt không hỗ trợ Canvas để cắt ảnh.')
  }

  canvas.width = Math.max(1, Math.round(targetWidth))
  canvas.height = Math.max(1, Math.round(targetHeight))

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  )

  const blob = await canvasToBlob(canvas, outputType, quality)

  return new File([blob], buildOutputName(fileName, outputType), {
    type: outputType,
    lastModified: Date.now(),
  })
}

export async function cropImageFile(file, pixelCrop, options = {}) {
  const objectUrl = URL.createObjectURL(file)

  try {
    return await cropImageSourceToFile(objectUrl, pixelCrop, {
      fileName: file?.name || options.fileName,
      ...options,
    })
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export default cropImageSourceToFile
