import { useCallback, useEffect, useMemo, useState } from 'react'
import { Eye, RefreshCw, Sparkles } from 'lucide-react'
import SupportModal from '../../common/SupportModal'
import {
  createSiteNotice,
  getAllSiteNotices,
  getDefaultGuideSections,
  updateSiteNotice,
} from '../../../services/siteNoticeService'

const INITIAL_NOTICE_FORM = {
  notice_key: 'main',
  version: 'v1.0',
  title: 'Hướng dẫn test & báo lỗi E-XANH',
  subtitle: 'Vui lòng kiểm tra các vai trò và tính năng quan trọng trước khi đánh giá tổng thể website.',
  description: 'Nếu gặp lỗi khi test, hãy dùng ngay form báo lỗi để nhóm E-XANH xử lý nhanh hơn.',
  guide_sections_text: JSON.stringify(getDefaultGuideSections(), null, 2),
  contact_label: 'Mở form hỗ trợ',
  contact_url: '',
  is_active: true,
  show_on_first_visit: true,
  show_bug_button: true,
}

function parseGuideSectionsText(value) {
  const trimmed = value.trim()
  if (!trimmed) return []

  const parsed = JSON.parse(trimmed)
  if (!Array.isArray(parsed)) {
    throw new Error('`guide_sections` phải là một mảng JSON.')
  }

  return parsed
}

function createFormFromNotice(notice) {
  return {
    notice_key: notice.notice_key || 'main',
    version: notice.version || 'v1.0',
    title: notice.title || '',
    subtitle: notice.subtitle || '',
    description: notice.description || '',
    guide_sections_text: JSON.stringify(notice.guide_sections || [], null, 2),
    contact_label: notice.contact_label || '',
    contact_url: notice.contact_url || '',
    is_active: Boolean(notice.is_active),
    show_on_first_visit: notice.show_on_first_visit !== false,
    show_bug_button: notice.show_bug_button !== false,
  }
}

function bumpVersion(version) {
  const trimmed = String(version || '').trim()
  const match = trimmed.match(/^(.*?)(\d+)(?!.*\d)/)

  if (!match) return 'v1.0'

  const prefix = match[1]
  const nextNumber = Number(match[2]) + 1
  return `${prefix}${nextNumber}`
}

