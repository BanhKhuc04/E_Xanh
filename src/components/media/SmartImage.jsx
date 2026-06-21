import { useState } from 'react'
import { useIntersectionLoad } from '../../hooks/useIntersectionLoad'
import { ImageIcon } from 'lucide-react'

export default function SmartImage({
  src,
  alt = '',
  className = '',
  ratio = 'auto',
  priority = false,
  objectFit = 'cover',
  fallback = null,
}) {
  const [prevSrc, setPrevSrc] = useState(src)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [ref, isIntersecting] = useIntersectionLoad({ rootMargin: '200px' })

  if (src !== prevSrc) {
    setPrevSrc(src)
    setIsLoaded(false)
    setHasError(false)
  }

  const shouldLoad = priority || isIntersecting

  let ratioClass = 'exanh-media-frame--inline'
  if (ratio === '16/9' || ratio === '16:9') ratioClass = 'exanh-media-frame--card'
  else if (ratio === '4/3' || ratio === '4:3') ratioClass = 'exanh-media-frame--thumbnail'
  else if (ratio === '1/1' || ratio === '1:1') ratioClass = 'exanh-media-frame--compact'

  const rootClass = [
    'exanh-media-frame',
    ratioClass,
    isLoaded ? 'exanh-media-frame--loaded' : '',
    className
  ].filter(Boolean).join(' ')

  const fallbackNode = fallback || (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', backgroundColor: '#eef6df', color: '#4f8428'
    }}>
      <ImageIcon size={32} opacity={0.5} />
      <span style={{ fontSize: '12px', marginTop: '8px' }}>E-XANH</span>
    </div>
  )

  return (
    <div ref={ref} className={rootClass}>
      {hasError && fallbackNode}

      {shouldLoad && !hasError && src && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'low'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true)
            setIsLoaded(false)
          }}
          style={{ objectFit }}
        />
      )}
    </div>
  )
}
