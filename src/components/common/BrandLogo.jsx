import { Link } from 'react-router-dom'
import logo from '../../assets/branding/logo.png'
import './BrandLogo.css'

function BrandLogo({ to = '/', size = 'medium', className = '' }) {
  return (
    <Link to={to} className={`brand-logo brand-logo--${size} ${className}`}>
      <img src={logo} alt="E-XANH" className="brand-logo__image" />
    </Link>
  )
}

export default BrandLogo
