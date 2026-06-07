import { Link, useParams } from 'react-router-dom'
import ArticleActions from '../../components/posts/ArticleActions'
import ArticleContent from '../../components/posts/ArticleContent'
import ArticleHeader from '../../components/posts/ArticleHeader'
import CommentSection from '../../components/posts/CommentSection'
import PostCard from '../../components/posts/PostCard'
import RelatedPosts from '../../components/posts/RelatedPosts'
import { featuredTopics, getPostBySlug, posts } from '../../data/posts'
import '../../styles/post-detail.css'

function PostDetailPage() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <div className="post-detail-page">
        <section className="post-detail-empty">
          <span className="tips-hero__badge">Chi tiết bài viết</span>
          <h1>Không tìm thấy bài viết</h1>
          <p>Bài viết bạn đang tìm có thể đã bị xóa hoặc đường dẫn chưa chính xác.</p>
          <Link className="btn btn--primary" to="/meo-tiet-kiem">
            Quay lại mẹo tiết kiệm
          </Link>
        </section>
      </div>
    )
  }

  const relatedPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 3)
  const likedPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 3)

  return (
    <div className="post-detail-page">
      <nav className="post-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span>/</span>
        <Link to="/meo-tiet-kiem">Mẹo tiết kiệm</Link>
        <span>/</span>
        <span>Chi tiết bài viết</span>
      </nav>

      <div className="post-detail-layout">
        <article className="post-detail-main">
          <ArticleHeader post={post} />
          <ArticleContent post={post} />
          <ArticleActions />
          <CommentSection comments={post.commentItems.slice(0, 2)} />
        </article>

        <aside className="post-detail-sidebar">
          <section className="post-side-card post-side-card--author">
            <span className="post-side-card__author-avatar">{post.author.slice(0, 2).toUpperCase()}</span>
            <h2>{post.author}</h2>
            <p>{post.authorBio}</p>
            <button type="button">Theo dõi</button>
          </section>

          <RelatedPosts title="Bài viết liên quan" posts={relatedPosts} compact />

          <section className="post-side-card">
            <h2>Chủ đề nổi bật</h2>
            <div className="post-side-card__topics">
              {featuredTopics.map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </div>
          </section>

          <section className="post-side-card post-side-card--cta">
            <h2>Bạn có mẹo hay?</h2>
            <p>Chia sẻ kinh nghiệm tiết kiệm điện của bạn để lan tỏa lối sống xanh.</p>
            <Link className="btn btn--light" to="/cong-dong">
              Đăng bài chia sẻ
            </Link>
          </section>
        </aside>
      </div>

      <section className="post-detail-suggestions">
        <h2>Có thể bạn cũng thích</h2>
        <div className="post-detail-suggestions__grid">
          {likedPosts.map((item) => (
            <PostCard key={item.id} post={item} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default PostDetailPage
