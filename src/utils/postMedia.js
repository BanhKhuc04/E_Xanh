const FALLBACK_ILLUSTRATION = '/og-image-v2.png'

export function resolvePostImageSource(post = {}) {
  return (
    post.cover_image ||
    post.image_url ||
    post.thumbnail_url ||
    post.banner_url ||
    post.image ||
    null
  )
}

export function resolvePostDetailRoute(post = {}) {
  return post.type === 'community'
    ? `/cong-dong/${post.id}`
    : `/meo-tiet-kiem/${post.slug || post.id}`
}

export function getPostImageFallback() {
  return FALLBACK_ILLUSTRATION
}
