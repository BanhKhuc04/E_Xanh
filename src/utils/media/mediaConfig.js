export const MEDIA_PRESETS = {
  avatar: {
    maxWidth: 400,
    maxHeight: 400,
    output: 'webp',
    quality: 0.78,
    maxSizeKB: 120,
    minQuality: 0.6,
  },
  postCard: {
    maxWidth: 800,
    output: 'webp',
    quality: 0.78,
    maxSizeKB: 350,
    minQuality: 0.6,
  },
  postDetail: {
    maxWidth: 1200,
    output: 'webp',
    quality: 0.82,
    maxSizeKB: 650,
    minQuality: 0.65,
  },
  bannerHero: {
    maxWidth: 1600,
    output: 'webp',
    quality: 0.82,
    maxSizeKB: 800,
    minQuality: 0.65,
  },
  adminBanner: {
    maxWidth: 1600,
    output: 'webp',
    quality: 0.82,
    maxSizeKB: 800,
    minQuality: 0.65,
  },
  thumbnail: {
    maxWidth: 480,
    output: 'webp',
    quality: 0.72,
    maxSizeKB: 180,
    minQuality: 0.55,
  },
}

export const MEDIA_VALIDATION = {
  IMAGE: {
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    MAX_SIZE_MB: 10, // Max raw image size to process
  },
  VIDEO: {
    ALLOWED_TYPES: ['video/mp4', 'video/webm', 'video/quicktime'],
    MAX_SIZE_MB: 50, // Max raw video size
  },
}
