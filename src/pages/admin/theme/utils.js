export function createInitialBannerDraft() {
  return {
    mediaType: 'image',
    imageStatus: '',
    videoFile: null,
    videoName: '',
    videoSize: 0,
    videoDuration: 0,
    videoPreview: '',
    videoStatus: '',
    videoStatusTone: 'info',
    isPreparingVideo: false,
    posterFile: null,
    posterName: '',
    posterPreview: '',
  }
}

export function revokePreviewUrl(url) {
  if (typeof url === 'string' && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}
