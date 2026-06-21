import { Link2, MonitorSmartphone, SquareUserRound } from 'lucide-react'
import ProfileAvatarSettings from '../ProfileAvatarSettings'
import ProfileCoverSettings from '../ProfileCoverSettings'
import { PROFILE_BIO_LIMIT } from './constants'

export default function AccountSettingsSection({
  profileForm,
  profileErrors,
  handleProfileFieldChange,
  handleSaveProfile,
  savingProfile,
  currentUser,
  setCurrentUser,
}) {
  return (
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
  )
}
