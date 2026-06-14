import { useMemo, useState } from 'react'
import { getImageUrl, IMAGE_TRANSFORM_WIDTHS } from '../../utils/imageUrl'

const FALLBACK_IMAGE = '/images/fallback-green.jpg'

function PostImage({
  src,
  alt,
  variant = 'card',
  className = '',
  width = IMAGE_TRANSFORM_WIDTHS.postCard,
  height = 450,
}) {
  const [hasError, setHasError] = useState(false)

  const imageSrc = useMemo(() => {
    if (!src || hasError) return ''
    return getImageUrl(src, width)
  }, [hasError, src, width])

  const rootClassName = ['post-image', `post-image--${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClassName}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : null}

      {!imageSrc ? (
        <div className="post-image__fallback">
          <img src={FALLBACK_IMAGE} alt="" aria-hidden="true" />
          <span>Ảnh minh họa E-XANH</span>
        </div>
      ) : null}
    </div>
  )
}

export default PostImage
