import { useState, useMemo } from 'react'
import { deviceGroupOptions, deviceLevelOptions } from '../../../data/adminDevices'

const emptyForm = {
  name: '',
  group: 'Điều hòa',
  power: '',
  suggestedHoursPerDay: '',
  level: 'low',
  savingTip: '',
  status: 'active',
  icon: '⚡',
}

function AdminDeviceFormDrawer({ device, onClose, onSave, onToggleStatus }) {
  const isEditing = !!device

  const initialForm = useMemo(() => {
    if (device) {
      return {
        name: device.name,
        group: device.group,
        power: device.power,
        suggestedHoursPerDay: device.suggestedHoursPerDay,
        level: device.level,
        savingTip: device.savingTip,
        status: device.status,
        icon: device.icon,
      }
    }
    return emptyForm
  }, [device])

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Vui lòng nhập tên thiết bị.'
    if (!form.power || Number(form.power) <= 0)
      newErrors.power = 'Công suất phải lớn hơn 0.'
    if (!form.savingTip.trim())
      newErrors.savingTip = 'Vui lòng nhập gợi ý tiết kiệm.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSave({
      ...form,
      power: Number(form.power),
      suggestedHoursPerDay: Number(form.suggestedHoursPerDay) || 1,
    })
  }

  const levelLabelToKey = { 'Thấp': 'low', 'Trung bình': 'medium', 'Cao': 'high' }
  const levelKeyToLabel = { low: 'Thấp', medium: 'Trung bình', high: 'Cao' }

  return (
    <>
      <div className="ad-drawer-overlay" onClick={onClose} aria-hidden="true" />
      <aside className="ad-drawer" role="dialog" aria-label={isEditing ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị'}>
        <div className="ad-drawer__header">
          <h3>{isEditing ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}</h3>
          <button
            type="button"
            className="ad-drawer__close"
            onClick={onClose}
            aria-label="Đóng"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="ad-drawer__body">
          <div className="ad-drawer__field">
            <label className="ad-drawer__label">Tên thiết bị</label>
            <input
              type="text"
              className={`ad-drawer__input${errors.name ? ' is-error' : ''}`}
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="VD: Điều hòa 12000BTU"
            />
            {errors.name && <span className="ad-drawer__error">{errors.name}</span>}
          </div>

          <div className="ad-drawer__field">
            <label className="ad-drawer__label">Nhóm thiết bị</label>
            <select
              className="ad-drawer__input"
              value={form.group}
              onChange={(e) => handleChange('group', e.target.value)}
            >
              {deviceGroupOptions.filter((g) => g !== 'Tất cả').map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="ad-drawer__row">
            <div className="ad-drawer__field">
              <label className="ad-drawer__label">Công suất mặc định (W)</label>
              <input
                type="number"
                className={`ad-drawer__input${errors.power ? ' is-error' : ''}`}
                value={form.power}
                onChange={(e) => handleChange('power', e.target.value)}
                placeholder="VD: 850"
                min="1"
              />
              {errors.power && <span className="ad-drawer__error">{errors.power}</span>}
            </div>

            <div className="ad-drawer__field">
              <label className="ad-drawer__label">Số giờ gợi ý/ngày</label>
              <input
                type="number"
                className="ad-drawer__input"
                value={form.suggestedHoursPerDay}
                onChange={(e) => handleChange('suggestedHoursPerDay', e.target.value)}
                placeholder="VD: 8"
                min="0"
                max="24"
              />
            </div>
          </div>

          <div className="ad-drawer__row">
            <div className="ad-drawer__field">
              <label className="ad-drawer__label">Mức tiêu thụ</label>
              <select
                className="ad-drawer__input"
                value={levelKeyToLabel[form.level] ?? 'Thấp'}
                onChange={(e) => handleChange('level', levelLabelToKey[e.target.value] ?? 'low')}
              >
                {deviceLevelOptions.filter((l) => l !== 'Tất cả').map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="ad-drawer__field">
              <label className="ad-drawer__label">Trạng thái</label>
              <select
                className="ad-drawer__input"
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="active">Đang dùng</option>
                <option value="hidden">Đã ẩn</option>
              </select>
            </div>
          </div>

          <div className="ad-drawer__field">
            <label className="ad-drawer__label">Gợi ý tiết kiệm</label>
            <textarea
              className={`ad-drawer__input ad-drawer__textarea${errors.savingTip ? ' is-error' : ''}`}
              rows="3"
              value={form.savingTip}
              onChange={(e) => handleChange('savingTip', e.target.value)}
              placeholder="VD: Đặt nhiệt độ 26–28°C để giảm điện năng..."
            />
            {errors.savingTip && <span className="ad-drawer__error">{errors.savingTip}</span>}
          </div>
        </div>

        <div className="ad-drawer__footer">
          <button type="button" className="btn btn--primary" onClick={handleSubmit}>
            {isEditing ? 'Lưu thay đổi' : 'Lưu thiết bị'}
          </button>

          {isEditing && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => onToggleStatus(device.id)}
            >
              {device.status === 'hidden' ? 'Hiện lại' : 'Ẩn thiết bị'}
            </button>
          )}

          <button type="button" className="btn btn--secondary" onClick={onClose}>
            Hủy
          </button>
        </div>
      </aside>
    </>
  )
}

export default AdminDeviceFormDrawer
