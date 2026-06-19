import { MEDIA_PRESETS } from './mediaConfig'

const WEBP_MIME_TYPE = 'image/webp'
const JPEG_MIME_TYPE = 'image/jpeg'

let cachedWebpSupport = null

function getCanvas() {
  return document.createElement('canvas')
}

function getOutputExtension(type) {
  return type === WEBP_MIME_TYPE ? 'webp' : 'jpg'
}

function buildOutputName(file, outputType) {
  const baseName =
    file?.name?.replace(/\.[^.]+$/, '') ||
    `image-${Date.now()}`

  return `${baseName}.${getOutputExtension(outputType)}`
}

export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      resolve({ image, objectUrl })
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Không thể đọc ảnh để nén.'))
    }

    image.src = objectUrl
  })
}

export function safeRevokePreviewUrl(url) {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Không thể xuất ảnh sau khi nén.'))
          return
        }
        resolve(blob)
      },
      type,
      quality
    )
  })
}

function detectWebpSupport() {
  if (cachedWebpSupport !== null) {
    return cachedWebpSupport
  }

  try {
    const canvas = getCanvas()
    cachedWebpSupport = canvas.toDataURL(WEBP_MIME_TYPE).startsWith(`data:${WEBP_MIME_TYPE}`)
  } catch {
    cachedWebpSupport = false
  }

  return cachedWebpSupport
}

function createOutputFile(blob, originalFile, outputType) {
  return new File([blob], buildOutputName(originalFile, outputType), {
    type: outputType,
    lastModified: Date.now(),
  })
}

export async function getImageDimensions(file) {
  try {
    const { image, objectUrl } = await loadImage(file)
    const width = image.width
    const height = image.height
    safeRevokePreviewUrl(objectUrl)
    return { width, height }
  } catch {
    return { width: 0, height: 0 }
  }
}

export async function optimizeImage(file, presetName = 'postDetail') {
  if (!(file instanceof Blob)) {
    throw new Error('File ảnh không hợp lệ để nén.')
  }

  const preset = MEDIA_PRESETS[presetName]
  if (!preset) {
    throw new Error(`Preset ${presetName} không tồn tại.`)
  }

  const {
    maxWidth,
    maxHeight,
    quality = 0.8,
    maxSizeKB = null,
    minQuality = 0.6,
  } = preset

  const sizeBefore = file.size
  const maxBytes = maxSizeKB ? maxSizeKB * 1024 : null

  // If already very small and it's a simple preset, we might just return it
  if (maxBytes && sizeBefore <= maxBytes / 2 && file.type === WEBP_MIME_TYPE) {
    const { width, height } = await getImageDimensions(file)
    return {
      file,
      width,
      height,
      sizeBefore,
      sizeAfter: sizeBefore,
      format: file.type,
      previewUrl: URL.createObjectURL(file),
      compressionRatio: '1.00',
    }
  }

  const { image, objectUrl } = await loadImage(file)
  const canvas = getCanvas()
  const context = canvas.getContext('2d')

  if (!context) {
    safeRevokePreviewUrl(objectUrl)
    throw new Error('Trình duyệt không hỗ trợ Canvas để nén ảnh.')
  }

  const widthRatio = maxWidth ? maxWidth / image.width : 1
  const heightRatio = maxHeight ? maxHeight / image.height : 1
  const scale = Math.min(widthRatio, heightRatio, 1) // don't upscale
  const targetWidth = Math.max(1, Math.round(image.width * scale))
  const targetHeight = Math.max(1, Math.round(image.height * scale))
  
  // Try to preserve transparency if it's a PNG and browser supports WEBP
  const supportsWebp = detectWebpSupport()
  const outputType = supportsWebp ? WEBP_MIME_TYPE : JPEG_MIME_TYPE

  canvas.width = targetWidth
  canvas.height = targetHeight
  context.drawImage(image, 0, 0, targetWidth, targetHeight)
  safeRevokePreviewUrl(objectUrl) // Free memory

  let currentQuality = quality
  let outputBlob = await canvasToBlob(canvas, outputType, currentQuality)

  while (maxBytes && outputBlob.size > maxBytes && currentQuality > minQuality) {
    currentQuality = Math.max(minQuality, Number((currentQuality - 0.05).toFixed(2)))
    outputBlob = await canvasToBlob(canvas, outputType, currentQuality)

    if (currentQuality === minQuality) {
      break
    }
  }

  let finalFile = createOutputFile(outputBlob, file, outputType)
  
  // Fallback to original if output is somehow larger (happens with tiny images)
  if (finalFile.size >= file.size && file.type.startsWith('image/')) {
    finalFile = file
  }

  return {
    file: finalFile,
    width: targetWidth,
    height: targetHeight,
    sizeBefore,
    sizeAfter: finalFile.size,
    format: finalFile.type,
    previewUrl: URL.createObjectURL(finalFile),
    compressionRatio: (finalFile.size / sizeBefore).toFixed(2),
  }
}

export async function generateImageVariants(file, variantNames = ['thumbnail', 'postCard', 'postDetail']) {
  const results = {}
  for (const presetName of variantNames) {
    try {
      results[presetName] = await optimizeImage(file, presetName)
    } catch (err) {
      console.warn(`Could not generate variant ${presetName}`, err)
      // Fallback
      results[presetName] = { file }
    }
  }
  return results
}
