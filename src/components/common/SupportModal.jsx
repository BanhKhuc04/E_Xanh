import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Mail, Send, X, Volume2 } from 'lucide-react'
import { submitBugReport } from '../../services/siteNoticeService'
import '../../styles/support-modal.css'

const INITIAL_FORM = {
  title: '',
  description: '',
  severity: 'medium',
}

function SupportModal({
  open,
  notice,
  isNew,
  onClose,
  onMarkSeen,
}) {
  const [activeTab, setActiveTab] = useState('report')
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [toast, setToast] = useState(null)

  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setActiveTab('report')
    }
  }

  useEffect(() => {
    if (!toast) return undefined
    const timeoutId = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timeoutId)
  }, [toast])

  const currentPageUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return window.location.href
  }, [])

  const currentUserAgent = useMemo(() => {
    if (typeof navigator === 'undefined') return ''
    return navigator.userAgent
  }, [])

  if (!open) return null

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      handleClose()
    }
  }

  function handleClose() {
    if (notice?.id) {
      onMarkSeen(notice.id)
    }
    onClose()
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

    setSubmitting(false)

    if (error) {
      setErrorMsg(error.message || 'Có lỗi xảy ra, vui lòng thử lại sau.')
    } else {
      setForm(INITIAL_FORM)
      setToast('Cảm ơn bạn đã báo lỗi, E-XANH sẽ kiểm tra sớm.')
    }
  }

  const latestNoticeCard = notice ? (
    <div className="exanh-support-admin-notice">
      <div className="exanh-support-admin-notice__head">
        <span className="exanh-support-admin-notice__label">
          <Volume2 size={18} color="#d96704" /> Thông báo mới từ admin
        </span>
        {isNew && <span className="exanh-support-admin-notice__badge">MỚI</span>}
      </div>
      <h4 className="exanh-support-admin-notice__title">{notice.title || 'Thông báo mới nhất từ admin'}</h4>
      <div className="exanh-support-admin-notice__content">{notice.description || 'E-XANH đã cập nhật hệ thống để hỗ trợ bạn tốt hơn.'}</div>
      {notice.created_at && (
        <div className="exanh-support-admin-notice__date">
          Cập nhật: {new Date(notice.created_at).toLocaleDateString('vi-VN')}
        </div>
      )}
    </div>
  ) : null

  return (
    <div className="exanh-support-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="support-modal-title">
      <div className="exanh-support-modal">
        <button type="button" className="exanh-support-modal__close" onClick={handleClose} aria-label="Đóng trung tâm hỗ trợ">
          <X size={20} strokeWidth={2.5} />
        </button>

        <header className="exanh-support-modal__header">
          <div className="exanh-support-modal__eyebrow">
            <span className="exanh-support-chip">Hỗ trợ & báo lỗi</span>
          </div>
          <h2 id="support-modal-title">Trung tâm hỗ trợ E-XANH</h2>
          <p>Báo lỗi, liên hệ và xem cập nhật mới nhất từ admin.</p>
        </header>

        <div className="exanh-support-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'report'}
            className={`exanh-support-tab ${activeTab === 'report' ? 'exanh-support-tab--active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            <AlertTriangle size={18} />
            Báo lỗi
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'contact'}
            className={`exanh-support-tab ${activeTab === 'contact' ? 'exanh-support-tab--active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <Mail size={18} />
            Liên hệ
          </button>
        </div>

        {activeTab === 'report' && (
          <div role="tabpanel" className="exanh-support-tab-content">
            {latestNoticeCard}

            {toast && (
              <div style={{ padding: '12px 16px', background: '#dcfce7', color: '#166534', borderRadius: '12px', marginBottom: '24px', fontWeight: 600 }}>
                {toast}
              </div>
            )}

            {errorMsg && (
              <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#991b1b', borderRadius: '12px', marginBottom: '24px', fontWeight: 600 }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="exanh-support-form-grid">
                <div className="exanh-support-form-group exanh-support-form-full">
                  <label htmlFor="bug-title">Tên lỗi / Tiêu đề lỗi</label>
                  <input
                    id="bug-title"
                    type="text"
                    className="exanh-support-input"
                    placeholder="Ví dụ: Không thể tải ảnh bài viết"
                    value={form.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="exanh-support-form-group">
                  <label htmlFor="bug-severity">Mức độ lỗi</label>
                  <select
                    id="bug-severity"
                    className="exanh-support-select"
                    value={form.severity}
                    onChange={(e) => handleFieldChange('severity', e.target.value)}
                  >
                    <option value="low">Thấp - Lỗi nhỏ xíu, UI/UX</option>
                    <option value="medium">Trung bình - Tính năng không hoạt động</option>
                    <option value="high">Cao - Nứt vỡ layout, crash app</option>
                    <option value="critical">Nghiêm trọng - Mất dữ liệu, treo web</option>
                  </select>
                </div>

                <div className="exanh-support-form-group">
                  <label htmlFor="bug-url">Trang đang gặp lỗi</label>
                  <input
                    id="bug-url"
                    type="text"
                    className="exanh-support-input"
                    value={currentPageUrl}
                    readOnly
                    style={{ background: '#f8fafc', color: '#64748b' }}
                  />
                </div>

                <div className="exanh-support-form-group exanh-support-form-full">
                  <label htmlFor="bug-desc">Mô tả lỗi chi tiết</label>
                  <textarea
                    id="bug-desc"
                    className="exanh-support-textarea"
                    placeholder="Mô tả các bước để tái tạo lỗi này..."
                    value={form.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="exanh-support-submit" disabled={submitting}>
                <Send size={18} />
                {submitting ? 'Đang gửi...' : 'Gửi báo lỗi'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'contact' && (
          <div role="tabpanel" className="exanh-support-tab-content">
            <div className="exanh-support-contact">
              <Mail size={48} strokeWidth={1.5} color="var(--color-primary-500)" style={{ margin: '0 auto 16px auto', display: 'block' }} />
              <h3>Liên hệ đội ngũ E-XANH</h3>
              <p>Mọi góp ý, hợp tác hoặc hỗ trợ khác, vui lòng gửi email về:<br/><strong>support@exanh.vn</strong></p>
              
              {notice?.contact_url && (
                <a
                  href={notice.contact_url}
                  target="_blank"
                  rel="noreferrer"
                  className="exanh-support-submit"
                  style={{ marginTop: '24px', textDecoration: 'none' }}
                >
                  {notice.contact_label || 'Mở form hỗ trợ'}
                </a>
              )}
              
              <p style={{ marginTop: '16px', fontSize: '0.9rem' }}>Đội ngũ E-XANH sẽ cố gắng phản hồi bạn trong thời gian sớm nhất.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SupportModal
