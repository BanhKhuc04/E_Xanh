/* eslint-disable react-hooks/set-state-in-effect */
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import SEO from '../../components/SEO'
import ProfileHeader from '../../components/account/ProfileHeader'
import MyPostsList from '../../components/account/MyPostsList'
import RecentSavedPosts from '../../components/account/RecentSavedPosts'
import RecentComments from '../../components/account/RecentComments'
import AccountInfoCard from '../../components/account/AccountInfoCard'
import { 
  signOut
} from '../../services/authService'
import { useAuth } from '../../contexts/AuthContext'
import '../../styles/account.css'

function getAvatar(name, email, avatarUrl) {
  if (avatarUrl) return avatarUrl
  if (name) {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  if (email) return email.split('@')[0].slice(0, 2).toUpperCase()
  return 'EX'
}

const AccountPage = () => {
  const navigate = useNavigate()
  const [myPostsData, setMyPostsData] = useState([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [myPostsPage, setMyPostsPage] = useState(1)
  const [hasMoreMyPosts, setHasMoreMyPosts] = useState(false)
  const [isLoadingMoreMyPosts, setIsLoadingMoreMyPosts] = useState(false)
  const [savedPostsData, setSavedPostsData] = useState([])
  const [recentCommentsData, setRecentCommentsData] = useState([])
  const [postsError, setPostsError] = useState('')

  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`
  const OG_IMAGE = 'https://e-xanh.vercel.app/og-image-v2.png'

  const { user: authUser, profile: authProfile, loading: authLoading } = useAuth()
  
  const currentUser = useMemo(() => {
    if (!authUser) return null
    return {
      id: authUser.id,
      email: authUser.email,
      name: authProfile?.name || authUser.email.split('@')[0],
      avatar: getAvatar(authProfile?.name, authUser.email, authProfile?.avatar_url),
      avatar_url: authProfile?.avatar_url || '',
      cover_url: authProfile?.cover_url || '',
      facebook_url: authProfile?.facebook_url || '',
      role: authProfile?.role || 'user',
      status: authProfile?.status || 'active',
      bio: authProfile?.bio,
      created_at: authProfile?.created_at,
    }
  }, [authUser, authProfile])

  useEffect(() => {
    let isMounted = true

    if (authLoading) return

    if (!authUser) {
      if (isMounted) {
        setPostsLoading(false)
      }
      return
    }

    async function loadData() {
      const { getMyPosts } = await import('../../services/postService')
      const { getMySavedPosts } = await import('../../services/interactionService')
      const { getMyComments } = await import('../../services/commentService')

      const [myPostsRes, savedRes, commentsRes] = await Promise.all([
        getMyPosts(authUser.id, 1, 10),
        getMySavedPosts(1, 10),
        getMyComments(authUser.id)
      ])

      if (isMounted) {
        if (myPostsRes.error || savedRes.error || commentsRes.error) {
           setPostsError('Không thể tải một số dữ liệu cá nhân. Vui lòng thử lại sau.')
        }
        if (myPostsRes.data) {
          setMyPostsData(myPostsRes.data)
          setHasMoreMyPosts(myPostsRes.hasMore)
        }
        if (savedRes.data) setSavedPostsData(savedRes.data)
        if (commentsRes.data) setRecentCommentsData(commentsRes.data)
        setPostsLoading(false)
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [authUser, authProfile, authLoading])

  const handleLoadMoreMyPosts = async () => {
    if (isLoadingMoreMyPosts || !hasMoreMyPosts) return
    setIsLoadingMoreMyPosts(true)
    const { getMyPosts } = await import('../../services/postService')
    const nextPage = myPostsPage + 1
    const { data, hasMore } = await getMyPosts(authUser.id, nextPage, 10)
    if (data) {
      setMyPostsData(prev => [...prev, ...data])
      setHasMoreMyPosts(hasMore)
      setMyPostsPage(nextPage)
    }
    setIsLoadingMoreMyPosts(false)
  }

  const [logoutError, setLogoutError] = useState('')

  async function handleLogout() {
    setLogoutError('')
    const { error } = await signOut()
    if (error) {
      setLogoutError('Đăng xuất thất bại. Vui lòng thử lại.')
    } else {
      navigate('/')
    }
  }

  if (authLoading) {
    return <div className="account-page"><div className="shell" style={{ padding: '40px 0', textAlign: 'center' }}>Đang tải...</div></div>
  }

  if (!currentUser) {
    return (
      <div className="account-page account-page--guest">
        <section className="account-guest-card">
          <h1>Bạn cần đăng nhập để xem tài khoản.</h1>
          <p>Đăng nhập để xem bài đã lưu, lịch sử kiểm tra điện và quản lý hoạt động cá nhân của bạn.</p>
          <div className="account-guest-card__actions">
            <Link className="btn btn--primary" to="/dang-nhap">
              Đăng nhập
            </Link>
            <Link className="btn btn--secondary" to="/dang-ky">
              Tạo tài khoản
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <>
      <SEO title="Tài khoản cá nhân" noIndex={true} />

      <div className="account-page">
        <div className="account-page__breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>{'>'}</span>
          <span>Tài khoản của tôi</span>
        </div>

        <ProfileHeader 
          user={currentUser} 
          onLogout={handleLogout} 
          stats={[
            { label: 'Bài đã đăng', value: myPostsData.length },
            { label: 'Bài đã lưu', value: savedPostsData.length },
            { label: 'Bình luận', value: recentCommentsData.length },
          ]}
        />

        <div className="account-layout">
          <div className="account-layout__main">
            {postsError && (
              <div className="admin-alert admin-alert--error" style={{ marginBottom: '24px' }}>
                {postsError}
              </div>
            )}
            {logoutError && (
              <div className="admin-alert admin-alert--error" style={{ marginBottom: '24px' }}>
                {logoutError}
              </div>
            )}
            <MyPostsList 
              posts={myPostsData} 
              loading={postsLoading} 
              hasMore={hasMoreMyPosts}
              onLoadMore={handleLoadMoreMyPosts}
              isLoadingMore={isLoadingMoreMyPosts}
            />
            <RecentSavedPosts posts={savedPostsData.slice(0, 3)} />
            <RecentComments comments={recentCommentsData.slice(0, 3)} />
          </div>

          <div className="account-layout__side">
            <AccountInfoCard user={currentUser} />
            {myPostsData.length > 0 || savedPostsData.length > 0 ? (
              <section className="account-side-card account-side-card--tips">
                <h2>Gợi ý dành cho bạn</h2>
                {myPostsData.some(p => p.type === 'tip' || p.category?.includes('Điều hòa')) || savedPostsData.some(p => p.category?.includes('Điều hòa')) ? (
                  <p>Bạn thường quan tâm đến thiết bị điều hòa. Hãy xem thêm các mẹo tiết kiệm điện khi dùng điều hòa trong mục Mẹo tiết kiệm.</p>
                ) : null}
                {savedPostsData.some(p => p.category?.includes('Laptop')) ? (
                  <p>Bạn đã lưu bài viết về laptop. Có thể bạn quan tâm đến chủ đề sạc pin và bảo vệ thiết bị.</p>
                ) : null}
                {!myPostsData.some(p => p.type === 'tip' || p.category?.includes('Điều hòa')) && !savedPostsData.some(p => p.category?.includes('Điều hòa')) && !savedPostsData.some(p => p.category?.includes('Laptop')) ? (
                  <p>Hãy tiếp tục khám phá các bài viết và lưu lại các mẹo hữu ích để nhận được gợi ý cá nhân hóa.</p>
                ) : null}
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default AccountPage
