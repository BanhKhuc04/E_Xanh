import { Link } from 'react-router-dom'
import { Lightbulb, Users, Calculator, Zap } from 'lucide-react'

function FeatureCard({ feature }) {
  const renderIcon = (symbol) => {
    switch (symbol) {
      case 'Mẹo':
        return <Lightbulb size={28} />
      case 'Chia sẻ':
        return <Users size={28} />
      case 'Điện':
        return <Calculator size={28} />
      default:
        return <Zap size={28} />
    }
  }

  return (
    <article className="home-feature-card">
      <div className={`home-feature-card__icon home-feature-card__icon--${feature.tone}`}>
        {renderIcon(feature.symbol)}
      </div>
      <h2>{feature.title}</h2>
      <p>{feature.description}</p>
      <Link to={feature.to}>Khám phá</Link>
    </article>
  )
}

export default FeatureCard
