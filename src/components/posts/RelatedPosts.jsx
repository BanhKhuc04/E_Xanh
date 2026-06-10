import { Link } from 'react-router-dom'

function RelatedPosts({ title, posts, compact = false }) {
  return (
    <section className={`related-posts${compact ? ' related-posts--compact' : ''}`}>
      <h2>{title}</h2>
      <div className="related-posts__list">
        {posts.map((post) => (
          <Link key={post.id} to={`/meo-tiet-kiem/${post.slug}`} className="related-posts__item">
            <img 
              src={post.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80'} 
              alt={post.title} 
              style={{ objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80' }}
            />
            <div>
              <h3>{post.title}</h3>
              {compact ? <span>{post.date}</span> : <p>{post.description}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default RelatedPosts
