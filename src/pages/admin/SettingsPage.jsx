import { useState, useEffect, useCallback } from 'react'
import {
  platformInfo,
  contentSettings,
  notificationSettings,
  securitySettings as initialSecurity,
  appearanceSettings,
  adminProfile,
  systemStatus,
  backupInfo,
  quickActions,
} from '../../data/adminSettings'
import AdminPlatformInfoCard from '../../components/admin/settings/AdminPlatformInfoCard'
import AdminContentSettingsCard from '../../components/admin/settings/AdminContentSettingsCard'
import AdminNotificationSettingsCard from '../../components/admin/settings/AdminNotificationSettingsCard'
import AdminSecuritySettingsCard from '../../components/admin/settings/AdminSecuritySettingsCard'
import AdminAppearanceSettingsCard from '../../components/admin/settings/AdminAppearanceSettingsCard'
import AdminProfileCard from '../../components/admin/settings/AdminProfileCard'
import AdminSystemStatusCard from '../../components/admin/settings/AdminSystemStatusCard'
import AdminBackupCard from '../../components/admin/settings/AdminBackupCard'
import AdminQuickActionsCard from '../../components/admin/settings/AdminQuickActionsCard'
import '../../styles/admin-settings.css'

function buildToggleMap(settings) {
  const map = {}
  settings.forEach((s) => {
    map[s.key] = s.defaultValue
  })
  return map
}

function SettingsPage() {
  const [contentToggles, setContentToggles] = useState(() =>
    buildToggleMap(contentSettings),
  )
  const [notifToggles, setNotifToggles] = useState(() =>
    buildToggleMap(notificationSettings),
  )
  const [security, setSecurity] = useState(initialSecurity)
  const [toast, setToast] = useState('')
  const [profileData, setProfileData] = useState(adminProfile)

  useEffect(() => {
    async function loadAdminProfile() {
      const { getCurrentSession, getCurrentUserProfile } = await import('../../services/authService')
      const session = await getCurrentSession()
      if (session?.user) {
        const profile = await getCurrentUserProfile(session.user.id)
        if (profile) {
          const name = profile.name || session.user.email || 'Admin E-XANH'
          setProfileData({
            avatar: name.slice(0, 2).toUpperCase(),
            name: name,
            role: profile.role === 'admin' ? 'Quản trị viên cấp cao' : 'Kiểm duyệt viên',
            email: session.user.email,
            status: 'Đang hoạt động',
          })
        }
      }
    }
    loadAdminProfile()
  }, [])

  const showToast = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(''), 2500)
  }, [])

  const handleContentToggle = (key, value) => {
    setContentToggles((prev) => ({ ...prev, [key]: value }))
  }

  const handleNotifToggle = (key, value) => {
    setNotifToggles((prev) => ({ ...prev, [key]: value }))
  }

  const handleSecurityToggle = (key, value) => {
    setSecurity((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="st-page page">
      <section className="st-page__hero">
        <span className="page-badge page-badge--soft">Hệ thống</span>
        <div className="st-page__hero-copy">
          <h2>Cài đặt hệ thống</h2>
          <p>
            Quản lý thông tin nền tảng, quyền quản trị, bảo mật và cấu hình
            hoạt động của E-XANH.
          </p>
        </div>
      </section>

      <div className="st-layout">
        <div className="st-layout__main">
          <AdminPlatformInfoCard
            initial={platformInfo}
            onSave={() => showToast('Đã lưu thông tin nền tảng.')}
          />

          <AdminContentSettingsCard
            settings={contentSettings}
            values={contentToggles}
            onToggle={handleContentToggle}
          />

          <AdminNotificationSettingsCard
            settings={notificationSettings}
            values={notifToggles}
            onToggle={handleNotifToggle}
            onSave={() => showToast('Đã cập nhật cài đặt thông báo.')}
          />

          <AdminSecuritySettingsCard
            security={security}
            onToggle={handleSecurityToggle}
            onSave={() => showToast('Đã cập nhật bảo mật.')}
          />

          <AdminAppearanceSettingsCard settings={appearanceSettings} />
        </div>

        <div className="st-layout__sidebar">
          <AdminProfileCard profile={profileData} />
          <AdminSystemStatusCard statuses={systemStatus} />
          <AdminBackupCard
            backup={backupInfo}
            onBackup={() => showToast('Đã tạo bản sao lưu mới.')}
          />
          <AdminQuickActionsCard
            actions={quickActions}
            onAction={(label) => showToast(`Đã thực hiện: ${label}.`)}
          />
        </div>
      </div>

      {toast && (
        <div className="st-toast" role="alert" aria-live="assertive">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 12.5 10 15l7-7M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  )
}

export default SettingsPage
