import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminAppearanceSettingsCard from '../../components/admin/settings/AdminAppearanceSettingsCard'
import AdminBackupCard from '../../components/admin/settings/AdminBackupCard'
import AdminContentSettingsCard from '../../components/admin/settings/AdminContentSettingsCard'
import AdminNotificationSettingsCard from '../../components/admin/settings/AdminNotificationSettingsCard'
import AdminPlatformInfoCard from '../../components/admin/settings/AdminPlatformInfoCard'
import AdminProfileCard from '../../components/admin/settings/AdminProfileCard'
import AdminQuickActionsCard from '../../components/admin/settings/AdminQuickActionsCard'
import AdminSecuritySettingsCard from '../../components/admin/settings/AdminSecuritySettingsCard'
import AdminSystemStatusCard from '../../components/admin/settings/AdminSystemStatusCard'
import { supabase } from '../../lib/supabase'
import { getAdminStats } from '../../services/analyticsService'
import { getCurrentSession, getCurrentUserProfile } from '../../services/authService'
import {
  buildAdminExportPayload,
  clearAdminRuntimeCache,
  createSystemBackup,
  DEFAULT_PLATFORM_SETTINGS,
  getPlatformSettings,
  getSystemBackupById,
  getSystemBackups,
  resetPlatformSettings,
  runSystemHealthChecks,
  savePlatformSettings,
} from '../../services/settingsService'
import '../../styles/admin-settings.css'

const contentSettings = [
  {
    key: 'require_post_approval',
    label: 'Bật duyệt bài trước khi hiển thị',
    description: 'Bài viết mới phải được admin duyệt trước khi hiển thị cho cộng đồng.',
  },
  {
    key: 'enable_comment_moderation',
    label: 'Bật kiểm duyệt bình luận',
    description: 'Bình luận vi phạm sẽ được admin theo dõi và xử lý qua luồng moderation.',
  },
  {
    key: 'allow_reporting',
    label: 'Cho phép người dùng báo cáo nội dung',
    description: 'Người dùng có thể báo cáo bài viết hoặc bình luận không phù hợp.',
  },
  {
    key: 'auto_hide_reported',
    label: 'Tự động ẩn nội dung bị báo cáo nhiều lần',
    description: 'Tùy chọn hệ thống để hỗ trợ moderation trong tương lai gần.',
  },
]

const notificationSettings = [
  {
    key: 'notify_new_post_pending',
    label: 'Thông báo khi có bài mới chờ duyệt',
    description: 'Nhận thông báo khi người dùng gửi bài viết mới.',
  },
  {
    key: 'notify_reported_comment',
    label: 'Thông báo khi có bình luận cần xử lý',
    description: 'Nhận cảnh báo khi bình luận bị đánh dấu cần moderation.',
  },
  {
    key: 'notify_new_user',
    label: 'Thông báo khi có người dùng mới đăng ký',
    description: 'Nhận thông báo nội bộ khi có tài khoản mới trong hệ thống.',
  },
]

const appearanceSettings = {
  theme: 'Sáng',
  primaryColor: 'Xanh E-XANH',
  borderRadius: 'Mềm',
  density: 'Rộng rãi',
}

const quickActions = [
  { label: 'Xóa cache hệ thống', style: 'default' },
  { label: 'Kiểm tra dữ liệu', style: 'default' },
  { label: 'Xuất báo cáo', style: 'default' },
  { label: 'Khôi phục mặc định', style: 'warning' },
]

function toPlatformInfo(settings) {
  return {
    name: settings.site_name,
    slogan: settings.site_slogan,
    email: settings.support_email,
    description: settings.site_description,
  }
}

