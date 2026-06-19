import BannerCarousel from '../common/BannerCarousel'
import BrandLogo from '../common/BrandLogo'
import heroImage from '../../assets/hero.png'

function AuthHero({
  badge = 'Cộng đồng sống xanh',
  title,
  description,
  highlights = [],
  banners = [],
  showMedia = true,
}) {
  return (
    <section className="auth-hero-panel">
      <div className="auth-hero-panel__top">
        <BrandLogo to="/" size="auth" className="auth-hero-panel__logo" />
        <span className="auth-hero-badge">{badge}</span>
      </div>

      <div className="auth-hero-copy">
        <h1 className="auth-hero-title">{title}</h1>
        <p className="auth-hero-description">{description}</p>

        {highlights.length > 0 ? (
          <div className="auth-hero-highlights" aria-label="Lợi ích khi tham gia E-XANH">
            {highlights.map((item, index) => (
              <span key={`${item}-${index}`} className="auth-hero-highlights__item">
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {showMedia ? (
        <div className="auth-hero-media">
          {banners.length > 0 ? (
            <BannerCarousel banners={banners} />
          ) : (
            <img src={heroImage} alt="Không gian cộng đồng E-XANH" width="1280" height="720" />
          )}
        </div>
      ) : null}
    </section>
  )
}

export default AuthHero
