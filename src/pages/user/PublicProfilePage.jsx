import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import SEO from '../../components/SEO'
import AvatarLightbox from '../../components/common/AvatarLightbox'
import UserAvatar from '../../components/common/UserAvatar'
import UserBadges from '../../components/account/UserBadges'

import { getCurrentSession } from '../../services/authService'
import { followUser, unfollowUser, isFollowing, getFollowStats } from '../../services/followService'
import { getPublicPostsByUser } from '../../services/postService'
import { DEFAULT_USER_PREFERENCES, normalizeUserPreferences } from '../../services/profileService'
import OptimizedImage from '../../components/common/OptimizedImage'
import MyPostsList from '../../components/account/MyPostsList'
import Toast from '../../components/common/Toast'
import '../../styles/public-profile.css'
import '../../styles/profile-cover.css'

function PublicProfilePage() {
  const { userId } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMorePosts, setHasMorePosts] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [accessState, setAccessState] = useState('allowed')
  
  const [currentUser, setCurrentUser] = useState(null)
  const [followingStatus, setFollowingStatus] = useState(false)
  const [followStats, setFollowStats] = useState({ followersCount: 0, followingCount: 0 })
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  

  const [isAvatarOpen, setIsAvatarOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    let isMounted = true

    async function fetchData() {
      // Get current logged in user
      const session = await getCurrentSession()
      if (isMounted && session?.user) {
        setCurrentUser(session.user)
      }

      // Get profile info (safe fields)
      const { getPublicProfile } = await import('../../services/profileService')
      const { data: profileData, error: profileError } = await getPublicProfile(userId)

      if (profileError || !profileData) {
        console.error('[PublicProfilePage] Profile not found:', {
          userIdReceived: userId,
          queryField: 'id',
          tableName: 'public_profiles',
          error: profileError?.message || profileError
        })
        if (isMounted) {
          setProfile(null)
          setLoading(false)
        }
        return
      }

      const preferences = normalizeUserPreferences({
        profile_visibility: profileData?.profile_visibility,
        show_facebook: profileData?.show_facebook,
        show_public_posts: profileData?.show_public_posts,
        allow_search_index: profileData?.allow_search_index,
      })
      const resolvedProfile = {
        ...profileData,
        cover_url: profileData?.cover_url || '',
        facebook_url: profileData?.facebook_url || '',
        website_url: profileData?.website_url || '',
      }

      let nextAccessState = 'allowed'
      if (preferences.profile_visibility === 'private' && session?.user?.id !== userId) {
        nextAccessState = 'private'
      } else if (preferences.profile_visibility === 'authenticated' && !session?.user) {
        nextAccessState = 'authenticated'
      }

      let postsData = []
      let hasMore = false
      if (nextAccessState === 'allowed' && preferences.show_public_posts) {
        const postsResult = await getPublicPostsByUser(userId, 1, 10)
        postsData = postsResult.data || []
        hasMore = postsResult.hasMore || false
      }
      
      // Get follow stats
      const stats = await getFollowStats(userId)
      
      // Check if current user is following this profile
      if (session?.user && session.user.id !== userId) {
        const followingRes = await isFollowing(userId)
        if (isMounted) setFollowingStatus(followingRes.data)
      }

      if (isMounted) {
        setProfile({
          ...resolvedProfile,
          profile_visibility: preferences.profile_visibility,
          show_facebook: preferences.show_facebook,
          show_public_posts: preferences.show_public_posts,
          allow_search_index: preferences.allow_search_index,
        })
        setAccessState(nextAccessState)
        if (postsData) {
          setPosts(postsData)
          setHasMorePosts(hasMore)
        }
        setPostsLoading(false)
        setFollowStats(stats)
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [userId])

  const handleLoadMorePosts = async () => {
    if (isLoadingMore || !hasMorePosts) return
    setIsLoadingMore(true)
    const nextPage = page + 1
    
    const postsResult = await getPublicPostsByUser(userId, nextPage, 10)
    if (postsResult.data) {
      setPosts(prev => [...prev, ...postsResult.data])
      setHasMorePosts(postsResult.hasMore)
      setPage(nextPage)
    }
    
    setIsLoadingMore(false)
  }

  const handleFollowToggle = async () => {
    if (!currentUser) {
      setToast('Bạn cần đăng nhập để sử dụng tính năng này.')
      return
    }

    if (currentUser.id === userId) return // cannot follow self
    
    setIsFollowLoading(true)
    
    if (followingStatus) {
      // Unfollow
      const { data, error } = await unfollowUser(userId)
      if (!error) {
        setFollowingStatus(false)
        if (!data?.already_unfollowed) {
          setFollowStats(prev => ({ ...prev, followersCount: Math.max(0, prev.followersCount - 1) }))
        }
        setToast('Đã bỏ theo dõi')
      } else {
        setToast(error.message || 'Không thể hủy theo dõi')
      }
    } else {
      // Follow
      const { data, error } = await followUser(userId)
      if (!error) {
        setFollowingStatus(true)
        if (!data?.already_followed) {
          setFollowStats(prev => ({ ...prev, followersCount: prev.followersCount + 1 }))
        }
        setToast('Đã theo dõi')
      } else {
        setToast(error.message || 'Không thể theo dõi')
      }
    }
    
    setIsFollowLoading(false)
  }

  if (loading) {
    return <div className="shell" style={{ padding: '40px 0', textAlign: 'center' }}>Đang tải hồ sơ...</div>
  }

  if (!profile) {
    return (
      <div className="shell" style={{ padding: '40px 0', textAlign: 'center' }}>
        <h2>Không tìm thấy người dùng</h2>
        <p>Hồ sơ này không tồn tại hoặc đã bị xóa.</p>
        <Link to="/" className="btn btn--primary" style={{ marginTop: '16px' }}>Về trang chủ</Link>
      </div>
    )
  }

  const isSelf = currentUser?.id === userId
  const joinDate = new Date(profile.created_at).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })
  const displayName = profile.name || 'Thành viên E-XANH'
  const preferences = normalizeUserPreferences({
    ...DEFAULT_USER_PREFERENCES,
    profile_visibility: profile.profile_visibility,
    show_facebook: profile.show_facebook,
    show_public_posts: profile.show_public_posts,
    allow_search_index: profile.allow_search_index,
  })
  const canShowFacebook = preferences.show_facebook && Boolean(profile.facebook_url)
  const canShowPosts = preferences.show_public_posts

  if (accessState !== 'allowed' && !isSelf) {
    return (
      <>
        <SEO title={displayName} description={profile.bio || 'Thành viên E-XANH yêu thích sống xanh.'} />

        <div className="shell" style={{ padding: '40px 0', textAlign: 'center' }}>
          <h2>Hồ sơ này đang được giới hạn quyền xem</h2>
          <p>
            {accessState === 'authenticated'
              ? 'Chủ hồ sơ chỉ cho phép người dùng đã đăng nhập xem trang cá nhân này.'
              : 'Chủ hồ sơ hiện chỉ cho phép chính họ xem trang cá nhân công khai.'}
          </p>
          {!currentUser ? (
            <Link to="/dang-nhap" className="btn btn--primary" style={{ marginTop: '16px' }}>
              Đăng nhập để tiếp tục
            </Link>
          ) : null}
        </div>
      </>
    )
  }

  return (
    <>
      <SEO title={displayName} description={profile.bio || 'Thành viên E-XANH yêu thích sống xanh.'} />

      <div className="shell shell--wide public-profile-page">
        <div className="profile-card">
          <div className="profile-cover">
            {profile.cover_url && (
              <OptimizedImage src={profile.cover_url} alt={`Ảnh bìa của ${displayName}`} ratio="auto" />
            )}
          </div>
          
          <div className="profile-body">
            <div className="profile-identity-row">
              <div className="profile-identity-left">
                <UserAvatar
                  src={profile.avatar_url}
                  name={displayName}
                  size="profile"
                  withFrame={false}
                  clickable
                  className="profile-avatar"
                  onClick={() => setIsAvatarOpen(true)}
                />
                
                <div className="profile-text">
                  <h1 className="profile-name">{displayName}</h1>
                  <p className="profile-bio">{profile.bio || 'Thành viên E-XANH yêu thích sống xanh.'}</p>

                  <div className="profile-meta">
                    {profile.area && (
                      <span className="profile-meta-item">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{profile.area}</span>
                      </span>
                    )}
                    {canShowFacebook && (
                      <span className="profile-meta-item">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                        <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                          Facebook
                        </a>
                      </span>
                    )}
                    <span className="profile-meta-item">
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>Tham gia từ {joinDate}</span>
                    </span>
                  </div>
                  <UserBadges profile={profile} />
                </div>
              </div>

              <div className="profile-actions">
                {isSelf ? (
                  <Link to="/tai-khoan/cai-dat" className="btn btn--secondary">
                    Chỉnh sửa hồ sơ
                  </Link>
                ) : (
                  <button
                    onClick={handleFollowToggle}
                    disabled={isFollowLoading}
                    className={`btn ${followingStatus ? 'btn--secondary' : 'btn--primary'}`}
                  >
                    {isFollowLoading ? 'Đang xử lý...' : (followingStatus ? 'Đang theo dõi' : 'Theo dõi')}
                  </button>
                )}
              </div>
            </div>

            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-value">{profile.points || 0}</span>
                <span className="profile-stat-label">Điểm Xanh</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{canShowPosts ? posts.length : 0}</span>
                <span className="profile-stat-label">Bài viết</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{followStats.followersCount}</span>
                <span className="profile-stat-label">Người theo dõi</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{followStats.followingCount}</span>
                <span className="profile-stat-label">Đang theo dõi</span>
              </div>
            </div>
          </div>
        </div>


        <div className="public-profile-content">
            <div className="public-profile-posts">
              {!canShowPosts ? (
                <div className="public-profile-empty">
                  <h3>Chủ hồ sơ đang ẩn danh sách bài viết</h3>
                  <p>Cài đặt quyền riêng tư hiện không cho hiển thị bài viết công khai trên trang cá nhân.</p>
                </div>
              ) : posts.length > 0 ? (
                <MyPostsList 
                  posts={posts} 
                  isPublicView={true} 
                  loading={postsLoading} 
                  hasMore={hasMorePosts}
                  onLoadMore={handleLoadMorePosts}
                  isLoadingMore={isLoadingMore}
                />
              ) : (
                <div className="public-profile-empty">
                  <h3>Chưa có bài viết</h3>
                  <p>Người dùng này chưa có bài viết công khai nào.</p>
                </div>
              )}
            </div>
        </div>
      </div>

      <AvatarLightbox
        open={isAvatarOpen}
        onClose={() => setIsAvatarOpen(false)}
        src={profile.avatar_url}
        name={displayName}
      />

      <Toast message={toast} onClose={() => setToast('')} />
    </>
  )
}

export default PublicProfilePage
