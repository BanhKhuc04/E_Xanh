import RelatedPostCard from './RelatedPostCard'
import '../../styles/related-posts-section.css'

function RelatedPostsSection({ title, posts, compact = false }) {
  if (!posts || posts.length === 0) return null

  // If compact is true, we might limit the number of posts shown (e.g. 3)
  const displayPosts = compact ? posts.slice(0, 3) : posts

  return (
    <section className="exanh-related-section">
      {title && (
        <div className="exanh-section-heading">
          <h2>{title}</h2>
        </div>
      )}

      <div className="exanh-related-grid">
        {displayPosts.map(post => (
          <RelatedPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}

export default RelatedPostsSection
