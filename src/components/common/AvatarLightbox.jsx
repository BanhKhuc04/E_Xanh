import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import UserAvatar from './UserAvatar'
import './AvatarLightbox.css'

function AvatarLightbox({ open, onClose, src, name }) {
  useEffect(() => {
    if (!open) return undefined

    const originalOverflow = document.body.style.overflow
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  const safeName = name || 'Thành viên E-XANH'

  return createPortal(
    <div className="avatar-lightbox" role="dialog" aria-modal="true" aria-label={`Xem avatar của ${safeName}`} onClick={onClose}>
      <div className="avatar-lightbox__overlay" />
      <div
        className="avatar-lightbox__content"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="avatar-lightbox__panel">
          <button type="button" className="avatar-lightbox__close" onClick={onClose} aria-label="Đóng xem avatar">
            ×
          </button>

          <div className="avatar-lightbox__image-wrapper">
             <UserAvatar 
              src={src} 
              name={safeName} 
              size="modal" 
              withFrame={false} 
              clickable={false}
            />
          </div>

          <p className="avatar-lightbox__name">{safeName}</p>
          <p className="avatar-lightbox__hint">Nhấn ESC, bấm nền tối hoặc nút đóng để thoát.</p>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default AvatarLightbox
