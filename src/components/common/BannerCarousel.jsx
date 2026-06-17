import { useState, useEffect } from 'react'
import HeroMedia from './HeroMedia'

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
      <HeroMedia
        mediaType={banners[0].media_type}
        imageUrl={banners[0].image_url}
        videoUrl={banners[0].video_url}
        posterUrl={banners[0].poster_url}
        alt={banners[0].title || 'Banner E-XANH'}
        prioritize
      />
    )
  }

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {banners.map((banner, index) => (
        <div
          key={banner.id || index}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: index === currentIndex ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: index === currentIndex ? 1 : 0
          }}
        >
          <HeroMedia
            mediaType={banner.media_type}
            imageUrl={banner.image_url}
            videoUrl={banner.video_url}
            posterUrl={banner.poster_url}
            alt={banner.title || 'Banner E-XANH'}
            prioritize={index === 0}
            allowVideoPlayback={index === currentIndex}
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
