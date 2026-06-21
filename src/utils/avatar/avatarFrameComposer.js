/**
 * Loads an image from a URL and returns a Promise resolving to an HTMLImageElement
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

/**
 * Composes an avatar with a frame using Canvas.
 * @param {Object} options
 * @param {string} options.avatarSrc - URL of the user avatar.
 * @param {string} options.frameSrc - URL of the frame image.
 * @param {number} [options.size=512] - Output canvas size (square).
 * @param {number} [options.avatarScale=0.52] - Scale of the avatar relative to the canvas size.
 * @param {number} [options.avatarCenterX=0.5] - X coordinate of the avatar center (0 to 1).
 * @param {number} [options.avatarCenterY=0.38] - Y coordinate of the avatar center (0 to 1).
 * @param {string} [options.outputType="image/webp"] - Output format.
 * @param {number} [options.quality=0.92] - Output quality.
 * @returns {Promise<string>} - Returns a Promise resolving to the composed image data URL.
 */
export async function composeAvatarFrame({
  avatarSrc,
  frameSrc,
  size = 512,
  avatarScale = 0.52,
  avatarCenterX = 0.5,
  avatarCenterY = 0.38,
  outputType = 'image/webp',
  quality = 0.92,
}) {
  try {
    // 1. Load both images concurrently
    const [avatarImg, frameImg] = await Promise.all([
      loadImage(avatarSrc),
      loadImage(frameSrc),
    ])

    // 2. Create and set up the canvas
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    // 3. Draw the avatar masked in a circle
    const avatarDiameter = size * avatarScale
    const avatarRadius = avatarDiameter / 2
    const cx = size * avatarCenterX
    const cy = size * avatarCenterY

    // Save context for clipping
    ctx.save()

    // Create a circular clipping path
    ctx.beginPath()
    ctx.arc(cx, cy, avatarRadius, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()

    // Calculate center-cover sizing for the avatar
    const imgAspect = avatarImg.width / avatarImg.height
    let drawWidth, drawHeight

    if (imgAspect > 1) {
      // Image is wider than it is tall
      drawHeight = avatarDiameter
      drawWidth = avatarDiameter * imgAspect
    } else {
      // Image is taller than it is wide
      drawWidth = avatarDiameter
      drawHeight = avatarDiameter / imgAspect
    }

    // Center the image inside the clipping circle
    const drawX = cx - drawWidth / 2
    const drawY = cy - drawHeight / 2

    // Fill background just in case there are transparent pixels in the avatar
    ctx.fillStyle = '#ffffff'
    ctx.fill()

    ctx.drawImage(avatarImg, drawX, drawY, drawWidth, drawHeight)

    // Restore context to remove clipping path
    ctx.restore()

    // 4. Draw the frame over the avatar
    // Frame is assumed to take up the full canvas
    ctx.drawImage(frameImg, 0, 0, size, size)

    // 5. Export as data URL
    return canvas.toDataURL(outputType, quality)
  } catch (error) {
    console.error('[composeAvatarFrame] Error composing avatar frame:', error)
    throw error // Let the component handle the fallback
  }
}
