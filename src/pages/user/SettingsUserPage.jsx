import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  Bell,
  Globe,
  KeyRound,
  Link2,
  LockKeyhole,
  LogOut,
  MonitorSmartphone,
  ShieldCheck,
  SquareUserRound,
  UserRound,
} from 'lucide-react'
import ProfileAvatarSettings from '../../components/account/ProfileAvatarSettings'
import ProfileCoverSettings from '../../components/account/ProfileCoverSettings'
import { supabase } from '../../lib/supabase'
import { getCurrentSession, signOut } from '../../services/authService'
import {
  DEFAULT_USER_PREFERENCES,
  getCurrentProfile,
  normalizeProfileRecord,
  updateProfile,
  updateProfilePreferences,
} from '../../services/profileService'
import '../../styles/account.css'

const PROFILE_BIO_LIMIT = 180

const SECTION_ITEMS = [
  {
    id: 'account',
    label: 'Tài khoản',
    description: 'Thông tin cá nhân và hình ảnh hồ sơ',
    icon: UserRound,
  },
  {
    id: 'security',
    label: 'Bảo mật',
    description: 'Mật khẩu, phiên đăng nhập và an toàn tài khoản',
    icon: LockKeyhole,
  },
  {
    id: 'privacy',
    label: 'Quyền riêng tư',
    description: 'Kiểm soát hồ sơ công khai và nội dung hiển thị',
    icon: ShieldCheck,
  },
  {
    id: 'notifications',
    label: 'Thông báo',
    description: 'Điều hướng Notification Center nội bộ',
    icon: Bell,
  },
]

const PROFILE_VISIBILITY_OPTIONS = [
  {
    value: 'public',
    label: 'Công khai',
    description: 'Ai cũng có thể xem trang cá nhân công khai của bạn.',
  },
  {
    value: 'authenticated',
    label: 'Chỉ người đăng nhập',
    description: 'Khách phải đăng nhập mới xem được hồ sơ.',
  },
  {
    value: 'private',
    label: 'Chỉ mình tôi',
    description: 'Ẩn hồ sơ công khai với mọi người khác.',
  },
]

const NOTIFICATION_SWITCHES = [
  {
    key: 'notify_system',
    label: 'Thông báo hệ thống',
    description: 'Các thông báo quan trọng từ quản trị viên và nền tảng.',
    enabled: true,
  },
  {
    key: 'notify_post_review',
    label: 'Thông báo duyệt bài',
    description: 'Tự động ẩn vì luồng duyệt bài chưa phát thông báo theo tùy chọn cá nhân.',
    enabled: false,
  },
  {
    key: 'notify_comment_moderation',
    label: 'Thông báo bình luận',
    description: 'Nhận cảnh báo khi bình luận bị nhắc nhở hoặc điều tiết.',
    enabled: true,
  },
  {
    key: 'notify_interactions',
    label: 'Thông báo tương tác',
    description: 'Đang chờ backend cho lượt theo dõi, trả lời và tương tác hồ sơ.',
    enabled: false,
  },
]

function getAvatarFallback(name, email) {
  if (name) {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  if (email) return email.split('@')[0].slice(0, 2).toUpperCase()
  return 'EX'
}

function formatRoleLabel(role) {
  if (role === 'admin') return 'Quản trị viên'
  if (role === 'moderator') return 'Điều phối viên'
  return 'Thành viên'
}

function validateFacebookUrl(value) {
  if (!value.trim()) return ''

  try {
    const parsed = new URL(value.trim())
    const allowedHosts = ['facebook.com', 'www.facebook.com', 'fb.com', 'www.fb.com']
    if (parsed.protocol !== 'https:' || !allowedHosts.includes(parsed.hostname.toLowerCase())) {
      return 'Liên kết Facebook phải bắt đầu bằng https://facebook.com/... hoặc https://fb.com/...'
    }
  } catch {
    return 'Liên kết Facebook không đúng định dạng URL.'
  }

  return ''
}

function validateWebsiteUrl(value) {
  if (!value.trim()) return ''

  try {
    const parsed = new URL(value.trim())
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return 'Liên kết cá nhân phải bắt đầu bằng http:// hoặc https://'
    }
  } catch {
    return 'Liên kết cá nhân không đúng định dạng URL.'
  }

  return ''
}

