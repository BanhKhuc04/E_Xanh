import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ExternalLink, FileText, Mail, Send, X } from 'lucide-react'
import { submitBugReport } from '../../services/siteNoticeService'
import '../../styles/site-notice.css'

const TABS = [
  { key: 'guide', label: 'Hướng dẫn test', icon: FileText },
  { key: 'report', label: 'Báo lỗi', icon: AlertTriangle },
  { key: 'contact', label: 'Liên hệ', icon: Mail },
]

const INITIAL_FORM = {
  title: '',
  description: '',
  severity: 'medium',
}

function BugReportModal({
  open,
  notice,
  initialTab = 'guide',
  onClose,
}) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (open) {
      setActiveTab(initialTab)
    }
  }, [initialTab, open])

  useEffect(() => {
    if (!toast) return undefined

    const timeoutId = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timeoutId)
  }, [toast])

  const currentPageUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return window.location.href
  }, [open])

  const currentUserAgent = useMemo(() => {
    if (typeof navigator === 'undefined') return ''
    return navigator.userAgent
  }, [open])

  if (!open || !notice) return null

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      onClose?.()
    }
  }

  function handleFieldChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const title = form.title.trim()
    const description = form.description.trim()

    if (!title) {
      setErrorMsg('Tên lỗi hoặc tiêu đề lỗi không được để trống.')
      return
    }

    if (!description) {
      setErrorMsg('Mô tả lỗi không được để trống.')
      return
    }

    setSubmitting(true)
    setErrorMsg('')

    const { error } = await submitBugReport({
      title,
      description,
      severity: form.severity,
      page_url: currentPageUrl,
      user_agent: currentUserAgent,
    })

    if (error) {
      setErrorMsg(error.message || 'Không thể gửi bug report lúc này.')
      setSubmitting(false)
      return
    }

    setForm(INITIAL_FORM)
    setToast('Cảm ơn bạn đã báo lỗi, E-XANH sẽ kiểm tra sớm.')
    setActiveTab('report')
    setSubmitting(false)
  }

  return (
    <>
      <div className="site-notice-overlay" role="dialog" aria-modal="true" aria-labelledby="bug-report-title" onClick={handleOverlayClick}>
        <div className="site-notice-modal site-notice-modal--panel">
          <button type="button" className="site-notice-modal__close" onClick={onClose} aria-label="Đóng bảng báo lỗi">
            <X size={20} />
          </button>

          <div className="site-notice-panel__header">
            <div>
              <span className="site-notice-chip site-notice-chip--soft">Hỗ trợ test & báo lỗi</span>
              <h2 id="bug-report-title">{notice.title}</h2>
              <p>{notice.subtitle || 'Mở hướng dẫn test, gửi bug report nhanh và liên hệ nhóm E-XANH từ một nơi.'}</p>
            </div>
            <span className="site-notice-chip site-notice-chip--version">{notice.version}</span>
          </div>

          <div className="site-notice-tabs" role="tablist" aria-label="Bảng hỗ trợ test và báo lỗi">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  type="button"
                  className={`site-notice-tab${activeTab === tab.key ? ' is-active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="site-notice-panel__body">
            {activeTab === 'guide' ? (
              <div className="site-notice-guide-grid site-notice-guide-grid--compact">
                {notice.guide_sections.map((section, index) => (
                  <section key={`${section.title}-${index}`} className="site-notice-guide-card">
                    <h3>{section.title}</h3>
                    {section.items.length > 0 ? (
                      <ul>
                        {section.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>Chưa có checklist cho mục này.</p>
                    )}
                  </section>
                ))}
              </div>
            ) : null}

            {activeTab === 'report' ? (
              <form className="bug-report-form" onSubmit={handleSubmit}>
                <div className="bug-report-form__grid">
                  <label className="st-card__field">
                    <span className="st-card__label">Tên lỗi / tiêu đề lỗi</span>
                    <input
                      className="st-card__input"
                      value={form.title}
                      onChange={(event) => handleFieldChange('title', event.target.value)}
                      placeholder="Ví dụ: Không lưu được bài viết ở Community"
                    />
                  </label>

                  <label className="st-card__field">
                    <span className="st-card__label">Mức độ lỗi</span>
                    <select
                      className="st-card__input"
                      value={form.severity}
                      onChange={(event) => handleFieldChange('severity', event.target.value)}
                    >
                      <option value="low">Nhẹ</option>
                      <option value="medium">Trung bình</option>
                      <option value="critical">Nghiêm trọng</option>
                    </select>
                  </label>

                  <label className="st-card__field bug-report-form__full">
                    <span className="st-card__label">Mô tả lỗi</span>
                    <textarea
                      className="st-card__input st-card__textarea"
                      rows="5"
                      value={form.description}
                      onChange={(event) => handleFieldChange('description', event.target.value)}
                      placeholder="Mô tả ngắn gọn cách tái hiện lỗi, kết quả mong đợi và kết quả thực tế."
                    />
                  </label>

                  <label className="st-card__field bug-report-form__full">
                    <span className="st-card__label">Trang đang gặp lỗi</span>
                    <input className="st-card__input" value={currentPageUrl} readOnly />
                  </label>

                  <label className="st-card__field bug-report-form__full">
                    <span className="st-card__label">Thiết bị / trình duyệt</span>
                    <textarea className="st-card__input st-card__textarea" rows="3" value={currentUserAgent} readOnly />
                  </label>
                </div>

                {errorMsg ? <div className="admin-alert admin-alert--error">{errorMsg}</div> : null}

                <div className="bug-report-form__actions">
                  <button type="submit" className="btn btn--primary" disabled={submitting}>
                    <Send size={16} />
                    {submitting ? 'Đang gửi...' : 'Gửi báo lỗi'}
                  </button>
                </div>
              </form>
            ) : null}

            {activeTab === 'contact' ? (
              <div className="site-notice-contact-card">
                <h3>Liên hệ nhóm E-XANH</h3>
                <p>
                  {notice.description || 'Nếu cần gửi thêm ảnh, video hoặc hướng dẫn chi tiết hơn, bạn có thể liên hệ trực tiếp qua kênh hỗ trợ của dự án.'}
                </p>
                {notice.contact_url ? (
                  <a className="btn btn--primary" href={notice.contact_url} target="_blank" rel="noreferrer noopener">
                    {notice.contact_label || 'Mở form liên hệ'}
                    <ExternalLink size={16} />
                  </a>
                ) : (
                  <div className="admin-alert admin-alert--warning">
                    Admin chưa cấu hình đường dẫn liên hệ cho notice này.
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {toast ? (
        <div className="site-notice-toast" role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}
    </>
  )
}

export default BugReportModal
