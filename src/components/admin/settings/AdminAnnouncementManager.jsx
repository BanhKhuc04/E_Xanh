import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createWebsiteAnnouncement,
  deleteWebsiteAnnouncement,
  fetchWebsiteAnnouncements,
  updateWebsiteAnnouncement,
} from '../../../services/announcementService'
import {
  evaluateAnnouncementVisibility,
  getVietnamTimeWindowLabel,
  toUtcIsoFromVietnamDateTimeLocal,
  toVietnamDateTimeLocalValue,
} from '../../../utils/announcementTime'

const INITIAL_FORM = {
  title: '',
  message: '',
  type: 'info',
  display_type: 'top_bar',
  is_active: true,
  start_at: '',
  end_at: '',
  cta_label: '',
  cta_url: '',
  priority: 100,
}

const TYPE_OPTIONS = [
  { value: 'info', label: 'Thông tin', description: 'Thông báo chung, ít gây gián đoạn.' },
  { value: 'success', label: 'Thành công', description: 'Xác nhận hoàn tất hoặc mở tính năng mới.' },
  { value: 'warning', label: 'Cảnh báo', description: 'Nhắc người dùng lưu ý thay đổi hoặc rủi ro.' },
  { value: 'maintenance', label: 'Bảo trì', description: 'Thông báo nâng cấp, downtime hoặc bảo trì định kỳ.' },
  { value: 'critical', label: 'Khẩn cấp', description: 'Sự cố nghiêm trọng cần người dùng chú ý ngay.' },
]

const DISPLAY_OPTIONS = [
  { value: 'top_bar', label: 'Thanh cố định đầu website' },
  { value: 'marquee', label: 'Chữ chạy website' },
  { value: 'popup', label: 'Popup nổi giữa màn hình' },
]

