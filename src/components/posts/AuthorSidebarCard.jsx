import { Link } from 'react-router-dom'
import '../../styles/author-sidebar-card.css'

function AuthorSidebarCard({ 
  authorId, 
  authorName, 
  authorAvatar, 
  authorBio, 
  authorRole,
  stats, 
  isFollowing, 
  onToggleFollow,
  actionLoading,
  isCurrentUser
}) {
  const defaultName = authorName || 'Thành viên'
  const fallbackInitial = defaultName.charAt(0).toUpperCase()
  
  const displayRole = authorRole === 'admin' ? 'Quản trị viên' 
    : authorRole === 'moderator' ? 'Điều hành viên' 
    : 'Thành viên E-XANH'

  return (
    <aside className="exanh-author-card">
      <div className="exanh-author-card__cover"></div>

      <div className="exanh-author-card__avatarWrap">
        {authorAvatar ? (
          <img src={authorAvatar} alt={defaultName} className="exanh-author-card__avatar" />
        ) : (
          <div className="exanh-author-card__avatar">{fallbackInitial}</div>
        )}
      </div>

      <div className="exanh-author-card__body">
        <h3 className="exanh-author-card__name">{defaultName}</h3>
        <span className="exanh-author-card__badge">{displayRole}</span>
        <p className="exanh-author-card__bio">{authorBio || 'Thành viên cộng đồng E-XANH'}</p>

        <div className="exanh-author-card__stats">
          <div>
            <strong>{stats?.posts || 0}</strong>
            <span>Bài viết</span>
          </div>
          <div>
            <strong>{stats?.likes || 0}</strong>
            <span>Lượt thích</span>
          </div>
          <div>
            <strong>{stats?.saves || 0}</strong>
            <span>Lượt lưu</span>
          </div>
        </div>

        <div className="exanh-author-card__actions">
          {!isCurrentUser && (
            <button 
              className={`exanh-author-card__follow ${isFollowing ? 'is-following' : ''}`}
              onClick={onToggleFollow}
              disabled={actionLoading}
            >
              {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
            </button>
          )}
          <Link to={`/nguoi-dung/${authorId}`} className="exanh-author-card__profile">
            {isCurrentUser ? 'Chỉnh sửa hồ sơ' : 'Xem trang cá nhân'}
          </Link>
        </div>
      </div>
    </aside>
  )
}

export default AuthorSidebarCard