function AdminSiteNoticeManager() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [form, setForm] = useState(INITIAL_NOTICE_FORM)

  const loadNotices = useCallback(async () => {
    setLoading(true)
    const { data, error } = await getAllSiteNotices()

    if (error) {
      setNotices([])
      setErrorMsg(error.message)
    } else {
      setNotices(data || [])
      setErrorMsg('')

      if (data?.length > 0 && !editingId) {
        setEditingId(data[0].id)
        setForm(createFormFromNotice(data[0]))
      }
    }

    setLoading(false)
  }, [editingId])

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadNotices()
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [loadNotices])

  const previewNotice = useMemo(() => {
    try {
      return {
        notice_key: form.notice_key.trim() || 'main',
        version: form.version.trim() || 'v1.0',
        title: form.title.trim() || 'Hướng dẫn test & báo lỗi E-XANH',
        subtitle: form.subtitle.trim(),
        description: form.description.trim(),
        guide_sections: parseGuideSectionsText(form.guide_sections_text),
        contact_label: form.contact_label.trim(),
        contact_url: form.contact_url.trim(),
        is_active: form.is_active,
        show_on_first_visit: form.show_on_first_visit,
        show_bug_button: form.show_bug_button,
      }
    } catch {
      return null
    }
  }, [form])

  function handleFieldChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleCreateDraft() {
    setEditingId(null)
    setForm({
      ...INITIAL_NOTICE_FORM,
      version: bumpVersion(form.version),
    })
    setErrorMsg('')
    setSuccessMsg('')
  }

  function handleEditNotice(notice) {
    setEditingId(notice.id)
    setForm(createFormFromNotice(notice))
    setErrorMsg('')
    setSuccessMsg('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setErrorMsg('')
    setSuccessMsg('')

    let guideSections

    try {
      guideSections = parseGuideSectionsText(form.guide_sections_text)
    } catch (error) {
      setErrorMsg(error.message)
      setSaving(false)
      return
    }

    const payload = {
      notice_key: form.notice_key.trim() || 'main',
      version: form.version.trim() || 'v1.0',
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      guide_sections: guideSections,
      contact_label: form.contact_label.trim(),
      contact_url: form.contact_url.trim(),
      is_active: form.is_active,
      show_on_first_visit: form.show_on_first_visit,
      show_bug_button: form.show_bug_button,
    }

    if (!payload.title) {
      setErrorMsg('Tiêu đề thông báo không được để trống.')
      setSaving(false)
      return
    }

    const result = editingId
      ? await updateSiteNotice(editingId, payload)
      : await createSiteNotice(payload)

    if (result.error) {
      setErrorMsg(result.error.message)
    } else {
      setSuccessMsg(editingId ? 'Đã cập nhật notice hệ thống.' : 'Đã tạo notice hệ thống mới.')
      setEditingId(result.data.id)
      setForm(createFormFromNotice(result.data))
      await loadNotices()
    }

    setSaving(false)
  }

  return (
    <>
      <section className="st-card site-notice-admin-card">
        <div className="notification-section-heading">
          <div>
            <h3 className="st-card__title">Notice test & báo lỗi ngoài website</h3>
            <p className="st-card__helper">
              Điều khiển popup lớn lần đầu, nút nổi “Báo lỗi” và toàn bộ nội dung hướng dẫn test lấy từ Supabase.
            </p>
          </div>
          <div className="site-notice-admin-card__toolbar">
            <button type="button" className="btn btn--secondary" onClick={loadNotices} disabled={loading}>
              <RefreshCw size={16} />
              {loading ? 'Đang tải...' : 'Tải lại'}
            </button>
            <button type="button" className="btn btn--ghost" onClick={handleCreateDraft}>
              <Sparkles size={16} />
              Tạo version mới
            </button>
          </div>
        </div>

        {errorMsg ? <div className="admin-alert admin-alert--error">{errorMsg}</div> : null}
        {successMsg ? <div className="admin-alert admin-alert--success">{successMsg}</div> : null}

        <div className="site-notice-admin-layout">
          <form className="site-notice-admin-form" onSubmit={handleSubmit}>
            <div className="notification-form-grid">
              <label className="st-card__field">
                <span className="st-card__label">Notice key</span>
                <input
                  className="st-card__input"
                  value={form.notice_key}
                  onChange={(event) => handleFieldChange('notice_key', event.target.value)}
                  placeholder="main"
                />
              </label>

              <label className="st-card__field">
                <span className="st-card__label">Version</span>
                <div className="site-notice-version-field">
                  <input
                    className="st-card__input"
                    value={form.version}
                    onChange={(event) => handleFieldChange('version', event.target.value)}
                    placeholder="v1.2"
                  />
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => handleFieldChange('version', bumpVersion(form.version))}
                  >
                    Tăng version
                  </button>
                </div>
              </label>

              <label className="st-card__field notification-form-grid__full">
                <span className="st-card__label">Tiêu đề</span>
                <input
                  className="st-card__input"
                  value={form.title}
                  onChange={(event) => handleFieldChange('title', event.target.value)}
                  placeholder="Hướng dẫn test & báo lỗi E-XANH"
                />
              </label>

              <label className="st-card__field notification-form-grid__full">
                <span className="st-card__label">Subtitle</span>
                <input
                  className="st-card__input"
                  value={form.subtitle}
                  onChange={(event) => handleFieldChange('subtitle', event.target.value)}
                  placeholder="Mô tả ngắn về phiên bản đang test"
                />
              </label>

              <label className="st-card__field notification-form-grid__full">
                <span className="st-card__label">Mô tả</span>
                <textarea
                  className="st-card__input st-card__textarea"
                  rows="4"
                  value={form.description}
                  onChange={(event) => handleFieldChange('description', event.target.value)}
                  placeholder="Nêu phạm vi test, lưu ý dữ liệu và mục tiêu kiểm thử."
                />
              </label>

              <label className="st-card__field">
                <span className="st-card__label">Nhãn liên hệ</span>
                <input
                  className="st-card__input"
                  value={form.contact_label}
                  onChange={(event) => handleFieldChange('contact_label', event.target.value)}
                  placeholder="Mở Google Form"
                />
              </label>

              <label className="st-card__field">
                <span className="st-card__label">Link liên hệ</span>
                <input
                  className="st-card__input"
                  value={form.contact_url}
                  onChange={(event) => handleFieldChange('contact_url', event.target.value)}
                  placeholder="https://..."
                />
              </label>

              <label className="st-card__field notification-form-grid__full">
                <span className="st-card__label">Guide sections JSON</span>
                <textarea
                  className="st-card__input st-card__textarea site-notice-json-editor"
                  rows="14"
                  value={form.guide_sections_text}
                  onChange={(event) => handleFieldChange('guide_sections_text', event.target.value)}
                  placeholder='[{"title":"1. Test user","items":["Đăng ký","Đăng nhập"]}]'
                />
              </label>
            </div>

            <div className="site-notice-admin-flags">
              <label className="announcement-manager__toggle">
                <input type="checkbox" checked={form.is_active} onChange={(event) => handleFieldChange('is_active', event.target.checked)} />
                <span>Bật popup notice cho public</span>
              </label>
              <label className="announcement-manager__toggle">
                <input type="checkbox" checked={form.show_bug_button} onChange={(event) => handleFieldChange('show_bug_button', event.target.checked)} />
                <span>Giữ nút nổi “Báo lỗi” ngoài website</span>
              </label>
            </div>

            <div className="st-card__actions">
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Đang lưu...' : editingId ? 'Cập nhật notice' : 'Tạo notice'}
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setPreviewOpen(true)}
                disabled={!previewNotice}
              >
                <Eye size={16} />
                Preview popup
              </button>
            </div>
          </form>

          <aside className="site-notice-admin-sidebar">
            <section className="st-card notification-sidebar-card">
              <h4 className="st-card__title">Danh sách notice</h4>
              {loading ? <div className="notification-empty-state">Đang tải notice...</div> : null}
              {!loading && notices.length === 0 ? <div className="notification-empty-state">Chưa có notice nào.</div> : null}
              {!loading && notices.length > 0 ? (
                <div className="site-notice-admin-list">
                  {notices.map((notice) => (
                    <button
                      key={notice.id}
                      type="button"
                      className={`site-notice-admin-list__item${editingId === notice.id ? ' is-active' : ''}`}
                      onClick={() => handleEditNotice(notice)}
                    >
                      <strong>{notice.title}</strong>
                      <span>{notice.version}</span>
                      <span>{notice.is_active ? 'Đang bật' : 'Đã tắt'} • {notice.show_bug_button ? 'Có nút báo lỗi' : 'Ẩn nút báo lỗi'}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </section>
          </aside>
        </div>
      </section>

      <SupportModal
        open={previewOpen}
        notice={previewNotice}
        onClose={() => setPreviewOpen(false)}
        onMarkSeen={() => setPreviewOpen(false)}
      />
    </>
  )
}

export default AdminSiteNoticeManager
