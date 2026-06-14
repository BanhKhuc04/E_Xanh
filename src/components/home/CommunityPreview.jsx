import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function CommunityPreview() {
  const [posts, setPosts] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [membersLoading, setMembersLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { getRecentCommunityPosts, getTopActiveMembers } = await import('../../services/postService')
        const [postsRes, membersRes] = await Promise.all([
          getRecentCommunityPosts(3),
          getTopActiveMembers(3)
        ])
        
        if (postsRes.error) throw postsRes.error
        if (postsRes.data) setPosts(postsRes.data)

        if (membersRes.data) setMembers(membersRes.data)
      } catch (err) {
        console.error('Lỗi lấy dữ liệu cộng đồng:', err)
      } finally {
        setLoading(false)
        setMembersLoading(false)
      }
    }
    load()
  }, [])

  function getInitials(name) {
    if (!name) return 'U'
    return name.charAt(0).toUpperCase()
  }

  function getTimeAgo(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)
    if (diff < 60) return 'Vừa xong'
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`
    return date.toLocaleDateString('vi-VN')
  }

  return (
    <section className="home-section">
      <div className="community-preview">
        <div className="community-preview__feed">
          <div className="home-section__header home-section__header--stacked">
            <div>
              <h2>Hoạt động cộng đồng</h2>
              <p>Nơi trao đổi, chia sẻ và thảo luận về các vấn đề tiết kiệm năng lượng</p>
            </div>
          </div>

          <div className="community-preview__posts">
            {loading ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '20px' }}>Đang tải hoạt động cộng đồng...</p>
            ) : posts.length === 0 ? (
              <div style={{
                textAlign: 'center', 
                padding: '40px 20px', 
                background: 'rgba(234, 245, 157, 0.3)', 
                borderRadius: '24px',
                border: '1px dashed rgba(79, 132, 40, 0.3)',
                margin: '20px 0'
              }}>
                <svg viewBox="0 0 24 24" style={{ width: '48px', height: '48px', margin: '0 auto 12px', fill: 'none', stroke: 'var(--color-primary-500)', strokeWidth: 1.5 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <h3 style={{ color: 'var(--color-primary-500)', fontSize: '1.2rem', margin: '0 0 8px' }}>Chưa có hoạt động cộng đồng</h3>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Các bài viết được duyệt sẽ xuất hiện tại đây.</p>
              </div>
            ) : (
              posts.map((post) => {
                const authorName = post.profiles?.name || 'Ẩn danh'
                return (
                  <article key={post.id} className="community-preview__post">
                    <div className="community-preview__post-top">
                      <div className="community-preview__author">
                        {post.profiles?.avatar_url ? (
                          <img src={post.profiles.avatar_url} alt={authorName} className="home-avatar" style={{ objectFit: 'cover' }} />
                        ) : (
                          <span className="home-avatar home-avatar--primary">
                            {getInitials(authorName)}
                          </span>
                        )}
                        <div>
                          <strong>{authorName}</strong>
                          <span>{getTimeAgo(post.created_at)}</span>
                        </div>
                      </div>

                      <span className="community-preview__pill">Chia sẻ</span>
                    </div>

                    <p>{post.description || post.content?.substring(0, 150) + '...'}</p>

                    <div className="community-preview__actions">
                      <span>{post.likes_count || 0} thích</span>
                      <span>{post.comments_count || 0} bình luận</span>
                      <span>Lưu bài</span>
                    </div>
                  </article>
                )
              })
            )}
          </div>

          <Link className="btn community-preview__button" to="/cong-dong">
            Xem cộng đồng
          </Link>
        </div>

        <aside className="community-preview__sidebar">
          <section className="community-preview__members">
            <h3>Thành viên tích cực</h3>
            {membersLoading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Đang tải...</div>
            ) : members.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)', background: '#f8fdf5', borderRadius: '16px', marginTop: '16px' }}>
                Chưa có dữ liệu thành viên tích cực.
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {members.map((member, index) => {
                  let rankClass = 'community-preview__rank--default'
                  if (index === 0) rankClass = 'community-preview__rank--1'
                  else if (index === 1) rankClass = 'community-preview__rank--2'
                  else if (index === 2) rankClass = 'community-preview__rank--3'
                  
                  return (
                    <li key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`community-preview__rank ${rankClass}`} style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        {index + 1}
                      </span>
                      {member.avatar_url ? (
                        <img src={member.avatar_url} alt={member.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-100)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                          {getInitials(member.name)}
                        </span>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ fontSize: '0.95rem' }}>{member.name}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{member.approved_posts_count} bài viết</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <section className="community-preview__cta">
            <h3>Có kinh nghiệm hay?</h3>
            <p>Chia sẻ mẹo tiết kiệm điện của bạn để giúp nhiều người hơn.</p>
            <Link className="btn btn--light" to="/dang-bai" state={{ defaultType: 'community' }}>
              Đăng bài ngay
            </Link>
          </section>
        </aside>
      </div>
    </section>
  )
}

export default CommunityPreview
