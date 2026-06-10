import { NavLink } from 'react-router-dom'
import BrandLogo from '../../common/BrandLogo'
import { adminNavLinks } from '../../../data/navigation'

function SidebarIcon({ iconKey }) {
  const icons = {
    TG: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
      </svg>
    ),
    DB: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4h10l4 4v12H5zM9 12l2 2 4-4M15 4v4h4" />
      </svg>
    ),
    BL: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 6h14v10H9l-4 3V6zM9 10h6M9 13h4" />
      </svg>
    ),
    ND: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20a7 7 0 0 1 14 0" />
      </svg>
    ),
    TB: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m13 3-7 10h5l-1 8 8-11h-5l0-7z" />
      </svg>
    ),
    TK: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 19V9M12 19V5M19 19v-7" />
      </svg>
    ),
    CD: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.5 6.5l2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      </svg>
    ),
    GD: (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  }

  return icons[iconKey] ?? <span>{iconKey}</span>
}

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <BrandLogo to="/admin" size="admin" />
      </div>

      <nav className="admin-sidebar__nav" aria-label="Điều hướng quản trị">
        {adminNavLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) =>
              `admin-sidebar__link${isActive ? ' is-active' : ''}`
            }
          >
            <span className="admin-sidebar__icon" aria-hidden="true">
              <SidebarIcon iconKey={item.shortLabel} />
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default AdminSidebar
