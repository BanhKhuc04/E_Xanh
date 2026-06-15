import { useEffect, useMemo, useState } from 'react'
import { getImageUrl, IMAGE_TRANSFORM_WIDTHS } from '../../utils/imageUrl'

function PostImage({
  src,
  alt,
  variant = 'card',
  className = '',
  width = IMAGE_TRANSFORM_WIDTHS.postCard,
  height = 450,
}) {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setHasError(false)
    setIsLoaded(false)
  }, [src])

  const imageSrc = useMemo(() => {
    if (!src || hasError) return ''
    return getImageUrl(src, width)
  }, [hasError, src, width])

  const rootClassName = ['post-image', `post-image--${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClassName}>
      {imageSrc && !hasError && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s ease', display: 'block', position: 'relative', zIndex: 1 }}
        />
      )}

      {!isLoaded && !hasError && imageSrc && (
        <div className="post-image__skeleton" style={{ position: 'absolute', inset: 0, background: '#e0e0e0', zIndex: 0 }} />
      )}

      {(!imageSrc || hasError) && (
        <div className="post-image__fallback" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#f5f5f5', position: 'absolute', inset: 0 }}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
      )}
    </div>
  )
}

export default PostImage
