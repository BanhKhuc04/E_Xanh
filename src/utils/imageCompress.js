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

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Không thể đọc ảnh để nén.'))
    }

    image.src = objectUrl
  })
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
  } catch (error) {
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

export function isCompressibleImageType(file) {
  return ['image/jpeg', 'image/png', 'image/webp'].includes(file?.type)
}

export async function compressImageToWebp(
  file,
  {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.75,
    maxBytes = null,
    minQuality = 0.55,
  } = {}
) {
  if (!(file instanceof Blob)) {
    throw new Error('File ảnh không hợp lệ để nén.')
  }

  const image = await loadImage(file)
  const canvas = getCanvas()
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Trình duyệt không hỗ trợ Canvas để nén ảnh.')
  }

  const widthRatio = maxWidth ? maxWidth / image.width : 1
  const heightRatio = maxHeight ? maxHeight / image.height : 1
  const scale = Math.min(widthRatio, heightRatio, 1)
  const targetWidth = Math.max(1, Math.round(image.width * scale))
  const targetHeight = Math.max(1, Math.round(image.height * scale))
  const outputType = detectWebpSupport() ? WEBP_MIME_TYPE : JPEG_MIME_TYPE

  canvas.width = targetWidth
  canvas.height = targetHeight
  context.drawImage(image, 0, 0, targetWidth, targetHeight)

  let currentQuality = quality
  let outputBlob = await canvasToBlob(canvas, outputType, currentQuality)

  while (maxBytes && outputBlob.size > maxBytes && currentQuality > minQuality) {
    currentQuality = Math.max(minQuality, Number((currentQuality - 0.05).toFixed(2)))
    outputBlob = await canvasToBlob(canvas, outputType, currentQuality)

    if (currentQuality === minQuality) {
      break
    }
  }

  const compressedFile = createOutputFile(outputBlob, file, outputType)

  if (file instanceof File && compressedFile.size >= file.size) {
    return file
  }

  return compressedFile
}
