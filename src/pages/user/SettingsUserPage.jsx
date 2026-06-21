import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SEO from '../../components/SEO'
import {
  getCurrentAuthUser,
  getCurrentSession,
  requestPasswordReset,
  signOut,
} from '../../services/authService'
import {
  DEFAULT_USER_PREFERENCES,
  getCurrentProfile,
  normalizeProfileRecord,
  updateProfile,
  updateProfilePreferences,
} from '../../services/profileService'
import '../../styles/account.css'

// Sub-components
import SettingsSidebar from '../../components/account/settings/SettingsSidebar'
import AccountSettingsSection from '../../components/account/settings/AccountSettingsSection'
import SecuritySettingsSection from '../../components/account/settings/SecuritySettingsSection'
import PrivacySettingsSection from '../../components/account/settings/PrivacySettingsSection'
import NotificationSettingsSection from '../../components/account/settings/NotificationSettingsSection'

import { getAvatarFallback, validateFacebookUrl, validateWebsiteUrl, formatRoleLabel } from '../../components/account/settings/utils'
import { PROFILE_BIO_LIMIT } from '../../components/account/settings/constants'

function SettingsUserPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname, state } = location
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`

  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('account')
  const [toast, setToast] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [accountEmail, setAccountEmail] = useState('')
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
  const [profileErrors, setProfileErrors] = useState({})

  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPrivacy, setSavingPrivacy] = useState(false)
  const [savingNotifications, setSavingNotifications] = useState(false)
  const [sendingPasswordReset, setSendingPasswordReset] = useState(false)
  const [passwordResetCooldown, setPasswordResetCooldown] = useState(0)

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

      const { user: authUser } = await getCurrentAuthUser()
      const { data, error } = await getCurrentProfile()
      const profile = normalizeProfileRecord({
        id: session.user.id,
        email: authUser?.email || session.user.email,
        name: session.user.email?.split('@')[0] || 'Thành viên E-XANH',
        ...data,
      })

      const hasPreferencesColumn = Object.prototype.hasOwnProperty.call(data || {}, 'user_preferences')
      const hasWebsiteColumn = Object.prototype.hasOwnProperty.call(data || {}, 'website_url')
      const hasCoverColumn = Object.prototype.hasOwnProperty.call(data || {}, 'cover_url')

      if (isMounted) {
        setSchemaNeedsMigration(Boolean(error) || !hasPreferencesColumn || !hasWebsiteColumn || !hasCoverColumn)
        setCurrentUser(profile)
        setAccountEmail(authUser?.email || session.user.email || profile.email || '')
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

  useEffect(() => {
    if (!state?.message) return

    showToast(state.message, state.tone || 'success')
    navigate(pathname, { replace: true, state: null })
  }, [navigate, pathname, state])

  useEffect(() => {
    if (passwordResetCooldown <= 0) return undefined

    const timer = window.setInterval(() => {
      setPasswordResetCooldown((current) => (current <= 1 ? 0 : current - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [passwordResetCooldown])

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

  async function handleSendPasswordResetEmail() {
    if (!accountEmail) {
      showToast('Không xác định được email của tài khoản hiện tại.', 'error')
      return
    }

    setSendingPasswordReset(true)

    const { error } = await requestPasswordReset(accountEmail, {
      source: 'settings',
    })

    if (error) {
      showToast(error.message || 'Không thể gửi email đổi mật khẩu lúc này.', 'error')
      setSendingPasswordReset(false)
      return
    }

    showToast('Đã gửi email đổi mật khẩu. Vui lòng kiểm tra hộp thư của bạn.')
    setPasswordResetCooldown(60)
    setSendingPasswordReset(false)
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
      <SEO title="Cài đặt tài khoản" noIndex={true} />

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
              Cập nhật hồ sơ thật, gửi liên kết đổi mật khẩu bằng Supabase Auth, kiểm soát trang cá nhân công khai
              và chuẩn bị sẵn dữ liệu cho Notification Center nội bộ.
            </p>
          </div>

          <div className="settings-hero__snapshot">
            <div className="settings-hero__avatar">
              {currentUser?.avatar_url ? (
                <img src={currentUser.avatar_url} alt={`Ảnh đại diện của ${currentUser.name}`} loading="lazy" />
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
          <SettingsSidebar
            currentUser={currentUser}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            handleLogout={handleLogout}
            memberSince={memberSince}
          />

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
              <AccountSettingsSection
                profileForm={profileForm}
                profileErrors={profileErrors}
                handleProfileFieldChange={handleProfileFieldChange}
                handleSaveProfile={handleSaveProfile}
                savingProfile={savingProfile}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            ) : null}

            {activeSection === 'security' ? (
              <SecuritySettingsSection
                accountEmail={accountEmail}
                currentUser={currentUser}
                sendingPasswordReset={sendingPasswordReset}
                passwordResetCooldown={passwordResetCooldown}
                handleSendPasswordResetEmail={handleSendPasswordResetEmail}
              />
            ) : null}

            {activeSection === 'privacy' ? (
              <PrivacySettingsSection
                privacyForm={privacyForm}
                setPrivacyForm={setPrivacyForm}
                handleSavePrivacy={handleSavePrivacy}
                savingPrivacy={savingPrivacy}
              />
            ) : null}

            {activeSection === 'notifications' ? (
              <NotificationSettingsSection
                notificationForm={notificationForm}
                setNotificationForm={setNotificationForm}
                handleSaveNotifications={handleSaveNotifications}
                savingNotifications={savingNotifications}
              />
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
