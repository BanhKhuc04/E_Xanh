import { Link } from 'react-router-dom'

function FeatureCard({ feature }) {
  return (
    <article className="home-feature-card">
      <div className={`home-feature-card__icon home-feature-card__icon--${feature.tone}`}>
        <span aria-hidden="true">{feature.symbol}</span>
      </div>
      <h2>{feature.title}</h2>
      <p>{feature.description}</p>
      <Link to={feature.to}>Khám phá</Link>
    </article>
  )
}

export default FeatureCard
