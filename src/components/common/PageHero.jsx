import { useEffect, useState } from 'react'
import { fetchFirstActiveBanner } from '../../services/bannerService'
import HeroMedia from './HeroMedia'

function PageHero({
  pageKey,
  badge,
  title,
  description,
  fallbackImage,
  imageAlt,
  actions,
  className = '',
  children,
}) {
  const [heroBanner, setHeroBanner] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fallbackBanner = {
      media_type: 'image',
      image_url: fallbackImage,
      poster_url: fallbackImage,
      video_url: '',
      title: imageAlt || title,
    }

    async function loadBanner() {
      if (!pageKey) {
        if (isMounted) {
          setHeroBanner(fallbackBanner)
          setIsLoading(false)
        }
        return
      }

      setIsLoading(true)
      const { data, error } = await fetchFirstActiveBanner(pageKey)
      if (!isMounted) return

      if (!error && data && (data.image_url || data.video_url || data.poster_url)) {
        setHeroBanner(data)
      } else {
        setHeroBanner(fallbackBanner)
      }
      setIsLoading(false)
    }

    loadBanner()

    return () => {
      isMounted = false
    }
  }, [fallbackImage, imageAlt, pageKey, title])

  return (
    <section className={['page-hero', className].filter(Boolean).join(' ')}>
      <div className="page-hero__copy">
        {badge ? <span className="page-hero__badge">{badge}</span> : null}
        <div className="page-hero__headline">
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
        {actions ? <div className="page-hero__actions">{actions}</div> : null}
        {children}
      </div>

      <div className="page-hero__visual" style={{ position: 'relative' }}>
        {isLoading ? (
          <div style={{ position: 'absolute', inset: 0, background: '#e0e0e0', animation: 'pulse 1.5s infinite ease-in-out' }} />
        ) : (
          <HeroMedia
            mediaType={heroBanner?.media_type}
            imageUrl={heroBanner?.image_url}
            videoUrl={heroBanner?.video_url}
            posterUrl={heroBanner?.poster_url}
            fallbackImage={fallbackImage}
            alt={imageAlt || title}
            prioritize
          />
        )}
      </div>
    </section>
  )
}

export default PageHero
