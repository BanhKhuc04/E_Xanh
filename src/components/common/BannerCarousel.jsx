import { useState, useEffect } from 'react'
import { getImageUrl } from '../../utils/imageUrl'

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
      <img
        src={getImageUrl(banners[0].image_url, 1200)}
        alt={banners[0].title || 'Banner E-XANH'}
        width="720"
        height="405"
        loading="eager"
        fetchPriority="high"
        style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 'inherit' }}
      />
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
          <img
            src={getImageUrl(banner.image_url, 1200)}
            alt={banner.title || 'Banner E-XANH'}
            width="720"
            height="405"
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ))}
      
      {/* Indicators */}
      <div style={{ position: 'absolute', bottom: '16px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 2 }}>
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              border: 'none',
              padding: 0,
              background: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default BannerCarousel
