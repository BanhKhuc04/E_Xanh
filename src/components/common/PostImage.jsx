import { useEffect, useMemo, useState } from 'react'
import { ImageOff, Leaf } from 'lucide-react'
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
        <div
          className="post-image__skeleton"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(234, 245, 157, 0.44), rgba(193, 217, 92, 0.16))',
            zIndex: 0,
          }}
        />
      )}

      {(!imageSrc || hasError) && (
        <div
          className="post-image__fallback"
          style={{
            display: 'grid',
            placeItems: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(234, 245, 157, 0.54), rgba(193, 217, 92, 0.2))',
            position: 'absolute',
            inset: 0,
          }}
        >
          <div style={{ display: 'grid', gap: '10px', justifyItems: 'center', textAlign: 'center', color: '#31533a', padding: '20px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(255, 255, 255, 0.7)', boxShadow: '0 10px 24px rgba(79, 132, 40, 0.12)' }}>
              {hasError ? <ImageOff size={28} strokeWidth={2.1} /> : <Leaf size={28} strokeWidth={2.1} />}
            </span>
            <span>E-XANH</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostImage
