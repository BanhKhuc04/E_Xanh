import { LogOut } from 'lucide-react'
import { SECTION_ITEMS } from './constants'
import { getAvatarFallback, formatRoleLabel } from './utils'

export default function SettingsSidebar({
  currentUser,
  activeSection,
  setActiveSection,
  handleLogout,
  memberSince,
}) {
  return (
    <aside className="settings-sidebar">
      <div className="settings-sidebar__profile">
        <div className="settings-sidebar__profile-top">
          <div className="settings-sidebar__mini-avatar">
            {currentUser?.avatar_url ? (
              <img src={currentUser.avatar_url} alt={`Avatar của ${currentUser.name}`} loading="lazy" />
            ) : (
              <span>{getAvatarFallback(currentUser?.name, currentUser?.email)}</span>
            )}
          </div>
          <div>
            <strong>{currentUser?.name || 'Thành viên E-XANH'}</strong>
            <span>{currentUser?.email}</span>
          </div>
        </div>

        <div className="settings-sidebar__meta">
          <div>
            <span>Vai trò</span>
            <strong>{formatRoleLabel(currentUser?.role)}</strong>
          </div>
          <div>
            <span>Tham gia</span>
            <strong>{memberSince}</strong>
          </div>
        </div>
      </div>

      <nav className="settings-sidebar__nav" aria-label="Các mục cài đặt">
        {SECTION_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              type="button"
              className={`settings-sidebar__nav-item${isActive ? ' is-active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <Icon size={18} />
              <div>
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </div>
            </button>
          )
        })}
      </nav>

      <button type="button" className="settings-sidebar__logout" onClick={handleLogout}>
        <LogOut size={16} />
        Đăng xuất tài khoản
      </button>
    </aside>
  )
}
