import { NavLink } from 'react-router-dom'
import BrandLogo from '../../common/BrandLogo'
import { userNavLinks } from '../../../data/navigation'

function UserFooter() {
  return (
    <footer className="user-footer">
      <div className="shell shell--wide user-footer__content">
        <div className="user-footer__badge">
          <span className="user-footer__badge-icon">
            <svg viewBox="-100 -100 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="0,-100 22.451,-30.902 95.106,-30.902 36.327,11.803 58.779,80.902 0,38.197 -58.779,80.902 -36.327,11.803 -95.106,-30.902 -22.451,-30.902" fill="#FFFF00"/>
            </svg>
          </span>
          Hoàng Sa & Trường Sa là của Việt Nam!
        </div>

        <div className="user-footer__brand">
          <BrandLogo to="/" size="footer" />
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