function toBackupSummary(backups, stats) {
  const latest = backups[0]

  return {
    lastBackup: latest ? new Date(latest.created_at).toLocaleString('vi-VN') : 'Chưa có bản sao lưu',
    dataSize: latest ? `${Math.round(JSON.stringify(latest.snapshot || {}).length / 1024)} KB` : '0 KB',
    totalPosts: String(stats?.totalPosts ?? 0),
    totalUsers: String(stats?.totalUsers ?? 0),
  }
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_PLATFORM_SETTINGS)
  const [security, setSecurity] = useState({
    twoFactor: false,
    autoLogout: true,
    loginHistory: [],
  })
  const [toast, setToast] = useState(null)
  const [profileData, setProfileData] = useState({
    avatar: 'EX',
    name: 'Admin E-XANH',
    role: 'Quản trị viên',
    email: 'admin@exanh.vn',
    status: 'Đang hoạt động',
  })
  const [systemStatus, setSystemStatus] = useState([])
  const [backups, setBackups] = useState([])
  const [statsSnapshot, setStatsSnapshot] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [currentUserId, setCurrentUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloadingBackup, setIsDownloadingBackup] = useState(false)

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ message, tone })
    window.clearTimeout(showToast.timeoutId)
    showToast.timeoutId = window.setTimeout(() => setToast(null), 3000)
  }, [])

  const refreshSidebarData = useCallback(async () => {
    const [healthResult, backupsResult, statsResult] = await Promise.all([
      runSystemHealthChecks(),
      getSystemBackups(10),
      getAdminStats('30 ngày qua'),
    ])

    setSystemStatus(healthResult.data ?? [])
    setBackups(backupsResult.data ?? [])
    setStatsSnapshot(statsResult)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      setIsLoading(true)

      const session = await getCurrentSession()
      if (session?.user) {
        setCurrentUserId(session.user.id)
        const profile = await getCurrentUserProfile(session.user.id)
        if (profile && isMounted) {
          const name = profile.name || session.user.email || 'Admin E-XANH'
          setProfileData({
            avatar: name.slice(0, 2).toUpperCase(),
            name,
            role: profile.role === 'admin' ? 'Quản trị viên cấp cao' : 'Kiểm duyệt viên',
            email: session.user.email,
            status: profile.status === 'active' ? 'Đang hoạt động' : profile.status,
          })
          setSecurity((current) => ({
            ...current,
            autoLogout: Number(settings.auto_logout_admin_minutes || 30) > 0,
            loginHistory: [
              {
                time: new Date(profile.updated_at || profile.created_at).toLocaleString('vi-VN'),
                action: 'Phiên làm việc gần nhất của tài khoản quản trị hiện tại',
              },
            ],
          }))
        }
      }

      const settingsResult = await getPlatformSettings()
      if (!isMounted) return

      const nextSettings = settingsResult.data ?? DEFAULT_PLATFORM_SETTINGS
      setSettings(nextSettings)
      setSecurity((current) => ({
        ...current,
        autoLogout: Number(nextSettings.auto_logout_admin_minutes || 30) > 0,
      }))
      await refreshSidebarData()
      setIsLoading(false)
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [refreshSidebarData])

  const contentValues = useMemo(() => ({
    require_post_approval: settings.require_post_approval,
    enable_comment_moderation: settings.enable_comment_moderation,
    allow_reporting: settings.allow_reporting,
    auto_hide_reported: settings.auto_hide_reported,
  }), [settings])

  const notificationValues = useMemo(() => ({
    notify_new_post_pending: settings.notify_new_post_pending,
    notify_reported_comment: settings.notify_reported_comment,
    notify_new_user: settings.notify_new_user,
  }), [settings])

  const backupInfo = useMemo(
    () => toBackupSummary(backups, statsSnapshot),
    [backups, statsSnapshot],
  )

  async function persistSettingPatch(patch, message) {
    const previousSettings = settings
    const nextSettings = { ...settings, ...patch }
    setSettings(nextSettings)

    const { error } = await savePlatformSettings({
      values: patch,
      currentUserId,
      reason: 'update_platform_settings',
    })

    if (error) {
      showToast(error.message, 'error')
      setSettings(previousSettings)
      return
    }

    showToast(message)
    await refreshSidebarData()
  }

  async function handleSavePlatformInfo(form) {
    await persistSettingPatch({
      site_name: form.name,
      site_slogan: form.slogan,
      support_email: form.email,
      site_description: form.description,
    }, 'Đã lưu thông tin nền tảng.')
  }

  async function handleContentToggle(key, value) {
    await persistSettingPatch({ [key]: value }, 'Đã cập nhật cấu hình nội dung.')
  }

  function handleNotificationToggle(key, value) {
    setSettings((current) => ({ ...current, [key]: value }))
  }

  async function handleSaveNotifications() {
    const patch = {
      notify_new_post_pending: settings.notify_new_post_pending,
      notify_reported_comment: settings.notify_reported_comment,
      notify_new_user: settings.notify_new_user,
    }

    const { error } = await savePlatformSettings({
      values: patch,
      currentUserId,
      reason: 'update_notification_settings',
    })

    if (error) {
      showToast(error.message, 'error')
      return
    }

    showToast('Đã cập nhật cài đặt thông báo.')
    await refreshSidebarData()
  }

  function handleSecurityToggle(key, value) {
    setSecurity((current) => ({ ...current, [key]: value }))
  }

  async function handleSaveSecurity() {
    const updates = {
      auto_logout_admin_minutes: security.autoLogout ? 30 : 0,
    }

    const { error } = await savePlatformSettings({
      values: updates,
      currentUserId,
      reason: 'update_security_settings',
    })

    if (error) {
      showToast(error.message, 'error')
      return
    }

    if (newPassword.trim()) {
      const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword })
      if (passwordError) {
        showToast(`Đã lưu timeout nhưng đổi mật khẩu thất bại: ${passwordError.message}`, 'warning')
        return
      }
      setNewPassword('')
    }

    showToast('Đã cập nhật bảo mật admin.')
    await refreshSidebarData()
  }

  async function handleCreateBackup() {
    const { error } = await createSystemBackup({ currentUserId })
    if (error) {
      showToast(error.message, 'error')
      return
    }

    showToast('Đã tạo bản sao lưu mới.')
    await refreshSidebarData()
  }

  async function handleDownloadLatestBackup() {
    const latest = backups[0]
    if (!latest) {
      showToast('Chưa có bản sao lưu nào để tải.', 'warning')
      return
    }

    setIsDownloadingBackup(true)
    const { data, error } = await getSystemBackupById(latest.id)
    setIsDownloadingBackup(false)

    if (error || !data) {
      showToast(error?.message || 'Không thể tải bản sao lưu.', 'error')
      return
    }

    downloadJson(`e-xanh-backup-${data.id}.json`, data.snapshot || data)
    showToast('Đã chuẩn bị file sao lưu để tải xuống.')
  }

  async function handleQuickAction(label) {
    if (label === 'Kiểm tra dữ liệu') {
      await refreshSidebarData()
      showToast('Đã kiểm tra lại trạng thái dữ liệu và hệ thống.')
      return
    }

    if (label === 'Xóa cache hệ thống') {
      const removedKeys = clearAdminRuntimeCache()
      showToast(`Đã xóa ${removedKeys.length} mục cache cục bộ.`)
      return
    }

    if (label === 'Xuất báo cáo') {
      const payload = buildAdminExportPayload({
        settings,
        stats: statsSnapshot,
        systemStatus,
        backups: backups.slice(0, 5),
      })
      downloadJson(`e-xanh-admin-report-${Date.now()}.json`, payload)
      showToast('Đã xuất báo cáo quản trị.')
      return
    }

    if (label === 'Khôi phục mặc định') {
      if (!window.confirm('Khôi phục toàn bộ cài đặt hệ thống về mặc định?')) {
        return
      }

      const { error } = await resetPlatformSettings(currentUserId)
      if (error) {
        showToast(error.message, 'error')
        return
      }

      setSettings(DEFAULT_PLATFORM_SETTINGS)
      setSecurity((current) => ({ ...current, autoLogout: true }))
      showToast('Đã khôi phục cài đặt mặc định.')
      await refreshSidebarData()
    }
  }

  if (isLoading) {
    return (
      <div className="st-page page">
        <section className="st-page__hero">
          <span className="page-badge page-badge--soft">Hệ thống</span>
          <div className="st-page__hero-copy">
            <h2>Cài đặt hệ thống</h2>
            <p>Quản lý thông tin nền tảng, moderation, notification nội bộ, sao lưu ứng dụng và trạng thái hạ tầng E-XANH.</p>
          </div>
        </section>
        <div className="st-layout" style={{ marginTop: '24px' }}>
          <div className="st-layout__main" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ height: '220px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '180px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          </div>
          <div className="st-layout__sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ height: '200px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '150px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="st-page page">
      <section className="st-page__hero">
        <span className="page-badge page-badge--soft">Hệ thống</span>
        <div className="st-page__hero-copy">
          <h2>Cài đặt hệ thống</h2>
          <p>
            Quản lý thông tin nền tảng, moderation, notification nội bộ, sao lưu ứng dụng và trạng thái hạ tầng E-XANH.
          </p>
        </div>
      </section>

      <div className="st-layout">
        <div className="st-layout__main">
          <AdminPlatformInfoCard
            initial={toPlatformInfo(settings)}
            onSave={handleSavePlatformInfo}
          />

          <AdminContentSettingsCard
            settings={contentSettings}
            values={contentValues}
            onToggle={handleContentToggle}
          />

          <AdminNotificationSettingsCard
            settings={notificationSettings}
            values={notificationValues}
            onToggle={handleNotificationToggle}
            onSave={handleSaveNotifications}
          />

          <AdminSecuritySettingsCard
            security={security}
            onToggle={handleSecurityToggle}
            onSave={handleSaveSecurity}
            newPassword={newPassword}
            onPasswordChange={setNewPassword}
            canToggleTwoFactor={false}
          />

          <AdminAppearanceSettingsCard settings={appearanceSettings} />
        </div>

        <div className="st-layout__sidebar">
          <AdminProfileCard profile={profileData} />
          <AdminSystemStatusCard statuses={systemStatus} />
          <AdminBackupCard
            backup={backupInfo}
            onBackup={handleCreateBackup}
            onDownloadLatest={handleDownloadLatestBackup}
            isDownloading={isDownloadingBackup}
          />
          <AdminQuickActionsCard
            actions={quickActions}
            onAction={handleQuickAction}
          />
        </div>
      </div>

      {toast ? (
        <div className={`st-toast${toast.tone ? ` st-toast--${toast.tone}` : ''}`} role="alert" aria-live="assertive">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 12.5 10 15l7-7M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          </svg>
          {toast.message}
        </div>
      ) : null}
    </div>
  )
}

export default SettingsPage
