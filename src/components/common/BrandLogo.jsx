import { Link } from 'react-router-dom'

function BrandLogo({ to = '/', subtitle, light = false }) {
  return (
    <Link className={`brand-logo ${light ? 'brand-logo--light' : ''}`} to={to}>
      <span className="brand-logo__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" role="img">
          <path d="M22.6 8.4c-5.7.2-10.7 3.9-12.4 9.3-.8 2.7-.6 4.8-.5 5.9 1.2.2 3.5.4 6.2-.5 5.4-1.7 9.1-6.7 9.3-12.4-.5-.9-1.5-1.9-2.6-2.3Z" />
          <path d="M11.3 21.4c3.1-4.3 6.8-7.2 11.3-9" />
        </svg>
      </span>
      <span className="brand-logo__text">
        <strong>E-XANH</strong>
        {subtitle ? <small>{subtitle}</small> : null}
      </span>
    </Link>
  )
}

export default BrandLogo
