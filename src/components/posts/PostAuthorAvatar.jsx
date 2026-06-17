import { useMemo, useState } from 'react'
import { UserRound } from 'lucide-react'
import { getInitials, isValidImageUrl, normalizeAvatarUrl } from '../../utils/avatar'

function PostAuthorAvatar({
  src,
  name,
  size = 'md',
  className = '',
}) {
  const [failed, setFailed] = useState(false)

  const normalizedSrc = useMemo(() => normalizeAvatarUrl(src), [src])
  const initials = getInitials(name || 'Thành viên E-XANH')
  const rootClassName = ['post-author-avatar', `post-author-avatar--${size}`, className]
    .filter(Boolean)
    .join(' ')

  if (!normalizedSrc || !isValidImageUrl(normalizedSrc) || failed) {
    return (
      <span className={`${rootClassName} post-author-avatar--fallback`} aria-label={name || 'Thành viên E-XANH'}>
        <span className="post-author-avatar__icon" aria-hidden="true">
          <UserRound size={14} strokeWidth={2.1} />
        </span>
        {initials}
      </span>
    )
  }

  return (
    <span className={rootClassName}>
      <img
        src={normalizedSrc}
        alt={name || 'Thành viên E-XANH'}
        className="post-author-avatar__image"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </span>
  )
}

export default PostAuthorAvatar
