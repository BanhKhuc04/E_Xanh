import { Link } from 'react-router-dom'
import logo from '../../assets/branding/logo.webp'
import logoMobile from '../../assets/branding/logo-mobile.webp'
import './BrandLogo.css'

function BrandLogo({ to = '/', size = 'medium', className = '' }) {
  return (
    <Link to={to} className={`brand-logo brand-logo--${size} ${className}`} data-testid="site-logo" aria-label="E-XANH về trang chủ">
      <picture>
        <source media="(max-width: 600px)" srcSet={logoMobile} />
        <img src={logo} alt="E-XANH" width="400" height="250" className="brand-logo__image" />
      </picture>
    </Link>
  )
}

export default BrandLogo
