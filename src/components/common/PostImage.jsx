import { useEffect, useMemo, useState } from 'react'
import { ImageOff, Leaf } from 'lucide-react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { getImageUrl, IMAGE_TRANSFORM_WIDTHS } from '../../utils/imageUrl'
import {
  DEFAULT_POST_IMAGE_ASPECT,
  getPostImageAspectPreset,
  normalizePostImageAspectKey,
} from '../../utils/postImageRatios'

const VARIANT_DEFAULT_ASPECT = {
  card: DEFAULT_POST_IMAGE_ASPECT,
  detail: DEFAULT_POST_IMAGE_ASPECT,
  thumbnail: DEFAULT_POST_IMAGE_ASPECT,
  preview: DEFAULT_POST_IMAGE_ASPECT,
  compact: '1:1',
  inline: DEFAULT_POST_IMAGE_ASPECT,
}

function resolveWidth(variant, width) {
  if (width) return width
  if (variant === 'detail') return 1200
  if (variant === 'thumbnail') return 520
  if (variant === 'compact') return 420
  return IMAGE_TRANSFORM_WIDTHS.postCard
}

function buildClassName(parts) {
  return parts.filter(Boolean).join(' ')
}

function PostImage({
  src,
  alt,
  variant = 'card',
  className = '',
  width,
  height,
  aspect,
  loading = 'lazy',
  priority = false,
  objectPosition = 'center',
}) {
  const fallbackAspect = normalizePostImageAspectKey(aspect || VARIANT_DEFAULT_ASPECT[variant] || DEFAULT_POST_IMAGE_ASPECT)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const resolvedWidth = resolveWidth(variant, width)
  const resolvedHeight = useMemo(() => {
    if (height) return height
    const preset = getPostImageAspectPreset(fallbackAspect)
    return Math.round(resolvedWidth / preset.aspect)
  }, [fallbackAspect, height, resolvedWidth])

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setHasError(false)
      setIsLoaded(false)
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [fallbackAspect, src])

  const imageSrc = useMemo(() => {
    if (!src || hasError) return ''
    return getImageUrl(src, resolvedWidth)
  }, [hasError, resolvedWidth, src])

  const rootClassName = buildClassName([
    'exanh-media-frame',
    `exanh-media-frame--${variant}`,
    isLoaded ? 'exanh-media-frame--loaded' : '',
    className,
  ])

  return (
    <div className={rootClassName}>
      {imageSrc && !hasError ? (
        variant === 'inline' ? (
          <Zoom zoomMargin={40} overlayBgColorEnd="rgba(255, 255, 255, 0.95)">
            <img
              src={imageSrc}
              alt={alt}
              width={resolvedWidth}
              height={resolvedHeight}
              loading={priority ? 'eager' : loading}
              fetchPriority={priority ? 'high' : undefined}
              decoding="async"
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              style={{ objectPosition }}
            />
          </Zoom>
        ) : (
          <img
            src={imageSrc}
            alt={alt}
            width={resolvedWidth}
            height={resolvedHeight}
            loading={priority ? 'eager' : loading}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            style={{ objectPosition }}
          />
        )
      ) : null}

      {(!imageSrc || hasError) ? (
        <div className="post-image__fallback">
          <div className="post-image__fallback-inner">
            <span className="post-image__fallback-icon">
              {hasError ? <ImageOff size={26} strokeWidth={2.1} /> : <Leaf size={26} strokeWidth={2.1} />}
            </span>
            <span>E-XANH</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default PostImage