function getOptionMeta(options, value, fallbackLabel = value) {
  return options.find((option) => option.value === value) || { value, label: fallbackLabel, description: '' }
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

  const previewVisibility = useMemo(
    () =>
      evaluateAnnouncementVisibility({
        ...form,
        start_at: toUtcIsoFromVietnamDateTimeLocal(form.start_at),
        end_at: toUtcIsoFromVietnamDateTimeLocal(form.end_at),
      }),
    [form],
  )
  const selectedType = useMemo(() => getOptionMeta(TYPE_OPTIONS, form.type, 'Thông tin'), [form.type])
  const selectedDisplay = useMemo(() => getOptionMeta(DISPLAY_OPTIONS, form.display_type, 'Thanh cố định đầu website'), [form.display_type])

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
      display_type: form.display_type,
      start_at: toUtcIsoFromVietnamDateTimeLocal(form.start_at),
      end_at: toUtcIsoFromVietnamDateTimeLocal(form.end_at),
      priority: Number(form.priority) || 0,
    }

    if (!payload.title) {
      setErrorMsg('Thông báo website cần có tiêu đề ngắn để quản trị dễ theo dõi.')
      setSaving(false)
      return
    }

    if (!payload.message) {
      setErrorMsg('Thông báo website cần có nội dung hiển thị.')
      setSaving(false)
      return
    }

    if ((form.start_at && !payload.start_at) || (form.end_at && !payload.end_at)) {
      setErrorMsg('Thời gian hiệu lực không hợp lệ. Hãy nhập lại theo giờ Việt Nam.')
      setSaving(false)
      return
    }

    if (payload.start_at && payload.end_at && new Date(payload.start_at) > new Date(payload.end_at)) {
      setErrorMsg('Thời gian kết thúc phải sau thời gian bắt đầu.')
      setSaving(false)
      return
    }

    const result = editingId
      ? await updateWebsiteAnnouncement(editingId, payload)
      : await createWebsiteAnnouncement(payload)

    if (result.error) {
      if (result.error.message?.includes('website_announcements_type_check')) {
        setErrorMsg('Loại thông báo không hợp lệ. Vui lòng chọn loại khác.')
      } else {
        setErrorMsg(result.error.message)
      }
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
      display_type: announcement.display_type || 'top_bar',
      is_active: Boolean(announcement.is_active),
      start_at: toVietnamDateTimeLocalValue(announcement.start_at),
      end_at: toVietnamDateTimeLocalValue(announcement.end_at),
      cta_label: announcement.cta_label || '',
      cta_url: announcement.cta_url || '',
      priority: announcement.priority ?? 100,
    })
    setSuccessMsg('')
    setErrorMsg('')
  }

  async function handleDelete(id) {
    if (!window.confirm('Xóa hoặc archive thông báo này khỏi website?')) return

    const { error } = await deleteWebsiteAnnouncement(id)
    if (error) {
      setErrorMsg(`Không thể xóa thông báo: ${error.message}`)
      return
    }

    if (editingId === id) {
      resetForm()
    }

    setSuccessMsg('Đã xóa thông báo website.')
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

    setSuccessMsg('Đã cập nhật trạng thái thông báo website.')
    await loadAnnouncements()
  }

  return (
    <section className="st-card announcement-manager">
      <div className="announcement-manager__header">
        <div>
          <h2 className="st-card__title">Thông báo website</h2>
          <p className="announcement-manager__intro">
            Dùng cho thông báo công khai ngoài website. Mục này không gửi vào chuông người dùng hoặc admin.
          </p>
        </div>
      </div>

      {errorMsg ? <div className="admin-alert admin-alert--error">{errorMsg}</div> : null}
      {successMsg ? <div className="admin-alert admin-alert--success">{successMsg}</div> : null}

      <div className="announcement-manager__workspace">
        <form className="announcement-manager__form" onSubmit={handleSubmit}>
          <div className="announcement-manager__grid">
            <label className="st-card__field">
              <span className="st-card__label">Tiêu đề</span>
              <input className="st-card__input" value={form.title} onChange={(event) => handleChange('title', event.target.value)} placeholder="Ví dụ: Bảo trì hệ thống ban đêm" />
            </label>

            <label className="st-card__field">
              <span className="st-card__label">Loại</span>
              <select className="st-card__input" value={form.type} onChange={(event) => handleChange('type', event.target.value)}>
                {TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="st-card__field">
              <span className="st-card__label">Kiểu hiển thị</span>
              <select className="st-card__input" value={form.display_type} onChange={(event) => handleChange('display_type', event.target.value)}>
                {DISPLAY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="st-card__field">
              <span className="st-card__label">Ưu tiên</span>
              <input className="st-card__input" type="number" value={form.priority} onChange={(event) => handleChange('priority', event.target.value)} />
            </label>

            <label className="st-card__field announcement-manager__field--full">
              <span className="st-card__label">Nội dung</span>
              <textarea className="st-card__input st-card__textarea" rows="4" value={form.message} onChange={(event) => handleChange('message', event.target.value)} placeholder="Ví dụ: E-XANH sẽ bảo trì từ 23:00 đến 06:00 sáng mai để nâng cấp hệ thống." />
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
              <input className="st-card__input" value={form.cta_url} onChange={(event) => handleChange('cta_url', event.target.value)} placeholder="/bao-tri hoặc https://..." />
            </label>
          </div>

          <label className="announcement-manager__toggle">
            <input type="checkbox" checked={form.is_active} onChange={(event) => handleChange('is_active', event.target.checked)} />
            <span>Bật hiển thị khi announcement còn trong khung giờ hiệu lực</span>
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

        <aside className="announcement-manager__preview">
          <div className={`announcement-manager__preview-card announcement-manager__preview-card--${form.type}`}>
            <div className="announcement-manager__preview-top">
              <div>
                <strong>{form.title || 'Tiêu đề thông báo website'}</strong>
                <div className="announcement-manager__preview-pills">
                  <span className={`announcement-tone-pill announcement-tone-pill--${form.type}`}>
                    {selectedType.label}
                  </span>
                  <span className="announcement-tone-pill announcement-tone-pill--display">
                    {selectedDisplay.label}
                  </span>
                  <span className={form.is_active ? 'st-badge st-badge--active' : 'st-badge st-badge--warning'}>
                    {form.is_active ? 'Đang bật' : 'Đã tắt'}
                  </span>
                </div>
              </div>
            </div>
            <div className={`announcement-manager__preview-surface announcement-manager__preview-surface--${form.display_type}`}>
              {form.display_type === 'marquee' ? (
                <div className="announcement-manager__preview-marquee">
                  <div className="announcement-manager__preview-marquee-track">
                    <span className="announcement-manager__preview-marquee-item">
                      <strong>{form.title || 'Tiêu đề thông báo website'}</strong>
                      <span>•</span>
                      <span>{form.message || 'Nội dung preview sẽ hiển thị tại đây để kiểm tra cảm giác ngoài website.'}</span>
                    </span>
                    <span className="announcement-manager__preview-marquee-item" aria-hidden="true">
                      <strong>{form.title || 'Tiêu đề thông báo website'}</strong>
                      <span>•</span>
                      <span>{form.message || 'Nội dung preview sẽ hiển thị tại đây để kiểm tra cảm giác ngoài website.'}</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="announcement-manager__preview-body">
                  <p>{form.message || 'Nội dung preview sẽ hiển thị tại đây để kiểm tra cảm giác ngoài website.'}</p>
                </div>
              )}
            </div>
            <div className="announcement-manager__preview-meta">
              <span>{selectedType.description}</span>
              <span>{selectedDisplay.label}</span>
              <span>{getVietnamTimeWindowLabel(toUtcIsoFromVietnamDateTimeLocal(form.start_at), toUtcIsoFromVietnamDateTimeLocal(form.end_at))}</span>
              <span>{previewVisibility.visible ? 'Sẽ hiển thị nếu publish ngay bây giờ' : 'Hiện chưa đủ điều kiện hiển thị'}</span>
            </div>
            {form.cta_label && form.cta_url ? (
              <button type="button" className="announcement-manager__preview-cta">
                {form.cta_label}
              </button>
            ) : (
              <span className="announcement-manager__preview-nocta">Không render CTA khi label hoặc URL đang trống.</span>
            )}
          </div>
        </aside>
      </div>

      <div className="announcement-manager__list">
        {loading ? <p>Đang tải thông báo...</p> : null}
        {!loading && announcements.length === 0 ? <p>Chưa có thông báo website nào.</p> : null}

        {!loading && announcements.length > 0
          ? announcements.map((announcement) => {
            const visibility = evaluateAnnouncementVisibility(announcement)
            const visibilityLabel = visibility.visible
              ? 'Đang nằm trong khung giờ hiển thị'
              : visibility.reasons.includes('before_start')
                ? 'Chưa tới giờ hiển thị'
                : visibility.reasons.includes('after_end')
                  ? 'Đã hết hạn hiển thị'
                  : 'Đang tắt'

            return (
              <article key={announcement.id} className={`announcement-manager__item announcement-manager__item--${announcement.type || 'info'}`}>
                <div className="announcement-manager__item-top">
                  <div>
                    <div className="announcement-manager__item-tags">
                      <span className={`announcement-tone-pill announcement-tone-pill--${announcement.type || 'info'}`}>
                        {getOptionMeta(TYPE_OPTIONS, announcement.type || 'info', announcement.type || 'info').label}
                      </span>
                      <span className="announcement-tone-pill announcement-tone-pill--display">
                        {getOptionMeta(DISPLAY_OPTIONS, announcement.display_type || 'top_bar', announcement.display_type || 'top_bar').label}
                      </span>
                    </div>
                    <strong>{announcement.title || 'Thông báo không tiêu đề'}</strong>
                    <p>{announcement.message}</p>
                  </div>
                  <span className={announcement.is_active ? 'st-badge st-badge--active' : 'st-badge st-badge--warning'}>
                    {announcement.is_active ? 'Đang bật' : 'Đã tắt'}
                  </span>
                </div>

                <div className="announcement-manager__meta">
                  <span>{getOptionMeta(DISPLAY_OPTIONS, announcement.display_type || 'top_bar', announcement.display_type || 'top_bar').label}</span>
                  <span>Ưu tiên {announcement.priority ?? 0}</span>
                  <span>{getVietnamTimeWindowLabel(announcement.start_at, announcement.end_at)}</span>
                  <span>{visibilityLabel}</span>
                  {announcement.cta_label && announcement.cta_url ? (
                    <span>CTA: {announcement.cta_label} ({announcement.cta_url})</span>
                  ) : (
                    <span>CTA: Không dùng</span>
                  )}
                </div>

                <div className="st-card__actions">
                  <button type="button" className="btn btn--secondary" onClick={() => handleEdit(announcement)}>
                    Sửa
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={() => handleToggleActive(announcement)}>
                    {announcement.is_active ? 'Tắt hiển thị' : 'Bật hiển thị'}
                  </button>
                  <button type="button" className="btn btn--ghost" style={{ color: '#b23b2a' }} onClick={() => handleDelete(announcement.id)}>
                    Xóa / Archive
                  </button>
                </div>
              </article>
            )
          })
          : null}
      </div>
    </section>
  )
}

export default AdminAnnouncementManager
