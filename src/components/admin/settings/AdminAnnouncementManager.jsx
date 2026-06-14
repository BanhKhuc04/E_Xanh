import { useCallback, useEffect, useState } from 'react'
import {
  createWebsiteAnnouncement,
  deleteWebsiteAnnouncement,
  fetchWebsiteAnnouncements,
  updateWebsiteAnnouncement,
} from '../../../services/announcementService'

const INITIAL_FORM = {
  title: '',
  message: '',
  type: 'info',
  display_mode: 'static',
  position: 'top',
  is_active: true,
  start_at: '',
  end_at: '',
  cta_label: '',
  cta_url: '',
  priority: 100,
}

function toDateTimeLocalValue(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
}

function AdminAnnouncementManager() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(INITIAL_FORM)

  const loadAnnouncements = useCallback(async () => {
    setLoading(true)
    const { data, error } = await fetchWebsiteAnnouncements()
    if (error) {
      setErrorMsg(`Không tải được thông báo website: ${error.message}`)
    } else {
      setAnnouncements(data)
      setErrorMsg('')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAnnouncements()
  }, [loadAnnouncements])

  function resetForm() {
    setForm(INITIAL_FORM)
    setEditingId(null)
  }

  function handleChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setErrorMsg('')
    setSuccessMsg('')

    const payload = {
      ...form,
      title: form.title.trim(),
      message: form.message.trim(),
      start_at: form.start_at ? new Date(form.start_at).toISOString() : null,
      end_at: form.end_at ? new Date(form.end_at).toISOString() : null,
      priority: Number(form.priority) || 0,
    }

    if (!payload.message) {
      setErrorMsg('Thông báo cần có nội dung hiển thị.')
      setSaving(false)
      return
    }

    const result = editingId
      ? await updateWebsiteAnnouncement(editingId, payload)
      : await createWebsiteAnnouncement(payload)

    if (result.error) {
      setErrorMsg(result.error.message)
    } else {
      setSuccessMsg(editingId ? 'Đã cập nhật thông báo website.' : 'Đã tạo thông báo website mới.')
      resetForm()
      await loadAnnouncements()
    }

    setSaving(false)
  }

  function handleEdit(announcement) {
    setEditingId(announcement.id)
    setForm({
      title: announcement.title || '',
      message: announcement.message || '',
      type: announcement.type || 'info',
      display_mode: announcement.display_mode || 'static',
      position: announcement.position || 'top',
      is_active: Boolean(announcement.is_active),
      start_at: toDateTimeLocalValue(announcement.start_at),
      end_at: toDateTimeLocalValue(announcement.end_at),
      cta_label: announcement.cta_label || '',
      cta_url: announcement.cta_url || '',
      priority: announcement.priority ?? 100,
    })
    setSuccessMsg('')
    setErrorMsg('')
  }

  async function handleDelete(id) {
    if (!window.confirm('Xóa thông báo này khỏi website?')) return

    const { error } = await deleteWebsiteAnnouncement(id)
    if (error) {
      setErrorMsg(`Không thể xóa thông báo: ${error.message}`)
      return
    }

    if (editingId === id) {
      resetForm()
    }

    setSuccessMsg('Đã xóa thông báo.')
    await loadAnnouncements()
  }

  async function handleToggleActive(announcement) {
    const { error } = await updateWebsiteAnnouncement(announcement.id, {
      is_active: !announcement.is_active,
    })

    if (error) {
      setErrorMsg(`Không thể đổi trạng thái: ${error.message}`)
      return
    }

    setSuccessMsg('Đã cập nhật trạng thái thông báo.')
    await loadAnnouncements()
  }

  return (
    <section className="st-card announcement-manager">
      <div className="announcement-manager__header">
        <div>
          <h2 className="st-card__title">Thông báo website</h2>
          <p className="announcement-manager__intro">
            Tạo thanh thông báo cố định hoặc chữ chạy ở đầu website. Chỉ thông báo đang active và còn trong thời gian hiệu lực mới được hiển thị.
          </p>
        </div>
      </div>

      {errorMsg ? <div className="admin-alert admin-alert--error">{errorMsg}</div> : null}
      {successMsg ? <div className="admin-alert admin-alert--success">{successMsg}</div> : null}

      <form className="announcement-manager__form" onSubmit={handleSubmit}>
        <div className="announcement-manager__grid">
          <label className="st-card__field">
            <span className="st-card__label">Tiêu đề</span>
            <input className="st-card__input" value={form.title} onChange={(event) => handleChange('title', event.target.value)} placeholder="Ví dụ: Bảo trì hệ thống" />
          </label>

          <label className="st-card__field">
            <span className="st-card__label">Loại</span>
            <select className="st-card__input" value={form.type} onChange={(event) => handleChange('type', event.target.value)}>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="danger">Danger</option>
            </select>
          </label>

          <label className="st-card__field">
            <span className="st-card__label">Kiểu hiển thị</span>
            <select className="st-card__input" value={form.display_mode} onChange={(event) => handleChange('display_mode', event.target.value)}>
              <option value="static">Thanh tĩnh</option>
              <option value="marquee">Chữ chạy</option>
            </select>
          </label>

          <label className="st-card__field">
            <span className="st-card__label">Ưu tiên</span>
            <input className="st-card__input" type="number" value={form.priority} onChange={(event) => handleChange('priority', event.target.value)} />
          </label>

          <label className="st-card__field announcement-manager__field--full">
            <span className="st-card__label">Nội dung</span>
            <textarea className="st-card__input st-card__textarea" rows="3" value={form.message} onChange={(event) => handleChange('message', event.target.value)} placeholder="Ví dụ: Hệ thống sẽ bảo trì ngắn lúc 22:00 tối nay." />
          </label>

          <label className="st-card__field">
            <span className="st-card__label">Hiệu lực từ</span>
            <input className="st-card__input" type="datetime-local" value={form.start_at} onChange={(event) => handleChange('start_at', event.target.value)} />
          </label>

          <label className="st-card__field">
            <span className="st-card__label">Hiệu lực đến</span>
            <input className="st-card__input" type="datetime-local" value={form.end_at} onChange={(event) => handleChange('end_at', event.target.value)} />
          </label>

          <label className="st-card__field">
            <span className="st-card__label">CTA label</span>
            <input className="st-card__input" value={form.cta_label} onChange={(event) => handleChange('cta_label', event.target.value)} placeholder="Tìm hiểu thêm" />
          </label>

          <label className="st-card__field">
            <span className="st-card__label">CTA URL</span>
            <input className="st-card__input" value={form.cta_url} onChange={(event) => handleChange('cta_url', event.target.value)} placeholder="/lien-he hoặc https://..." />
          </label>
        </div>

        <label className="announcement-manager__toggle">
          <input type="checkbox" checked={form.is_active} onChange={(event) => handleChange('is_active', event.target.checked)} />
          <span>Hiển thị ngay khi nằm trong thời gian hiệu lực</span>
        </label>

        <div className="st-card__actions">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Đang lưu...' : editingId ? 'Cập nhật thông báo' : 'Tạo thông báo'}
          </button>
          <button type="button" className="btn btn--secondary" onClick={resetForm} disabled={saving}>
            {editingId ? 'Hủy sửa' : 'Làm mới form'}
          </button>
        </div>
      </form>

      <div className="announcement-manager__list">
        {loading ? <p>Đang tải thông báo...</p> : null}
        {!loading && announcements.length === 0 ? <p>Chưa có thông báo nào.</p> : null}

        {!loading && announcements.length > 0
          ? announcements.map((announcement) => (
            <article key={announcement.id} className={`announcement-manager__item announcement-manager__item--${announcement.type || 'info'}`}>
              <div className="announcement-manager__item-top">
                <div>
                  <strong>{announcement.title || 'Thông báo không tiêu đề'}</strong>
                  <p>{announcement.message}</p>
                </div>
                <span className={`st-badge ${announcement.is_active ? 'st-badge--active' : 'st-badge--warning'}`}>
                  {announcement.is_active ? 'Đang bật' : 'Đã tắt'}
                </span>
              </div>

              <div className="announcement-manager__meta">
                <span>{announcement.display_mode === 'marquee' ? 'Chữ chạy' : 'Thanh tĩnh'}</span>
                <span>Ưu tiên {announcement.priority ?? 0}</span>
                <span>
                  {announcement.start_at ? new Date(announcement.start_at).toLocaleString('vi-VN') : 'Bắt đầu ngay'}
                </span>
              </div>

              <div className="st-card__actions">
                <button type="button" className="btn btn--secondary" onClick={() => handleEdit(announcement)}>
                  Sửa
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => handleToggleActive(announcement)}>
                  {announcement.is_active ? 'Tắt hiển thị' : 'Bật hiển thị'}
                </button>
                <button type="button" className="btn btn--ghost" style={{ color: '#b23b2a' }} onClick={() => handleDelete(announcement.id)}>
                  Xóa
                </button>
              </div>
            </article>
          ))
          : null}
      </div>
    </section>
  )
}

export default AdminAnnouncementManager
