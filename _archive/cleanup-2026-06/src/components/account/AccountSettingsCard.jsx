import { useState, useEffect } from 'react'

const SETTINGS_KEY = 'exanh_account_settings'

function AccountSettingsCard() {
  const [settings, setSettings] = useState({
    notifications: true,
    savingEmails: true,
    publicProfile: false,
    saveElectricityHistory: true,
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY)
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (e) {
        console.error('Lỗi đọc settings:', e)
      }
    }
  }, [])

  function handleToggle(field) {
    setSettings((current) => ({
      ...current,
      [field]: !current[field],
    }))
  }

  function handleSave() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    setMessage('Cài đặt đã được lưu trên thiết bị này.')

    window.setTimeout(() => {
      setMessage('')
    }, 2500)
  }

  return (
    <section className="account-side-card">
      <h2>Cài đặt tài khoản</h2>

      <div className="account-settings">
        <button type="button" onClick={() => handleToggle('notifications')}>
          <span>Nhận thông báo bài viết mới</span>
          <span className={`account-toggle ${settings.notifications ? 'is-on' : ''}`}></span>
        </button>
        <button type="button" onClick={() => handleToggle('savingEmails')}>
          <span>Nhận email mẹo tiết kiệm điện</span>
          <span className={`account-toggle ${settings.savingEmails ? 'is-on' : ''}`}></span>
        </button>
        <button type="button" onClick={() => handleToggle('publicProfile')}>
          <span>Hiển thị hồ sơ công khai</span>
          <span className={`account-toggle ${settings.publicProfile ? 'is-on' : ''}`}></span>
        </button>
        <button type="button" onClick={() => handleToggle('saveElectricityHistory')}>
          <span>Lưu lịch sử kiểm tra tiền điện</span>
          <span className={`account-toggle ${settings.saveElectricityHistory ? 'is-on' : ''}`}></span>
        </button>
      </div>

      <button type="button" className="btn btn--primary account-settings__submit" onClick={handleSave}>
        Lưu cài đặt
      </button>

      {message ? <p className="account-settings__message">{message}</p> : null}
    </section>
  )
}

export default AccountSettingsCard
