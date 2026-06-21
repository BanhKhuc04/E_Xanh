import { useMemo, useState } from 'react'
import { getInitials, isValidImageUrl, normalizeAvatarUrl } from '../../utils/avatar'
import './UserAvatar.css'

function UserAvatar({
  src,
  name,
  size = 'md', // xs | sm | md | lg | xl | profile | modal
  clickable = false,
  showStatusIcon = false,
  className = '',
  onClick,
}) {
  const [hasError, setHasError] = useState(false)

  const normalizedSrc = useMemo(() => normalizeAvatarUrl(src), [src])
  const safeName = name || 'Thành viên E-XANH'
  const initials = getInitials(safeName)
  const isSrcValid = Boolean(normalizedSrc) && isValidImageUrl(normalizedSrc) && !hasError

  const [prevNormalizedSrc, setPrevNormalizedSrc] = useState(normalizedSrc)
  
  if (normalizedSrc !== prevNormalizedSrc) {
    setPrevNormalizedSrc(normalizedSrc)
    setHasError(false)
  }

  const rootClassName = [
    'user-avatar',
    `user-avatar--${size}`,
    clickable ? 'user-avatar--clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const sharedProps = {
    className: rootClassName,
    onClick,
    'aria-label': clickable ? `Xem avatar của ${safeName}` : `Avatar của ${safeName}`,
  }

  const content = (
    <>
      <span className="user-avatar__media">
        {isSrcValid ? (
          <img
            src={normalizedSrc}
            alt={`Avatar của ${safeName}`}
            className="user-avatar__image"
            loading="lazy"
            onError={() => setHasError(true)}
          />
        ) : (
          <span className="user-avatar__initials" aria-hidden="true">
            {initials}
          </span>
        )}
      </span>

      {showStatusIcon ? <span className="user-avatar__status" aria-hidden="true" /> : null}
    </>
  )

  if (clickable) {
    return (
      <button type="button" {...sharedProps}>
        {content}
      </button>
    )
  }

  return <span {...sharedProps}>{content}</span>
}

export default UserAvatar
