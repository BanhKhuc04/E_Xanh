export const AVATAR_FRAMES = [
  {
    id: 'exanh-default',
    name: 'E-XANH mặc định',
    src: '/avatar-frames/exanh-default-frame.png',
    isDefault: true,
    compose: {
      avatarScale: 0.70, // 70% width/height hole
      avatarCenterX: 0.5, // horizontally centered
      avatarCenterY: 0.44, // vertically shifted down
    },
  },
]

export function getAvatarFrameById(frameId) {
  return AVATAR_FRAMES.find((frame) => frame.id === frameId) || AVATAR_FRAMES.find((frame) => frame.isDefault)
}

export const DEFAULT_AVATAR_FRAME = AVATAR_FRAMES.find((frame) => frame.isDefault) || AVATAR_FRAMES[0] || null
