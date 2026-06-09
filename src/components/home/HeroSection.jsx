import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { homeHero } from '../../data/home'
import { fetchBanners } from '../../services/bannerService'
import BannerCarousel from '../common/BannerCarousel'

function HeroSection() {
  const [banners, setBanners] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await fetchBanners('home', true)
        if (error) {
          console.error('Lỗi khi tải banner trang chủ từ Supabase:', error)
        }
        if (data && data.length > 0) {
          setBanners(data)
        } else {
          // Fallback
          setBanners([{ image_url: homeHero.image, title: homeHero.imageAlt }])
        }
      } catch (err) {
        console.error('Lỗi hệ thống khi tải banner:', err)
        setBanners([{ image_url: homeHero.image, title: homeHero.imageAlt }])
      }
    }
    load()
  }, [])

  return (
    <section className="home-hero">
      <div className="home-hero__glow home-hero__glow--left" aria-hidden="true"></div>
      <div className="home-hero__glow home-hero__glow--right" aria-hidden="true"></div>

      <div className="home-hero__grid">
        <div className="home-hero__content">
          <span className="home-chip">
            <span className="home-chip__dot" aria-hidden="true"></span>
            {homeHero.badge}
          </span>

          <h1>
            {homeHero.title}
            <span>{homeHero.highlight}</span>
          </h1>

          <p>{homeHero.description}</p>

          <div className="home-hero__actions">
            <Link className="btn btn--primary" to="/meo-tiet-kiem">
              Khám phá mẹo tiết kiệm
            </Link>
            <Link className="btn btn--secondary" to="/kiem-tra-tien-dien">
              Kiểm tra tiền điện
            </Link>
          </div>

          <div className="home-hero__stats">
            {homeHero.stats.map((item) => (
              <div key={item.label} className="home-hero__stat">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="home-hero__visual">
          <div className="home-hero__image-shell" style={{ overflow: 'hidden' }}>
            <BannerCarousel banners={banners} />
          </div>

          <div className="home-floating-card home-floating-card--savings">
            <span>{homeHero.floatingSavings.label}</span>
            <strong>{homeHero.floatingSavings.value}</strong>
            <small>{homeHero.floatingSavings.note}</small>
          </div>

          <div className="home-floating-card home-floating-card--warning">
            <span>{homeHero.floatingAppliance.label}</span>
            <strong>{homeHero.floatingAppliance.value}</strong>
          </div>

          <div className="home-floating-card home-floating-card--tip">
            <span>{homeHero.floatingTip.label}</span>
            <p>{homeHero.floatingTip.value}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
