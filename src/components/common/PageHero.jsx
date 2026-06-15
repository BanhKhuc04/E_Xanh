import { useEffect, useState } from 'react'
import { fetchFirstActiveBanner } from '../../services/bannerService'

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
  const [heroImage, setHeroImage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadBanner() {
      if (!pageKey) {
        if (isMounted) {
          setHeroImage(fallbackImage)
          setIsLoading(false)
        }
        return
      }

      setIsLoading(true)
      const { data, error } = await fetchFirstActiveBanner(pageKey)
      if (!isMounted) return

      if (!error && data?.image_url) {
        setHeroImage(data.image_url)
      } else {
        setHeroImage(fallbackImage)
      }
      setIsLoading(false)
    }

    loadBanner()

    return () => {
      isMounted = false
    }
  }, [fallbackImage, pageKey])

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
          <img src={heroImage} alt={imageAlt || title} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>
    </section>
  )
}

export default PageHero
