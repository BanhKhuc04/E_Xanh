import { useEffect, useState } from 'react'
import { MessageCircleMore, PencilLine } from 'lucide-react'
import { getInitials, isValidImageUrl } from '../../utils/avatar'
import { getCurrentSession, getCurrentUserProfile } from '../../services/authService'
import { usePostComposer } from './PostComposerContext'

function PostComposer() {
  const { openComposer } = usePostComposer()
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadUser() {
      const session = await getCurrentSession()
      if (!isMounted || !session?.user) return

      const profile = await getCurrentUserProfile(session.user.id)
      if (!isMounted) return

      setCurrentUser(profile || { email: session.user.email, name: session.user.email })
    }

    loadUser()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="community-composer">
      <div className="community-composer__top">
        {isValidImageUrl(currentUser?.avatar_url) ? (
          <img
            className="community-composer__avatar"
            src={currentUser.avatar_url}
            alt={`Avatar của ${currentUser?.name || 'người dùng'}`}
          />
        ) : (
          <span className="community-composer__avatar community-composer__avatar--fallback">
            {getInitials(currentUser?.name || currentUser?.email || 'EX')}
          </span>
        )}

        <button
          type="button"
          className="community-composer__prompt"
          onClick={() => openComposer({ defaultType: 'community' })}
        >
          Bạn muốn chia sẻ mẹo tiết kiệm điện nào?
        </button>

        <button
          type="button"
          className="btn btn--primary community-composer__button"
          onClick={() => openComposer({ defaultType: 'community' })}
          data-testid="community-write-post-button"
        >
          <PencilLine size={16} />
          Viết bài chia sẻ
        </button>
      </div>

      <div className="community-composer__actions">
        <button type="button" onClick={() => openComposer({ defaultType: 'community' })}>
          Ảnh
        </button>
        <button type="button" onClick={() => openComposer({ defaultType: 'community' })}>
          Chủ đề
        </button>
        <button type="button" onClick={() => openComposer({ defaultType: 'community' })}>
          <MessageCircleMore size={16} />
          Mẹo nhanh
        </button>
      </div>
    </section>
  )
}

export default PostComposer
