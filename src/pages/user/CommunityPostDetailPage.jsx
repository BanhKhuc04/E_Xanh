import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import CommunityPostCard from '../../components/community/CommunityPostCard'
import { getPostById } from '../../services/postService'
import { getCurrentSession, getCurrentUserProfile } from '../../services/authService'

function CommunityPostDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [commentsByPost, setCommentsByPost] = useState({})
  
  // We use this just to let CommunityPostCard manage its own UI states
  const [activeCommentPostId, setActiveCommentPostId] = useState(id)
  const [activeSharePostId, setActiveSharePostId] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const session = await getCurrentSession()
        if (session?.user) {
          const profile = await getCurrentUserProfile(session.user.id)
          setCurrentUser(profile || { id: session.user.id, name: 'Người dùng', avatar_url: null })
        }
      } catch (e) {
        console.warn('Cannot fetch user for community post detail page:', e)
      }

      // Load post
      try {
        const { data, error } = await getPostById(id)
        if (!error && data) {
          const formattedPost = {
            id: data.id,
            author: data.profiles?.name || 'Ẩn danh',
            avatar: data.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${data.profiles?.name || 'U'}&background=c1d95c&color=fff`,
            time: new Date(data.published_at || data.created_at).toLocaleDateString('vi-VN'),
            role: data.profiles?.role === 'admin' ? 'Quản trị viên' : (data.profiles?.role === 'moderator' ? 'Điều hành viên' : 'Thành viên'),
            topic: data.type === 'community' ? 'Cộng đồng' : 'Mẹo tiết kiệm',
            category: 'Chia sẻ',
            title: data.title,
            excerpt: data.description || data.content?.substring(0, 150) + '...',
            image: data.image_url,
            likes: data.likes_count || 0,
            commentsCount: data.comments_count || 0,
            savedCount: data.saved_count || 0,
            shares: 0,
            isLiked: false,
            isSaved: false
          }
          setPost(formattedPost)
        }
      } catch (e) {
        console.error('Error fetching post:', e)
      }

      // Load comments
      try {
        const { getCommentsByPost } = await import('../../services/commentService')
        const { data: comments } = await getCommentsByPost(id)
        if (comments) {
          setCommentsByPost({ [id]: comments })
        }
      } catch (e) {
        console.error('Error fetching comments:', e)
      }

      setIsLoading(false)
    }
    loadData()
  }, [id])

  async function handleToggleComment(postId) {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null)
    } else {
      setActiveCommentPostId(postId)
      setActiveSharePostId(null)
    }
  }

  function handleToggleShare(postId) {
    setActiveSharePostId(prev => prev === postId ? null : postId)
    setActiveCommentPostId(null)
  }

  async function handleAddComment(postId, content) {
    if (!currentUser) return false
    
    // Call Supabase
    const { createComment } = await import('../../services/commentService')
    const { data, error } = await createComment(postId, content)

    if (error || !data) {
      return false
    }

    // Update local state
    setCommentsByPost(prev => {
      const existing = prev[postId] || []
      return {
        ...prev,
        [postId]: [data, ...existing]
      }
    })
    
    setPost(current => {
      if (!current) return current
      return { ...current, commentsCount: current.commentsCount + 1 }
    })

    return true
  }

  function handleToggleLike() {
    setPost(current => {
      if (!current) return current
      return {
        ...current,
        isLiked: !current.isLiked,
        likes: current.isLiked ? current.likes - 1 : current.likes + 1,
      }
    })
  }

  function handleToggleSave() {
    setPost(current => {
      if (!current) return current
      return {
        ...current,
        isSaved: !current.isSaved,
        savedCount: current.isSaved ? current.savedCount - 1 : current.savedCount + 1,
      }
    })
  }

  return (
    <div className="community-page">
      <div className="container" style={{ padding: '20px 0', maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/cong-dong" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4F8428', textDecoration: 'none', marginBottom: '24px', fontWeight: 'bold' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại Cộng đồng
        </Link>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải bài viết...</div>
        ) : !post ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Không tìm thấy bài viết!</div>
        ) : (
          <CommunityPostCard
            post={post}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSave}
            onToggleComment={handleToggleComment}
            onToggleShare={handleToggleShare}
            onAddComment={handleAddComment}
            isCommentActive={activeCommentPostId === post.id}
            isShareActive={activeSharePostId === post.id}
            postComments={commentsByPost[post.id]}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  )
}

export default CommunityPostDetailPage
