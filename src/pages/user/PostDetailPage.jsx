import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ArticleActions from '../../components/posts/ArticleActions'
import ArticleContent from '../../components/posts/ArticleContent'
import ArticleHeader from '../../components/posts/ArticleHeader'
import CommentSection from '../../components/posts/CommentSection'
import PostCard from '../../components/posts/PostCard'
import RelatedPosts from '../../components/posts/RelatedPosts'
import { featuredTopics, getPostBySlug as getMockPostBySlug, posts } from '../../data/posts'
import { getPostBySlug } from '../../services/postService'
import '../../styles/post-detail.css'

function PostDetailPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPost() {
      setLoading(true)
      const { data, error } = await getPostBySlug(slug)
      if (!error && data) {
        const categoryMap = {
          tip: 'Mẹo tiết kiệm',
          community: 'Cộng đồng',
          qa: 'Hỏi đáp',
          review: 'Review thiết bị'
        }

        setPost({
          id: data.id,
          title: data.title,
          slug: data.slug,
          author: data.profiles?.name || data.profiles?.email || 'Thành viên E-XANH',
          authorAvatar: data.profiles?.avatar_url || 'EX',
          authorBio: data.profiles?.bio || 'Thành viên cộng đồng E-XANH',
          category: categoryMap[data.type] || 'Cộng đồng',
          status: 'published',
          image: data.image_url,
          description: data.description || '',
          content: data.content || '',
          contentSections: [
            {
              heading: 'Nội dung bài viết',
              body: data.content || ''
            }
          ],
          likes: data.likes_count || 0,
          comments: data.comments_count || 0,
          savedCount: data.saved_count || 0,
          readTime: data.read_time || '3 phút',
          date: new Date(data.created_at).toISOString().split('T')[0],
          commentItems: [],
        })
      } else {
        const localPost = getMockPostBySlug(slug)
        setPost(localPost || null)
      }
      setLoading(false)
    }
    loadPost()
  }, [slug])

  if (loading) {
    return <div className="post-detail-page"><div className="shell" style={{ padding: '40px 0', textAlign: 'center' }}>Đang tải...</div></div>
  }

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
          <ArticleActions post={post} />
          <CommentSection post={post} comments={post.commentItems.slice(0, 2)} />
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
