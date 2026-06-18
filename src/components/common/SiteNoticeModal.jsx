import { AlertTriangle, BadgeCheck, ExternalLink, X } from 'lucide-react'
import '../../styles/site-notice.css'

function SiteNoticeModal({
  open,
  notice,
  onClose,
  onAcknowledge,
  onReport,
}) {
  if (!open || !notice) return null

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      onClose?.()
    }
  }

  return (
    <div className="site-notice-overlay" role="dialog" aria-modal="true" aria-labelledby="site-notice-title" onClick={handleOverlayClick}>
      <div className="site-notice-modal site-notice-modal--hero">
        <button type="button" className="site-notice-modal__close" onClick={onClose} aria-label="Đóng thông báo">
          <X size={20} />
        </button>

        <div className="site-notice-modal__hero">
          <div className="site-notice-modal__eyebrow">
            <span className="site-notice-chip site-notice-chip--soft">Thông báo kiểm thử E-XANH</span>
            <span className="site-notice-chip site-notice-chip--version">{notice.version}</span>
          </div>
          <h2 id="site-notice-title">{notice.title}</h2>
          {notice.subtitle ? <p className="site-notice-modal__subtitle">{notice.subtitle}</p> : null}
          {notice.description ? <p className="site-notice-modal__description">{notice.description}</p> : null}
        </div>

        <div className="site-notice-modal__summary">
          <div className="site-notice-modal__summary-item">
            <BadgeCheck size={18} />
            <div>
              <strong>Luồng test theo vai trò</strong>
              <span>Kiểm tra user, guest và admin theo đúng checklist.</span>
            </div>
          </div>
          <div className="site-notice-modal__summary-item">
            <AlertTriangle size={18} />
            <div>
              <strong>Báo lỗi ngay trong website</strong>
              <span>Gửi tiêu đề, mô tả, trang hiện tại và mức độ lỗi chỉ trong một form ngắn.</span>
            </div>
          </div>
        </div>

        <div className="site-notice-guide-grid">
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

        <div className="site-notice-modal__actions">
          <button type="button" className="btn btn--primary" onClick={onAcknowledge}>
            Tôi đã hiểu
          </button>
          <button type="button" className="btn btn--secondary" onClick={onReport}>
            Báo lỗi
          </button>
          {notice.contact_url ? (
            <a className="btn btn--ghost" href={notice.contact_url} target="_blank" rel="noreferrer noopener">
              {notice.contact_label || 'Liên hệ'}
              <ExternalLink size={16} />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default SiteNoticeModal
