import { MessageCircleWarning } from 'lucide-react'
import '../../styles/support-modal.css'

function SupportFloatingButton({ onClick, hasUnreadNotice = false }) {
  return (
    <button
      type="button"
      className={`exanh-support-fab ${hasUnreadNotice ? 'exanh-support-fab--unread' : ''}`}
      onClick={onClick}
      aria-label="Hỗ trợ và Báo lỗi"
      title="Hỗ trợ & Báo lỗi"
    >
      <MessageCircleWarning size={24} />
      {hasUnreadNotice && (
        <span className="exanh-support-fab__badge">Mới</span>
      )}
    </button>
  )
}

export default SupportFloatingButton
