import { Link } from 'react-router-dom'
import { Lightbulb, Users, Calculator, Zap, ArrowRight } from 'lucide-react'
import Tilt from 'react-parallax-tilt'

function FeatureCard({ feature }) {
  const renderIcon = (symbol, size = 32) => {
    switch (symbol) {
      case 'Mẹo':
        return <Lightbulb size={size} strokeWidth={2} />
      case 'Chia sẻ':
        return <Users size={size} strokeWidth={2} />
      case 'Điện':
        return <Calculator size={size} strokeWidth={2} />
      default:
        return <Zap size={size} strokeWidth={2} />
    }
  }

  return (
    <Tilt
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      perspective={1000}
      scale={1.03}
      transitionSpeed={400}
      gyroscope={true}
      className="home-feature-card-wrapper"
      style={{ height: '100%' }}
    >
      <article className="premium-feature-card" style={{ height: '100%' }}>
        <div className="premium-feature-card__glow-blob"></div>
        <div className="premium-feature-card__watermark">
          {renderIcon(feature.symbol, 140)}
        </div>
        
        <div className="premium-feature-card__content">
          <div className={`premium-feature-card__icon premium-feature-card__icon--${feature.tone}`}>
            {renderIcon(feature.symbol, 28)}
          </div>
          <h2 className="premium-feature-card__title">{feature.title}</h2>
          <p className="premium-feature-card__desc">{feature.description}</p>
        </div>
        
        <div className="premium-feature-card__footer">
          <Link to={feature.to} className="premium-feature-card__link">
            Khám phá <ArrowRight size={18} className="link-arrow" />
          </Link>
        </div>
      </article>
    </Tilt>
  )
}

export default FeatureCard
