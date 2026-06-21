import { useEffect, useState } from 'react'
import AdminToggle from './AdminToggle'
import AdminMFASettings from './AdminMFASettings'
import { supabase } from '../../../lib/supabase'

function AdminSecuritySettingsCard({
  security,
  onToggle,
  onSave,
  newPassword = '',
  onPasswordChange,
}) {
  const [loginHistory, setLoginHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    async function loadHistory() {
      setLoadingHistory(true)
      const { data, error } = await supabase
        .from('admin_login_history')
        .select('id, login_at, ip_address, success')
        .order('login_at', { ascending: false })
        .limit(10)
      if (!error && data) {
        setLoginHistory(data)
      }
      setLoadingHistory(false)
    }
    loadHistory()
  }, [])

  return (
    <div className="st-card">
      <h3 className="st-card__title">Bảo mật admin</h3>

      <div className="st-card__field">
        <label className="st-card__label">Đổi mật khẩu</label>
        <input
          type="password"
          className="st-card__input"
          placeholder="Nhập mật khẩu mới..."
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => onPasswordChange?.(event.target.value)}
        />
      </div>

      <div className="st-card__toggles">
        <AdminToggle
          checked={security.autoLogout}
          onChange={(val) => onToggle('autoLogout', val)}
          label="Tự động đăng xuất sau 30 phút không hoạt động"
          description="Bảo vệ tài khoản khi rời khỏi máy tính."
        />
        
        <div style={{ padding: '12px 16px', background: 'var(--color-bg-subtle, #f9f9f9)', borderRadius: '8px', marginTop: '12px', border: '1px solid var(--color-border, #eaeaea)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <strong style={{ fontSize: '0.95rem' }}>Xác minh 2 bước (2FA)</strong>
          </div>
          <p className="st-card__helper" style={{ margin: '4px 0 0 0' }}>Bảo vệ tài khoản bằng mã từ ứng dụng Authenticator.</p>
          <AdminMFASettings />
        </div>
      </div>

      <div className="st-card__field">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
           <span className="st-card__label" style={{ marginBottom: 0 }}>Lịch sử đăng nhập gần đây</span>
        </div>
        
        {loadingHistory ? (
          <p className="st-card__helper">Đang tải lịch sử...</p>
        ) : loginHistory.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem' }}>
            {loginHistory.map(log => (
              <li key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border, #eaeaea)' }}>
                <span>{new Date(log.login_at).toLocaleString('vi-VN')} - IP: {log.ip_address}</span>
                <span style={{ color: log.success ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {log.success ? 'Thành công' : 'Thất bại'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="st-card__helper">Chưa có lịch sử đăng nhập.</p>
        )}
      </div>

      <div className="st-card__actions">
        <button type="button" className="btn btn--primary" onClick={onSave}>
          Cập nhật bảo mật
        </button>
      </div>
    </div>
  )
}

export default AdminSecuritySettingsCard