function ToggleRow({
  label,
  description,
  checked,
  disabled = false,
  onChange,
  badge = '',
}) {
  return (
    <button
      type="button"
      className={`settings-switch-row${disabled ? ' is-disabled' : ''}`}
      onClick={onChange}
      disabled={disabled}
    >
      <div className="settings-switch-row__copy">
        <strong>{label}</strong>
        <span>{description}</span>
      </div>
      <div className="settings-switch-row__meta">
        {badge ? <span className="settings-badge settings-badge--muted">{badge}</span> : null}
        <span className={`account-toggle${checked ? ' is-on' : ''}`}></span>
      </div>
    </button>
  )
}

function SettingsUserPage() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`

  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('account')
  const [toast, setToast] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [schemaNeedsMigration, setSchemaNeedsMigration] = useState(false)

  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    facebook_url: '',
    website_url: '',
  })
  const [privacyForm, setPrivacyForm] = useState({
    profile_visibility: DEFAULT_USER_PREFERENCES.profile_visibility,
    show_facebook: DEFAULT_USER_PREFERENCES.show_facebook,
    show_public_posts: DEFAULT_USER_PREFERENCES.show_public_posts,
    allow_search_index: DEFAULT_USER_PREFERENCES.allow_search_index,
  })
  const [notificationForm, setNotificationForm] = useState({
    notify_system: DEFAULT_USER_PREFERENCES.notify_system,
    notify_post_review: DEFAULT_USER_PREFERENCES.notify_post_review,
    notify_comment_moderation: DEFAULT_USER_PREFERENCES.notify_comment_moderation,
    notify_interactions: DEFAULT_USER_PREFERENCES.notify_interactions,
  })
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [profileErrors, setProfileErrors] = useState({})
  const [passwordError, setPasswordError] = useState('')

  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPrivacy, setSavingPrivacy] = useState(false)
  const [savingNotifications, setSavingNotifications] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      const session = await getCurrentSession()
      if (!session?.user) {
        if (isMounted) {
          navigate('/dang-nhap', { state: { from: pathname }, replace: true })
        }
        return
      }

      const { data, error } = await getCurrentProfile()
      const profile = normalizeProfileRecord({
        id: session.user.id,
        email: session.user.email,
        name: session.user.email?.split('@')[0] || 'Thành viên E-XANH',
        ...data,
      })

      const hasPreferencesColumn = Object.prototype.hasOwnProperty.call(data || {}, 'user_preferences')
      const hasWebsiteColumn = Object.prototype.hasOwnProperty.call(data || {}, 'website_url')
      const hasCoverColumn = Object.prototype.hasOwnProperty.call(data || {}, 'cover_url')

      if (isMounted) {
        setSchemaNeedsMigration(Boolean(error) || !hasPreferencesColumn || !hasWebsiteColumn || !hasCoverColumn)
        setCurrentUser(profile)
        setProfileForm({
          name: profile.name || '',
          bio: profile.bio || '',
          facebook_url: profile.facebook_url || '',
          website_url: profile.website_url || '',
        })
        setPrivacyForm({
          profile_visibility: profile.user_preferences.profile_visibility,
          show_facebook: profile.user_preferences.show_facebook,
          show_public_posts: profile.user_preferences.show_public_posts,
          allow_search_index: profile.user_preferences.allow_search_index,
        })
        setNotificationForm({
          notify_system: profile.user_preferences.notify_system,
          notify_post_review: profile.user_preferences.notify_post_review,
          notify_comment_moderation: profile.user_preferences.notify_comment_moderation,
          notify_interactions: profile.user_preferences.notify_interactions,
        })
        setLoading(false)
      }
    }

    loadProfile()
    window.addEventListener('profileUpdated', loadProfile)

    return () => {
      isMounted = false
      window.removeEventListener('profileUpdated', loadProfile)
    }
  }, [navigate, pathname])

  useEffect(() => {
    if (!toast) return undefined

    const timer = window.setTimeout(() => {
      setToast(null)
    }, 3200)

    return () => window.clearTimeout(timer)
  }, [toast])

  function showToast(message, tone = 'success') {
    setToast({ message, tone })
  }

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  function handleProfileFieldChange(field, value) {
    setProfileForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSaveProfile(event) {
    event.preventDefault()

    const nextErrors = {}
    const trimmedName = profileForm.name.trim()
    const trimmedBio = profileForm.bio.trim()
    const trimmedFacebook = profileForm.facebook_url.trim()
    const trimmedWebsite = profileForm.website_url.trim()

    if (!trimmedName) {
      nextErrors.name = 'Tên hiển thị không được để trống.'
    }

    if (trimmedBio.length > PROFILE_BIO_LIMIT) {
      nextErrors.bio = `Tiểu sử chỉ được tối đa ${PROFILE_BIO_LIMIT} ký tự.`
    }

    const facebookError = validateFacebookUrl(trimmedFacebook)
    if (facebookError) nextErrors.facebook_url = facebookError

    const websiteError = validateWebsiteUrl(trimmedWebsite)
    if (websiteError) nextErrors.website_url = websiteError

    setProfileErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSavingProfile(true)

    const { data, error } = await updateProfile({
      name: trimmedName,
      bio: trimmedBio,
      facebook_url: trimmedFacebook,
      website_url: trimmedWebsite,
    })

    if (error) {
      showToast(error.message || 'Không thể lưu thông tin cá nhân.', 'error')
      setSavingProfile(false)
      return
    }

    const mergedProfile = normalizeProfileRecord({
      ...currentUser,
      ...data,
      bio: trimmedBio,
      facebook_url: trimmedFacebook,
      website_url: trimmedWebsite,
    })

    setCurrentUser(mergedProfile)
    setProfileForm({
      name: mergedProfile.name || '',
      bio: mergedProfile.bio || '',
      facebook_url: mergedProfile.facebook_url || '',
      website_url: mergedProfile.website_url || '',
    })
    window.dispatchEvent(new Event('profileUpdated'))
    showToast('Đã lưu thông tin cá nhân.')
    setSavingProfile(false)
  }

  async function handleSavePrivacy() {
    setSavingPrivacy(true)

    const { data, error } = await updateProfilePreferences({
      ...currentUser?.user_preferences,
      ...privacyForm,
      ...notificationForm,
    })

    if (error) {
      showToast(error.message || 'Không thể lưu cài đặt quyền riêng tư.', 'error')
      setSavingPrivacy(false)
      return
    }

    setCurrentUser((current) => normalizeProfileRecord({
      ...current,
      user_preferences: data?.user_preferences || {
        ...current?.user_preferences,
        ...privacyForm,
        ...notificationForm,
      },
    }))

    window.dispatchEvent(new Event('profileUpdated'))
    showToast('Đã cập nhật quyền riêng tư.')
    setSchemaNeedsMigration(false)
    setSavingPrivacy(false)
  }

  async function handleSaveNotifications() {
    setSavingNotifications(true)

    const { data, error } = await updateProfilePreferences({
      ...currentUser?.user_preferences,
      ...privacyForm,
      ...notificationForm,
    })

    if (error) {
      showToast(error.message || 'Không thể lưu cài đặt thông báo.', 'error')
      setSavingNotifications(false)
      return
    }

    setCurrentUser((current) => normalizeProfileRecord({
      ...current,
      user_preferences: data?.user_preferences || {
        ...current?.user_preferences,
        ...privacyForm,
        ...notificationForm,
      },
    }))

    window.dispatchEvent(new Event('profileUpdated'))
    showToast('Đã lưu tuỳ chọn thông báo nội bộ.')
    setSchemaNeedsMigration(false)
    setSavingNotifications(false)
  }

  async function handleChangePassword(event) {
    event.preventDefault()

    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu xác nhận chưa khớp.')
      return
    }

    setPasswordError('')
    setSavingPassword(true)

    const { error } = await supabase.auth.updateUser({
      password: passwordForm.newPassword,
    })

    if (error) {
      setPasswordError(error.message || 'Không thể cập nhật mật khẩu.')
      setSavingPassword(false)
      return
    }

    setPasswordForm({
      newPassword: '',
      confirmPassword: '',
    })
    showToast('Đổi mật khẩu thành công.')
    setSavingPassword(false)
  }

  if (loading) {
    return (
      <div className="account-page">
        <div className="shell" style={{ padding: '40px 0', textAlign: 'center' }}>
          Đang tải cài đặt tài khoản...
        </div>
      </div>
    )
  }

  const memberSince = currentUser?.created_at
    ? new Date(currentUser.created_at).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'Chưa xác định'

  return (
    <>
      <Helmet>
        <title>Cài đặt tài khoản - E-XANH</title>
        <meta
          name="description"
          content="Quản lý thông tin cá nhân, ảnh đại diện, ảnh bìa, bảo mật và quyền riêng tư trên tài khoản E-XANH."
        />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="account-page settings-page">
        <div className="account-page__breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>{'>'}</span>
          <Link to="/tai-khoan">Tài khoản</Link>
          <span>{'>'}</span>
          <span>Cài đặt</span>
        </div>

        <section className="settings-hero">
          <div className="settings-hero__copy">
            <span className="settings-badge">Cài đặt tài khoản</span>
            <h1>Quản lý hồ sơ và trải nghiệm E-XANH theo cách gọn gàng hơn.</h1>
            <p>
              Cập nhật hồ sơ thật, đổi mật khẩu bằng Supabase Auth, kiểm soát trang cá nhân công khai
              và chuẩn bị sẵn dữ liệu cho Notification Center nội bộ.
            </p>
          </div>

          <div className="settings-hero__snapshot">
            <div className="settings-hero__avatar">
              {currentUser?.avatar_url ? (
                <img src={currentUser.avatar_url} alt={`Ảnh đại diện của ${currentUser.name}`} />
              ) : (
                <span>{getAvatarFallback(currentUser?.name, currentUser?.email)}</span>
              )}
            </div>
            <div>
              <strong>{currentUser?.name || 'Thành viên E-XANH'}</strong>
              <span>{currentUser?.email}</span>
              <em>{formatRoleLabel(currentUser?.role)}</em>
            </div>
          </div>
        </section>

        <div className="settings-layout">
          <aside className="settings-sidebar">
            <div className="settings-sidebar__profile">
              <div className="settings-sidebar__profile-top">
                <div className="settings-sidebar__mini-avatar">
                  {currentUser?.avatar_url ? (
                    <img src={currentUser.avatar_url} alt={`Avatar của ${currentUser.name}`} />
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

          <div className="settings-content">
            {schemaNeedsMigration ? (
              <div className="settings-callout settings-callout--warning">
                <strong>Supabase của bạn còn thiếu migration mới cho phần cài đặt tài khoản.</strong>
                <span>
                  Trang vẫn chạy ở chế độ tương thích, nhưng để lưu ảnh bìa, liên kết cá nhân và quyền riêng tư
                  ổn định bạn cần chạy file SQL migration mới mình sẽ gửi ở cuối.
                </span>
              </div>
            ) : null}

            {activeSection === 'account' ? (
              <>
                <section className="settings-section-card">
                  <div className="settings-section-card__header">
                    <div>
                      <span className="settings-section-card__eyebrow">Thông tin cá nhân</span>
                      <h2>Những gì hiển thị công khai trên hồ sơ của bạn</h2>
                    </div>
                    <SquareUserRound size={22} />
                  </div>

                  <form className="settings-form" onSubmit={handleSaveProfile}>
                    <div className="settings-form__grid">
                      <label className="settings-field">
                        <span>Tên hiển thị *</span>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(event) => handleProfileFieldChange('name', event.target.value)}
                          placeholder="Nhập tên hiển thị của bạn"
                        />
                        {profileErrors.name ? <em>{profileErrors.name}</em> : null}
                      </label>

                      <label className="settings-field">
                        <span>Liên kết Facebook</span>
                        <input
                          type="url"
                          value={profileForm.facebook_url}
                          onChange={(event) => handleProfileFieldChange('facebook_url', event.target.value)}
                          placeholder="https://facebook.com/ten-ban"
                        />
                        {profileErrors.facebook_url ? <em>{profileErrors.facebook_url}</em> : null}
                      </label>

                      <label className="settings-field settings-field--full">
                        <span>Tiểu sử</span>
                        <textarea
                          value={profileForm.bio}
                          onChange={(event) => handleProfileFieldChange('bio', event.target.value)}
                          placeholder="Viết vài dòng ngắn giới thiệu về bạn..."
                        />
                        <small>{profileForm.bio.trim().length}/{PROFILE_BIO_LIMIT} ký tự</small>
                        {profileErrors.bio ? <em>{profileErrors.bio}</em> : null}
                      </label>

                      <label className="settings-field settings-field--full">
                        <span>Liên kết cá nhân</span>
                        <div className="settings-field__with-icon">
                          <Link2 size={16} />
                          <input
                            type="url"
                            value={profileForm.website_url}
                            onChange={(event) => handleProfileFieldChange('website_url', event.target.value)}
                            placeholder="https://portfolio-cua-ban.vn"
                          />
                        </div>
                        {profileErrors.website_url ? <em>{profileErrors.website_url}</em> : null}
                      </label>
                    </div>

                    <div className="settings-form__actions">
                      <button type="submit" className="btn btn--primary" disabled={savingProfile}>
                        {savingProfile ? 'Đang lưu...' : 'Lưu thông tin cá nhân'}
                      </button>
                    </div>
                  </form>
                </section>

                <section className="settings-section-card">
                  <div className="settings-section-card__header">
                    <div>
                      <span className="settings-section-card__eyebrow">Ảnh đại diện & ảnh bìa</span>
                      <h2>Quản lý hình ảnh nhận diện trên hồ sơ</h2>
                    </div>
                    <MonitorSmartphone size={22} />
                  </div>

                  <div className="settings-media-grid">
                    <ProfileAvatarSettings
                      currentAvatarUrl={currentUser?.avatar_url || ''}
                      displayName={currentUser?.name || ''}
                      email={currentUser?.email || ''}
                      onAvatarUpdated={(avatarUrl) => {
                        setCurrentUser((current) => ({
                          ...current,
                          avatar_url: avatarUrl || '',
                        }))
                      }}
                    />

                    <ProfileCoverSettings
                      currentCoverUrl={currentUser?.cover_url || ''}
                      onCoverUpdated={(coverUrl) => {
                        setCurrentUser((current) => ({
                          ...current,
                          cover_url: coverUrl || '',
                        }))
                      }}
                    />
                  </div>
                </section>
              </>
            ) : null}

            {activeSection === 'security' ? (
              <div className="settings-stack">
                <section className="settings-section-card">
                  <div className="settings-section-card__header">
                    <div>
                      <span className="settings-section-card__eyebrow">Đổi mật khẩu</span>
                      <h2>Cập nhật mật khẩu bằng Supabase Auth</h2>
                    </div>
                    <KeyRound size={22} />
                  </div>

                  <form className="settings-form" onSubmit={handleChangePassword}>
                    <div className="settings-form__grid">
                      <label className="settings-field">
                        <span>Mật khẩu mới</span>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(event) => setPasswordForm((current) => ({
                            ...current,
                            newPassword: event.target.value,
                          }))}
                          placeholder="Nhập mật khẩu mới"
                        />
                      </label>

                      <label className="settings-field">
                        <span>Xác nhận mật khẩu</span>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(event) => setPasswordForm((current) => ({
                            ...current,
                            confirmPassword: event.target.value,
                          }))}
                          placeholder="Nhập lại mật khẩu mới"
                        />
                      </label>
                    </div>

                    {passwordError ? <div className="settings-inline-alert settings-inline-alert--error">{passwordError}</div> : null}

                    <div className="settings-form__actions">
                      <button type="submit" className="btn btn--primary" disabled={savingPassword}>
                        {savingPassword ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                      </button>
                    </div>
                  </form>
                </section>

                <div className="settings-split">
                  <section className="settings-section-card">
                    <div className="settings-section-card__header">
                      <div>
                        <span className="settings-section-card__eyebrow">Phiên đăng nhập</span>
                        <h2>Thông tin phiên hiện tại</h2>
                      </div>
                      <LockKeyhole size={22} />
                    </div>

                    <div className="settings-summary-list">
                      <div>
                        <span>Email đăng nhập</span>
                        <strong>{currentUser?.email}</strong>
                      </div>
                      <div>
                        <span>Vai trò</span>
                        <strong>{formatRoleLabel(currentUser?.role)}</strong>
                      </div>
                      <div>
                        <span>Trạng thái hồ sơ</span>
                        <strong>{currentUser?.status === 'active' ? 'Đang hoạt động' : currentUser?.status}</strong>
                      </div>
                    </div>
                  </section>

                  <section className="settings-section-card">
                    <div className="settings-section-card__header">
                      <div>
                        <span className="settings-section-card__eyebrow">Tự động đăng xuất</span>
                        <h2>Tính năng đang chờ hoàn thiện</h2>
                      </div>
                      <Globe size={22} />
                    </div>

                    <div className="settings-disabled-panel">
                      <span className="settings-badge settings-badge--muted">Sắp ra mắt</span>
                      <p>
                        Hệ thống hiện chưa có luồng tự động đăng xuất cho tài khoản người dùng thường,
                        nên mục này được khóa để tránh tạo cảm giác đã hoạt động.
                      </p>
                    </div>
                  </section>
                </div>
              </div>
            ) : null}

            {activeSection === 'privacy' ? (
              <div className="settings-stack">
                <section className="settings-section-card">
                  <div className="settings-section-card__header">
                    <div>
                      <span className="settings-section-card__eyebrow">Ai có thể xem hồ sơ</span>
                      <h2>Điều khiển mức độ hiển thị trang cá nhân</h2>
                    </div>
                    <ShieldCheck size={22} />
                  </div>

                  <div className="settings-radio-group">
                    {PROFILE_VISIBILITY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`settings-radio-card${privacyForm.profile_visibility === option.value ? ' is-active' : ''}`}
                        onClick={() => setPrivacyForm((current) => ({
                          ...current,
                          profile_visibility: option.value,
                        }))}
                      >
                        <strong>{option.label}</strong>
                        <span>{option.description}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="settings-section-card">
                  <div className="settings-section-card__header">
                    <div>
                      <span className="settings-section-card__eyebrow">Hiển thị công khai</span>
                      <h2>Chọn nội dung an toàn sẽ hiện trên hồ sơ</h2>
                    </div>
                    <Globe size={22} />
                  </div>

                  <div className="settings-switch-list">
                    <ToggleRow
                      label="Hiển thị liên kết Facebook"
                      description="Chỉ hiện link Facebook trên hồ sơ công khai khi bạn bật mục này."
                      checked={privacyForm.show_facebook}
                      onChange={() => setPrivacyForm((current) => ({
                        ...current,
                        show_facebook: !current.show_facebook,
                      }))}
                    />
                    <ToggleRow
                      label="Hiển thị bài viết công khai"
                      description="Ẩn toàn bộ danh sách bài viết khỏi trang hồ sơ công khai nếu bạn muốn."
                      checked={privacyForm.show_public_posts}
                      onChange={() => setPrivacyForm((current) => ({
                        ...current,
                        show_public_posts: !current.show_public_posts,
                      }))}
                    />
                    <ToggleRow
                      label="Cho phép công cụ tìm kiếm lập chỉ mục"
                      description="Nếu tắt, hồ sơ công khai sẽ trả về thẻ noindex để giảm khả năng bị lập chỉ mục."
                      checked={privacyForm.allow_search_index}
                      onChange={() => setPrivacyForm((current) => ({
                        ...current,
                        allow_search_index: !current.allow_search_index,
                      }))}
                    />
                  </div>

                  <div className="settings-form__actions">
                    <button type="button" className="btn btn--primary" onClick={handleSavePrivacy} disabled={savingPrivacy}>
                      {savingPrivacy ? 'Đang lưu...' : 'Lưu quyền riêng tư'}
                    </button>
                  </div>
                </section>
              </div>
            ) : null}

            {activeSection === 'notifications' ? (
              <div className="settings-stack">
                <section className="settings-section-card">
                  <div className="settings-section-card__header">
                    <div>
                      <span className="settings-section-card__eyebrow">Notification Center nội bộ</span>
                      <h2>Chỉ giữ lại các tùy chọn đã có backend thật</h2>
                    </div>
                    <Bell size={22} />
                  </div>

                  <div className="settings-switch-list">
                    {NOTIFICATION_SWITCHES.map((item) => (
                      <ToggleRow
                        key={item.key}
                        label={item.label}
                        description={item.description}
                        checked={Boolean(notificationForm[item.key])}
                        disabled={!item.enabled}
                        badge={item.enabled ? '' : 'Sắp ra mắt'}
                        onChange={() => {
                          if (!item.enabled) return
                          setNotificationForm((current) => ({
                            ...current,
                            [item.key]: !current[item.key],
                          }))
                        }}
                      />
                    ))}
                  </div>

                  <div className="settings-callout">
                    <strong>Những mục bị khóa sẽ không hiển thị toggle giả.</strong>
                    <span>
                      Hiện tại E-XANH mới có luồng notification nội bộ ổn định cho hệ thống và điều tiết bình luận.
                      Các loại khác sẽ chỉ bật khi backend phát thông báo theo tùy chọn cá nhân đã hoàn thiện.
                    </span>
                  </div>

                  <div className="settings-form__actions">
                    <button type="button" className="btn btn--primary" onClick={handleSaveNotifications} disabled={savingNotifications}>
                      {savingNotifications ? 'Đang lưu...' : 'Lưu cài đặt thông báo'}
                    </button>
                  </div>
                </section>
              </div>
            ) : null}
          </div>
        </div>

        {toast ? (
          <div className={`settings-toast settings-toast--${toast.tone || 'success'}`} role="status" aria-live="polite">
            {toast.message}
          </div>
        ) : null}
      </div>
    </>
  )
}

export default SettingsUserPage
