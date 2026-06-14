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
  const [heroImage, setHeroImage] = useState(fallbackImage)

  useEffect(() => {
    let isMounted = true

    async function loadBanner() {
      if (!pageKey) return

      const { data, error } = await fetchFirstActiveBanner(pageKey)
      if (!isMounted) return

      if (!error && data?.image_url) {
        setHeroImage(data.image_url)
        return
      }

      setHeroImage(fallbackImage)
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

      <div className="page-hero__visual">
        <img src={heroImage || fallbackImage} alt={imageAlt || title} />
      </div>
    </section>
  )
}

export default PageHero
