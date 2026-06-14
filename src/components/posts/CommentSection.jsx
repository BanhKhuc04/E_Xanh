import { useEffect, useState } from 'react'
import InlineCommentSection from '../community/InlineCommentSection'

function CommentSection({ post }) {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadUser() {
      const { getCurrentSession, getCurrentUserProfile } = await import('../../services/authService')
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
    <InlineCommentSection
      postId={post.id}
      currentUser={currentUser}
      initialCount={post.comments}
      isOpen
      title="Bình luận"
      variant="detail"
    />
  )
}

export default CommentSection
