import { Link } from 'react-router-dom'

function PostComposer() {
  return (
    <section className="community-composer">
      <div className="community-composer__top">
        <img
          className="community-composer__avatar"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgGqptEc6hx0B_i3nnODz0Ggz6jQRYWkjnoguyaHQDFCRKkx8LXdWrcVItikcTBES7RhJCFADJN1k7EQ8vtA89flWlrMJfVy9uen6LajunIUVpbwQ3EE1qMngoigbUV2vL2-LZzdWDkhV96lVGAMuSXccTvTsn2qaQ9sJ-imI2sZ2tKPysK5Aud8uyEs6leCl_sMdBT5lFx9BtHG4DpoX-OdWPv5-hS3_FAz_efeE5f5o-wq7SUcf38232HxIrawlN1gR-EFY1TjJO"
          alt="Avatar người dùng"
        />

        <div className="community-composer__prompt">
          Bạn muốn chia sẻ mẹo tiết kiệm điện nào?
        </div>

        <Link className="btn btn--primary community-composer__button" to="/dang-bai">
          Viết bài chia sẻ
        </Link>
      </div>

      <div className="community-composer__actions">
        <span>Anh</span>
        <span>Chủ đề</span>
        <span>Mẹo nhanh</span>
      </div>
    </section>
  )
}

export default PostComposer
