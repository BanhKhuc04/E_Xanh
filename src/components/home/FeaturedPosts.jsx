import { Link } from 'react-router-dom'

function FeaturedPosts({ posts }) {
  return (
    <section className="home-section">
      <div className="home-section__header">
        <div>
          <h2>Bài viết nổi bật</h2>
          <p>Những mẹo hay được cộng đồng quan tâm nhất tuần qua</p>
        </div>

        <Link className="home-section__link" to="/meo-tiet-kiem">
          Xem tất cả
        </Link>
      </div>

      <div className="home-post-grid">
        {posts.map((post) => (
          <article key={post.title} className="home-post-card">
            <div className="home-post-card__media">
              <img src={post.image} alt={post.imageAlt} />
              <span className="home-post-card__tag">{post.category}</span>
              <button type="button" aria-label={`Lưu bài viết ${post.title}`}>
                Lưu
              </button>
            </div>

            <div className="home-post-card__body">
              <h3>{post.title}</h3>

              <div className="home-post-card__meta">
                <span className={`home-avatar home-avatar--${post.authorTone}`}>
                  {post.authorInitials}
                </span>
                <strong>{post.author}</strong>
                <span>{post.likes} lượt thích</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeaturedPosts
