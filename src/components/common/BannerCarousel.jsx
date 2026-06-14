import { useState, useEffect } from 'react'
import { getBannerImageSources } from '../../utils/imageUrl'

function BannerMedia({ banner, prioritize = false }) {
  const imageSources = getBannerImageSources(banner.image_url)

  return (
    <picture>
      <source
        media="(max-width: 768px)"
        srcSet={imageSources.mobile}
      />
      <img
        src={imageSources.desktop}
        alt={banner.title || 'Banner E-XANH'}
        width="1280"
        height="720"
        loading={prioritize ? 'eager' : 'lazy'}
        fetchPriority={prioritize ? 'high' : 'auto'}
        decoding="async"
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
      />
    </picture>
  )
}

function BannerCarousel({ banners, interval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!banners || banners.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, interval)

    return () => clearInterval(timer)
  }, [banners, interval])

  if (!banners || banners.length === 0) return null

  if (banners.length === 1) {
    return (
      <div style={{ width: '100%', aspectRatio: '16 / 9' }}>
        <BannerMedia banner={banners[0]} prioritize />
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: 'inherit' }}>
      {banners.map((banner, index) => (
        <div
          key={banner.id || index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === currentIndex ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: index === currentIndex ? 1 : 0
          }}
        >
          <BannerMedia banner={banner} prioritize={index === 0} />
        </div>
      ))}
      
      {/* Indicators */}
      <div style={{ position: 'absolute', bottom: '16px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 2 }}>
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              padding: 0,
              background: 'transparent',
              cursor: 'pointer',
            }}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span
              style={{
                display: 'block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'background 0.3s ease',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default BannerCarousel
