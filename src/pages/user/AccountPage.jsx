import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import ProfileHeader from '../../components/account/ProfileHeader'
import ProfileStats from '../../components/account/ProfileStats'
import MyPostsList from '../../components/account/MyPostsList'
import RecentSavedPosts from '../../components/account/RecentSavedPosts'
import RecentComments from '../../components/account/RecentComments'
import AccountInfoCard from '../../components/account/AccountInfoCard'
import { savedPosts } from '../../data/mock/posts'
import {
  getCurrentSession,
  getCurrentUserProfile,
  onAuthStateChange,
  signOut,
} from '../../services/authService'
import '../../styles/account.css'

const profileStats = [
  { label: 'Bài đã đăng', value: 8 },
  { label: 'Bài đã lưu', value: 12 },
  { label: 'Bình luận', value: 24 },
  { label: 'Lần kiểm tra điện', value: 5 },
]

const myPosts = [
  {
    title: '5 cách dùng điều hòa tiết kiệm điện mùa nóng',
    status: 'Đã duyệt',
    likes: 124,
    comments: 28,
  },
  {
    title: 'Có nên rút sạc laptop khi pin đầy?',
    status: 'Chờ duyệt',
    likes: 0,
    comments: 0,
  },
  {
    title: 'Checklist 30 giây trước khi rời phòng',
    status: 'Đã duyệt',
    likes: 302,
    comments: 45,
  },
]

const recentComments = [
  {
    id: 'account-comment-1',
    content: 'Bài viết rất hữu ích, tôi đã áp dụng cách này và thấy tháng rồi giảm được 50k tiền điện.',
    postTitle: 'Cách làm sạch lưới lọc điều hòa tại nhà',
    time: '2 giờ trước',
  },
  {
    id: 'account-comment-2',
    content: 'Cho mình hỏi mua bóng LED loại nào thì tốt cho mắt mà vẫn tiết kiệm vậy ạ?',
    postTitle: 'So sánh bóng đèn LED và huỳnh quang',
    time: 'Hôm qua',
  },
  {
    id: 'account-comment-3',
    content: 'Cảm ơn bạn đã chia sẻ tips hay!',
    postTitle: 'Mẹo sắp xếp tủ lạnh giúp giảm 20% điện năng',
    time: '2 ngày trước',
  },
]

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

function AccountPage() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [myPostsData, setMyPostsData] = useState([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [savedPostsData, setSavedPostsData] = useState([])
  const [recentCommentsData, setRecentCommentsData] = useState([])

  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`
  const OG_IMAGE = 'https://e-xanh.vercel.app/og-image-v2.png'

  useEffect(() => {
    let isMounted = true

    async function loadUser(session) {
      if (!session?.user) {
        if (isMounted) {
          setCurrentUser(null)
          setLoading(false)
          setPostsLoading(false)
        }
        return
      }
      const profile = await getCurrentUserProfile(session.user.id)
      if (isMounted) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          name: profile?.name || session.user.email.split('@')[0],
          avatar: getAvatar(profile?.name, session.user.email, profile?.avatar_url),
          avatar_url: profile?.avatar_url || '',
          cover_url: profile?.cover_url || '',
          facebook_url: profile?.facebook_url || '',
          role: profile?.role || 'user',
          status: profile?.status || 'active',
          bio: profile?.bio,
          created_at: profile?.created_at,
        })
        setLoading(false)
      }
    }

    async function initAuth() {
      const session = await getCurrentSession()
      loadUser(session)
      
      if (session?.user) {

        const { getMyPosts } = await import('../../services/postService')
        const { getMySavedPosts } = await import('../../services/interactionService')
        const { getMyComments } = await import('../../services/commentService')

        const [myPostsRes, savedRes, commentsRes] = await Promise.all([
          getMyPosts(session.user.id),
          getMySavedPosts(),
          getMyComments(session.user.id)
        ])

        if (isMounted) {
          if (myPostsRes.data) setMyPostsData(myPostsRes.data)
          if (savedRes.data) setSavedPostsData(savedRes.data)
          if (commentsRes.data) setRecentCommentsData(commentsRes.data)
          setPostsLoading(false)
        }
      }
    }

    initAuth()

    const subscription = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        loadUser(session)
      }
    })

    const handleProfileUpdate = () => {
      getCurrentSession().then(loadUser)
    }
    window.addEventListener('profileUpdated', handleProfileUpdate)

    return () => {
      isMounted = false
      subscription?.unsubscribe?.()
      window.removeEventListener('profileUpdated', handleProfileUpdate)
    }
  }, [])

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  if (loading) {
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
      <Helmet>
        <title>Tài khoản cá nhân - E-XANH</title>
        <meta
          name="description"
          content="Quản lý thông tin tài khoản, xem lại các bài viết đã lưu, lịch sử tra cứu điện và các hoạt động khác của bạn trên E-XANH."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Tài khoản cá nhân - E-XANH" />
        <meta
          property="og:description"
          content="Quản lý thông tin tài khoản, xem lại các bài viết đã lưu, lịch sử tra cứu điện và các hoạt động khác của bạn trên E-XANH."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Helmet>

      <div className="account-page">
        <div className="account-page__breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>{'>'}</span>
          <span>Tài khoản của tôi</span>
        </div>

        <ProfileHeader 
          user={currentUser} 
          onLogout={handleLogout} 
        />
        <ProfileStats stats={[
          { label: 'Bài đã đăng', value: myPostsData.length },
          { label: 'Bài đã lưu', value: savedPostsData.length },
          { label: 'Bình luận', value: recentCommentsData.length },
        ]} />

        <div className="account-layout">
          <div className="account-layout__main">
            <MyPostsList posts={myPostsData} loading={postsLoading} />
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
