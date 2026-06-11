import { Link } from 'react-router-dom'

function PostComposer() {
  return (
    <section className="community-composer">
      <div className="community-composer__top">
        <img
          className="community-composer__avatar"
          src='/images/fallback-green.jpg'
          alt="Avatar người dùng"
        />

        <Link className="community-composer__prompt" to="/dang-bai" style={{ textDecoration: 'none' }}>
          Bạn muốn chia sẻ mẹo tiết kiệm điện nào?
        </Link>

        <Link className="btn btn--primary community-composer__button" to="/dang-bai" data-testid="community-write-post-button">
          Viết bài chia sẻ
        </Link>
      </div>

      <div className="community-composer__actions">
        <Link to="/dang-bai" style={{ textDecoration: 'none', color: 'inherit' }}>Ảnh</Link>
        <Link to="/dang-bai" style={{ textDecoration: 'none', color: 'inherit' }}>Chủ đề</Link>
        <Link to="/dang-bai" style={{ textDecoration: 'none', color: 'inherit' }}>Mẹo nhanh</Link>
      </div>
    </section>
  )
}

export default PostComposer
