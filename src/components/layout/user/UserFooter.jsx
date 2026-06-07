import { NavLink } from 'react-router-dom'
import BrandLogo from '../../common/BrandLogo'
import { userNavLinks } from '../../../data/navigation'

function UserFooter() {
  return (
    <footer className="user-footer">
      <div className="shell shell--wide user-footer__content">
        <div className="user-footer__brand">
          <BrandLogo to="/" light />
          <p>Dùng điện thông minh, sống xanh bền vững.</p>
        </div>

        <nav className="user-footer__nav" aria-label="Liên kết chân trang">
          {userNavLinks.slice(0, 4).map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/ve-chung-toi">Về chúng tôi</NavLink>
          <NavLink to="/dieu-khoan">Điều khoản</NavLink>
          <NavLink to="/lien-he">Liên hệ</NavLink>
        </nav>

        <div className="user-footer__copyright">
          <p>© 2024 E-XANH. Made by VanhKhucDev</p>
        </div>
      </div>
    </footer>
  )
}

export default UserFooter
