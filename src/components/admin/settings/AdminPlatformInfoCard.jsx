import { useEffect, useState } from 'react'

function AdminPlatformInfoCard({ initial, onSave }) {
  const [form, setForm] = useState(initial)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setForm(initial)
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [initial])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="st-card">
      <h3 className="st-card__title">Thông tin nền tảng</h3>

      <div className="st-card__field">
        <label className="st-card__label">Tên nền tảng</label>
        <input
          type="text"
          className="st-card__input"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>

      <div className="st-card__field">
        <label className="st-card__label">Slogan</label>
        <input
          type="text"
          className="st-card__input"
          value={form.slogan}
          onChange={(e) => handleChange('slogan', e.target.value)}
        />
      </div>

      <div className="st-card__field">
        <label className="st-card__label">Email liên hệ</label>
        <input
          type="email"
          className="st-card__input"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </div>

      <div className="st-card__field">
        <label className="st-card__label">Mô tả ngắn</label>
        <textarea
          className="st-card__input st-card__textarea"
          rows="3"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>

      <div className="st-card__actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => onSave(form)}
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  )
}

export default AdminPlatformInfoCard
