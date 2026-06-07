function AdminAppearanceSettingsCard({ settings }) {
  return (
    <div className="st-card">
      <h3 className="st-card__title">Giao diện hệ thống</h3>

      <div className="st-appearance-grid">
        <div className="st-appearance-grid__item">
          <span className="st-appearance-grid__label">Chế độ giao diện</span>
          <span className="st-appearance-grid__value">{settings.theme}</span>
        </div>
        <div className="st-appearance-grid__item">
          <span className="st-appearance-grid__label">Màu chủ đạo</span>
          <span className="st-appearance-grid__value">
            <span className="st-appearance-grid__color-dot" />
            {settings.primaryColor}
          </span>
        </div>
        <div className="st-appearance-grid__item">
          <span className="st-appearance-grid__label">Bo góc card</span>
          <span className="st-appearance-grid__value">{settings.borderRadius}</span>
        </div>
        <div className="st-appearance-grid__item">
          <span className="st-appearance-grid__label">Mật độ hiển thị</span>
          <span className="st-appearance-grid__value">{settings.density}</span>
        </div>
      </div>

      <div className="st-appearance-preview">
        <span className="st-appearance-preview__label">Xem trước</span>
        <div className="st-appearance-preview__card">
          <div className="st-appearance-preview__icon">⚡</div>
          <div className="st-appearance-preview__text">
            <strong>Card mẫu E-XANH</strong>
            <span>Bo góc mềm • Nền sáng • Xanh lá</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAppearanceSettingsCard
