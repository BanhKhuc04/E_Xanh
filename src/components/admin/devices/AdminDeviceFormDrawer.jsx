import { useState, useMemo } from 'react'
import { deviceGroupOptions } from '../../../data/mock/adminDevices'

const emptyForm = {
  name: '',
  category: 'Điều hòa',
  default_power: '',
  tips: '',
  is_visible: true,
  icon: '⚡',
}

function AdminDeviceFormDrawer({ device, onClose, onSave, onToggleStatus }) {
  const isEditing = !!device

  const initialForm = useMemo(() => {
    if (device) {
      return {
        name: device.name,
        category: device.category || 'Khác',
        default_power: device.default_power,
        tips: device.tips || '',
        is_visible: device.is_visible,
        icon: device.icon || '⚡',
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
    if (!form.default_power || Number(form.default_power) <= 0)
      newErrors.default_power = 'Công suất phải lớn hơn 0.'
    if (!form.tips.trim())
      newErrors.tips = 'Vui lòng nhập gợi ý tiết kiệm.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSave({
      ...form,
      default_power: Number(form.default_power),
    })
  }



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
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
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
                className={`ad-drawer__input${errors.default_power ? ' is-error' : ''}`}
                value={form.default_power}
                onChange={(e) => handleChange('default_power', e.target.value)}
                placeholder="VD: 850"
                min="1"
              />
              {errors.default_power && <span className="ad-drawer__error">{errors.default_power}</span>}
            </div>

            <div className="ad-drawer__field">
              <label className="ad-drawer__label">Icon (Emoji)</label>
              <input
                type="text"
                className="ad-drawer__input"
                value={form.icon}
                onChange={(e) => handleChange('icon', e.target.value)}
                placeholder="VD: ⚡"
                maxLength="2"
              />
            </div>
          </div>

          <div className="ad-drawer__row">
            <div className="ad-drawer__field">
              <label className="ad-drawer__label">Trạng thái</label>
              <select
                className="ad-drawer__input"
                value={form.is_visible ? 'active' : 'hidden'}
                onChange={(e) => handleChange('is_visible', e.target.value === 'active')}
              >
                <option value="active">Đang dùng</option>
                <option value="hidden">Đã ẩn</option>
              </select>
            </div>
          </div>

          <div className="ad-drawer__field">
            <label className="ad-drawer__label">Gợi ý tiết kiệm</label>
            <textarea
              className={`ad-drawer__input ad-drawer__textarea${errors.tips ? ' is-error' : ''}`}
              rows="3"
              value={form.tips}
              onChange={(e) => handleChange('tips', e.target.value)}
              placeholder="VD: Đặt nhiệt độ 26–28°C để giảm điện năng..."
            />
            {errors.tips && <span className="ad-drawer__error">{errors.tips}</span>}
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
              {!device.is_visible ? 'Hiện lại' : 'Ẩn thiết bị'}
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
