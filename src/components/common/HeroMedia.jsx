import { useEffect, useMemo, useState } from 'react'
import { getBannerImageSources } from '../../utils/imageUrl'

function inferVideoMimeType(videoUrl) {
  if (!videoUrl) return undefined

  const normalizedUrl = videoUrl.split('?')[0].toLowerCase()
  if (normalizedUrl.endsWith('.webm')) return 'video/webm'
  if (normalizedUrl.endsWith('.mp4')) return 'video/mp4'

  return undefined
}

function getResponsiveSources(imageUrl) {
  if (!imageUrl) {
    return { mobile: '', desktop: '' }
  }

  return getBannerImageSources(imageUrl)
}

function HeroMedia({
  mediaType = 'image',
  imageUrl = '',
  videoUrl = '',
  posterUrl = '',
  fallbackImage = '',
  alt = 'Banner E-XANH',
  className = '',
  prioritize = false,
  allowVideoPlayback = true,
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isCompactViewport, setIsCompactViewport] = useState(false)
  const [hasVideoError, setHasVideoError] = useState(false)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setHasVideoError(false)
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [imageUrl, mediaType, posterUrl, videoUrl, fallbackImage])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const compactViewportQuery = window.matchMedia('(max-width: 767px)')

    const syncState = () => {
      setPrefersReducedMotion(reducedMotionQuery.matches)
      setIsCompactViewport(compactViewportQuery.matches)
    }

    syncState()

    const addListener = (query, listener) => {
      if (typeof query.addEventListener === 'function') {
        query.addEventListener('change', listener)
        return () => query.removeEventListener('change', listener)
      }

      query.addListener(listener)
      return () => query.removeListener(listener)
    }

    const disposeReduced = addListener(reducedMotionQuery, syncState)
    const disposeViewport = addListener(compactViewportQuery, syncState)

    return () => {
      disposeReduced()
      disposeViewport()
    }
  }, [])

  const resolvedMediaType = mediaType === 'video' && videoUrl ? 'video' : 'image'
  const fallbackPoster = posterUrl || imageUrl || fallbackImage || ''
  const imageSources = useMemo(() => getResponsiveSources(fallbackPoster), [fallbackPoster])
  const shouldRenderVideo =
    resolvedMediaType === 'video' &&
    Boolean(videoUrl) &&
    allowVideoPlayback &&
    !hasVideoError &&
    !prefersReducedMotion &&
    !isCompactViewport

  const rootClassName = ['hero-media', className].filter(Boolean).join(' ')

  return (
    <div className={rootClassName}>
      {shouldRenderVideo ? (
        <video
          className="hero-media__surface"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={imageSources.desktop || fallbackPoster || undefined}
          onError={() => setHasVideoError(true)}
          title={alt}
        >
          <source src={videoUrl} type={inferVideoMimeType(videoUrl)} />
        </video>
      ) : fallbackPoster ? (
        <picture className="hero-media__picture">
          <source media="(max-width: 768px)" srcSet={imageSources.mobile} />
          <img
            className="hero-media__surface"
            src={imageSources.desktop}
            alt={alt}
            width="1280"
            height="720"
            loading={prioritize ? 'eager' : 'lazy'}
            fetchPriority={prioritize ? 'high' : 'auto'}
            decoding="async"
          />
        </picture>
      ) : (
        <div className="hero-media__surface hero-media__surface--fallback" aria-hidden="true" />
      )}
    </div>
  )
}

export default HeroMedia
