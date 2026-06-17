import { useState } from 'react'
import { getInitials } from '../../utils/avatar'

function ActiveMemberAvatar({ src, name }) {
  const [failed, setFailed] = useState(false)
  const initials = getInitials(name || 'Thành viên E-XANH')

  if (!src || failed) {
    return (
      <div className="active-member__avatar active-member__avatar--fallback" aria-label={name || 'Thành viên E-XANH'}>
        {initials}
      </div>
    )
  }

  return (
    <div className="active-member__avatar">
      <img
        src={src}
        alt={name || 'Thành viên E-XANH'}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  )
}

export default ActiveMemberAvatar
