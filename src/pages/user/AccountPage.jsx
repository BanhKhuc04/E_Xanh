import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ProfileHeader from '../../components/account/ProfileHeader'
import ProfileStats from '../../components/account/ProfileStats'
import MyPostsList from '../../components/account/MyPostsList'
import RecentSavedPosts from '../../components/account/RecentSavedPosts'
import RecentComments from '../../components/account/RecentComments'
import AccountInfoCard from '../../components/account/AccountInfoCard'
import AccountSettingsCard from '../../components/account/AccountSettingsCard'
import RecentElectricityHistoryCard from '../../components/account/RecentElectricityHistoryCard'
import EditProfileModal from '../../components/account/EditProfileModal'
import ChangePasswordModal from '../../components/account/ChangePasswordModal'
import { savedPosts } from '../../data/posts'
import { formatCurrency, formatHistoryDate, formatKwh } from '../../data/electricity'
import { getElectricityHistories } from '../../utils/electricityStorage'
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
  const [recentHistory, setRecentHistory] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadUser(session) {
      if (!session?.user) {
        if (isMounted) {
          setCurrentUser(null)
          setLoading(false)
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
          role: profile?.role || 'user',
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
        const { getMyElectricityChecks } = await import('../../services/electricityService')
        const { data } = await getMyElectricityChecks()
        if (data && isMounted) {
          const formatted = data.map(dbItem => ({
            id: dbItem.id,
            checkedAt: dbItem.checked_at,
            deviceCount: dbItem.items?.length || 0,
            totalKwh: Number(dbItem.total_kwh),
            estimatedCost: Number(dbItem.estimated_cost),
            highestDevice: dbItem.highest_device,
            savingPercent: dbItem.saving_percent,
          }))
          setRecentHistory(formatted.slice(0, 3))
        } else if (isMounted) {
          setRecentHistory(getElectricityHistories().slice(0, 3))
        }
      } else if (isMounted) {
        setRecentHistory(getElectricityHistories().slice(0, 3))
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
    <div className="account-page">
      <div className="account-page__breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span>{'>'}</span>
        <span>Tài khoản của tôi</span>
      </div>

      <ProfileHeader 
        user={currentUser} 
        onLogout={handleLogout} 
        onEditClick={() => setIsEditModalOpen(true)}
        onPasswordClick={() => setIsPasswordModalOpen(true)}
      />
      <ProfileStats stats={profileStats} />

      <div className="account-layout">
        <div className="account-layout__main">
          <MyPostsList posts={myPosts} />
          <RecentSavedPosts posts={savedPosts.slice(0, 3)} />
          <RecentComments comments={recentComments} />
        </div>

        <div className="account-layout__side">
          <AccountInfoCard user={currentUser} />
          <RecentElectricityHistoryCard
            histories={recentHistory}
            formatCurrency={formatCurrency}
            formatHistoryDate={formatHistoryDate}
            formatKwh={formatKwh}
          />
          <AccountSettingsCard />

          <section className="account-side-card account-side-card--tips">
            <h2>Gợi ý dành cho bạn</h2>
            <p>
              Bạn thường kiểm tra thiết bị điều hòa. Hãy xem thêm mẹo tiết kiệm điện khi dùng điều hòa.
            </p>
            <p>
              Bạn đã lưu nhiều bài về laptop. Có thể bạn quan tâm đến chủ đề sạc pin đúng cách.
            </p>
          </section>
        </div>
      </div>

      {isEditModalOpen && (
        <EditProfileModal 
          user={currentUser} 
          onClose={() => setIsEditModalOpen(false)} 
          onSuccess={() => {
            setIsEditModalOpen(false)
            alert('Cập nhật hồ sơ thành công!')
          }} 
        />
      )}

      {isPasswordModalOpen && (
        <ChangePasswordModal 
          onClose={() => setIsPasswordModalOpen(false)} 
          onSuccess={() => {
            setIsPasswordModalOpen(false)
            alert('Đổi mật khẩu thành công!')
          }} 
        />
      )}
    </div>
  )
}

export default AccountPage
