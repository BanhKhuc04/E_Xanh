import { AlertTriangle } from 'lucide-react'
import '../../styles/site-notice.css'

function FloatingBugButton({ onClick, label = 'Báo lỗi' }) {
  return (
    <button
      type="button"
      className="floating-bug-button"
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <span className="floating-bug-button__icon">
        <AlertTriangle size={18} />
      </span>
      <span className="floating-bug-button__label">{label}</span>
    </button>
  )
}

export default FloatingBugButton
