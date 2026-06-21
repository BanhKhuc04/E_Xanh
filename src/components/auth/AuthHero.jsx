import BannerCarousel from '../common/BannerCarousel'
import BrandLogo from '../common/BrandLogo'

function AuthHero({
  badge = 'Cộng đồng sống xanh',
  title,
  description,
  highlights = [],
  banners = [],
  showMedia = true,
  isLoadingBanners = false,
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
          {isLoadingBanners ? (
            <div className="hero-media__skeleton" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', backgroundColor: '#e5e7eb', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          ) : banners.length > 0 ? (
            <BannerCarousel banners={banners} />
          ) : (
            <div className="hero-media__skeleton" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', backgroundColor: '#f3f4f6' }} />
          )}
        </div>
      ) : null}
    </section>
  )
}

export default AuthHero
