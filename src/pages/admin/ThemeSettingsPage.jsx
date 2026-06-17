import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Image as ImageIcon, Plus, Power, PowerOff, Trash2, Video } from 'lucide-react'
import AdminAnnouncementManager from '../../components/admin/settings/AdminAnnouncementManager'
import HeroMedia from '../../components/common/HeroMedia'
import ImageCropModal from '../../components/common/ImageCropModal'
import { getHeroPageLabel, heroPageOptions } from '../../data/pageHeroes'
import {
  addBanner,
  deleteBanner,
  fetchBannersByPageKeys,
  removeBannerStorageFiles,
  updateBanner,
  uploadBannerImage,
  uploadBannerVideo,
} from '../../services/bannerService'
import {
  ALLOWED_PROFILE_IMAGE_TYPES,
  MAX_VIDEO_SIZE,
  validateImageFile,
  validateVideoFile,
} from '../../utils/fileValidation'
import {
  generateFallbackPosterFile,
  generateVideoPosterFile,
  inspectVideoFilePlayback,
} from '../../utils/videoPoster'
import '../../styles/admin.css'
import '../../styles/admin-settings.css'

const VIDEO_LIMIT_MB = Math.round(MAX_VIDEO_SIZE / (1024 * 1024))

function createInitialBannerDraft() {
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

function revokePreviewUrl(url) {
  if (typeof url === 'string' && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

function ThemeSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [activeUpload, setActiveUpload] = useState({ pageKey: '', kind: '' })
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [bannerMap, setBannerMap] = useState({})
  const [sectionFeedback, setSectionFeedback] = useState({})
  const [cropPageKey, setCropPageKey] = useState('')
  const [cropSource, setCropSource] = useState('')
  const [cropFileName, setCropFileName] = useState('')

  const pageKeys = useMemo(() => heroPageOptions.map((item) => item.key), [])
  const [bannerDrafts, setBannerDrafts] = useState(() =>
    pageKeys.reduce((accumulator, key) => {
      accumulator[key] = createInitialBannerDraft()
      return accumulator
    }, {}),
  )

  const loadBanners = useCallback(async () => {
    setLoading(true)
    setErrorMsg('')

    const { data, error } = await fetchBannersByPageKeys(pageKeys)
    if (error) {
      setErrorMsg(`Lỗi khi tải danh sách hero/banner: ${error.message}`)
      setLoading(false)
      return
    }

    const grouped = pageKeys.reduce((accumulator, key) => {
      accumulator[key] = []
      return accumulator
    }, {})

    for (const banner of data) {
      if (!grouped[banner.page_key]) {
        grouped[banner.page_key] = []
      }
      grouped[banner.page_key].push(banner)
    }

    setBannerMap(grouped)
    setLoading(false)
  }, [pageKeys])

  useEffect(() => {
    loadBanners()
  }, [loadBanners])

  function showMessage(message, isError = false) {
    if (isError) {
      setErrorMsg(message)
      setSuccessMsg('')
    } else {
      setSuccessMsg(message)
      setErrorMsg('')
    }

    window.setTimeout(() => {
      setErrorMsg('')
      setSuccessMsg('')
    }, 5000)
  }

  function setInlineFeedback(pageKey, message = '', tone = 'info') {
    if (!pageKey) return

    setSectionFeedback((current) => ({
      ...current,
      [pageKey]: message
        ? {
            message,
            tone,
          }
        : null,
    }))
  }

  function updateDraft(pageKey, updater) {
    setBannerDrafts((current) => {
      const previousDraft = current[pageKey] || createInitialBannerDraft()
      const nextDraft =
        typeof updater === 'function'
          ? updater(previousDraft)
          : { ...previousDraft, ...updater }

      return {
        ...current,
        [pageKey]: nextDraft,
      }
    })
  }

  function resetDraft(pageKey) {
    setBannerDrafts((current) => {
      const previousDraft = current[pageKey]
      if (previousDraft) {
        revokePreviewUrl(previousDraft.videoPreview)
        revokePreviewUrl(previousDraft.posterPreview)
      }

      return {
        ...current,
        [pageKey]: createInitialBannerDraft(),
      }
    })
  }

  function handleMediaTypeChange(pageKey, mediaType) {
    setBannerDrafts((current) => {
      const previousDraft = current[pageKey] || createInitialBannerDraft()
      revokePreviewUrl(previousDraft.videoPreview)
      revokePreviewUrl(previousDraft.posterPreview)

      return {
        ...current,
        [pageKey]: {
          ...createInitialBannerDraft(),
          mediaType,
        },
      }
    })
    setInlineFeedback(pageKey, '')
  }

  function handleImageFileChange(event, pageKey) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    const validation = validateImageFile(file, {
      allowedTypes: ALLOWED_PROFILE_IMAGE_TYPES,
      invalidTypeMessage: 'Chỉ chấp nhận ảnh JPG, JPEG, PNG hoặc WebP.',
    })

    if (!validation.valid) {
      showMessage(validation.error, true)
      setInlineFeedback(pageKey, validation.error, 'error')
      return
    }

    updateDraft(pageKey, {
      imageStatus: `Đã chọn ảnh ${file.name}. Hãy cắt ảnh theo tỉ lệ 16:9 rồi lưu.`,
    })
    setInlineFeedback(pageKey, 'Ảnh đã được chọn. Tiếp theo hãy cắt ảnh và lưu để đưa lên đầu banner của trang này.', 'info')

    const reader = new FileReader()
    reader.onload = () => {
      setCropPageKey(pageKey)
      setCropSource(String(reader.result || ''))
      setCropFileName(file.name)
    }
    reader.readAsDataURL(file)
  }

  async function handleCropSubmit(croppedBlob) {
    if (!cropPageKey) return

    setUploading(true)
    setActiveUpload({ pageKey: cropPageKey, kind: 'image' })
    setInlineFeedback(cropPageKey, 'Đang upload ảnh banner và đưa ảnh mới lên đầu danh sách...', 'info')

    try {
      const { publicUrl, error: uploadError } = await uploadBannerImage(croppedBlob, {
        folder: 'images',
        prefix: 'banner-image',
      })
      if (uploadError) {
        throw new Error(uploadError.message || 'Lỗi upload ảnh.')
      }

      const nextList = bannerMap[cropPageKey] || []
      const shiftedBanners = nextList
        .map((banner, index) => ({ ...banner, nextSortOrder: index + 1 }))
        .filter((banner) => (banner.sort_order ?? 0) !== banner.nextSortOrder)

      if (shiftedBanners.length > 0) {
        const shiftResults = await Promise.all(
          shiftedBanners.map((banner) => updateBanner(banner.id, { sort_order: banner.nextSortOrder })),
        )
        const shiftError = shiftResults.find((result) => result.error)?.error
        if (shiftError) {
          throw new Error(shiftError.message || 'Không thể sắp xếp lại banner hiện có.')
        }
      }

      const { error: dbError } = await addBanner({
        page_key: cropPageKey,
        image_url: publicUrl,
        title: cropFileName || `${cropPageKey}-hero-image`,
        is_active: true,
        sort_order: 0,
      })

      if (dbError) {
        throw new Error(dbError.message || 'Không thể lưu cấu hình hero.')
      }

      showMessage(`Đã thêm ảnh banner cho ${getHeroPageLabel(cropPageKey)}.`)
      setInlineFeedback(cropPageKey, 'Đã lưu ảnh banner thành công. Ảnh mới đang được ưu tiên hiển thị đầu tiên.', 'success')
      setCropSource('')
      setCropPageKey('')
      setCropFileName('')
      resetDraft(cropPageKey)
      await loadBanners()
    } catch (error) {
      showMessage(error.message, true)
      setInlineFeedback(cropPageKey, error.message || 'Không thể lưu banner ảnh.', 'error')
    } finally {
      setUploading(false)
      setActiveUpload({ pageKey: '', kind: '' })
    }
  }

  function handleManualPosterChange(event, pageKey) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    const validation = validateImageFile(file, {
      allowedTypes: ALLOWED_PROFILE_IMAGE_TYPES,
      invalidTypeMessage: 'Chỉ chấp nhận ảnh JPG, JPEG, PNG hoặc WebP làm poster.',
    })

    if (!validation.valid) {
      showMessage(validation.error, true)
      setInlineFeedback(pageKey, validation.error, 'error')
      return
    }

    const nextPreview = URL.createObjectURL(file)

    updateDraft(pageKey, (draft) => {
      revokePreviewUrl(draft.posterPreview)

      return {
        ...draft,
        posterFile: file,
        posterName: file.name,
        posterPreview: nextPreview,
        videoStatus: draft.videoFile ? 'Đã upload poster thủ công. Bạn có thể lưu banner video ngay.' : 'Đã chọn poster. Vui lòng chọn thêm video.',
        videoStatusTone: 'success',
      }
    })
    setInlineFeedback(pageKey, 'Đã thay đổi ảnh poster thủ công thành công.', 'success')
  }

  async function handleVideoChange(event, pageKey) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    const validation = validateVideoFile(file)
    if (!validation.valid) {
      showMessage(validation.error, true)
      setInlineFeedback(pageKey, validation.error, 'error')
      return
    }

    const nextPreview = URL.createObjectURL(file)

    updateDraft(pageKey, (draft) => {
      revokePreviewUrl(draft.videoPreview)
      revokePreviewUrl(draft.posterPreview)

      return {
        ...draft,
        mediaType: 'video',
        videoFile: file,
        videoName: file.name,
        videoSize: file.size,
        videoDuration: 0,
        videoPreview: nextPreview,
        videoStatus: `Đã chọn video ${file.name}. Đang tạo ảnh chờ tự động...`,
        videoStatusTone: 'info',
        isPreparingVideo: true,
        posterFile: null,
        posterName: '',
        posterPreview: '',
        }
      })
      setInlineFeedback(pageKey, 'Video đã được chọn. Hệ thống đang kiểm tra khả năng phát và chuẩn bị poster tự động.', 'info')

    try {
      const playbackInspection = await inspectVideoFilePlayback(file)
      if (!playbackInspection.playable) {
        updateDraft(pageKey, (draft) => {
          revokePreviewUrl(draft.videoPreview)
          revokePreviewUrl(draft.posterPreview)

          return {
            ...draft,
            videoFile: null,
            videoPreview: '',
            posterFile: null,
            posterName: '',
            posterPreview: '',
            videoStatus: playbackInspection.reason,
            videoStatusTone: 'error',
            isPreparingVideo: false,
          }
        })
        setInlineFeedback(
          pageKey,
          `${playbackInspection.reason} File này không thể dùng làm banner video. Hãy xuất lại bằng MP4 H.264 hoặc WebM VP9.`,
          'error',
        )
        showMessage(
          `${playbackInspection.reason} Hãy xuất lại bằng MP4 H.264 hoặc WebM VP9 rồi upload lại.`,
          true,
        )
        return
      }

      const generatedPosterFile = await generateVideoPosterFile(file)
      const posterPreview = URL.createObjectURL(generatedPosterFile)

      updateDraft(pageKey, (draft) => {
        revokePreviewUrl(draft.posterPreview)

        return {
          ...draft,
          posterFile: generatedPosterFile,
          posterName: generatedPosterFile.name,
          posterPreview,
          videoDuration: playbackInspection.duration || 0,
          videoStatus: `Đã chọn video ${file.name}. Poster được tạo tự động, bạn có thể lưu ngay.`,
          videoStatusTone: 'success',
          isPreparingVideo: false,
        }
      })
      setInlineFeedback(pageKey, 'Poster đã tạo xong. Bạn có thể bấm lưu banner video ngay bây giờ.', 'success')
    } catch (error) {
      try {
        const fallbackPosterFile = await generateFallbackPosterFile(file.name)
        const fallbackPreview = URL.createObjectURL(fallbackPosterFile)

        updateDraft(pageKey, (draft) => {
          revokePreviewUrl(draft.posterPreview)

          return {
            ...draft,
            posterFile: fallbackPosterFile,
            posterName: fallbackPosterFile.name,
            posterPreview: fallbackPreview,
            videoDuration: playbackInspection.duration || 0,
            videoStatus: `Không đọc được frame đầu của ${file.name}. Hệ thống đã dùng poster mặc định. Bạn có thể chọn upload poster thủ công bên dưới.`,
            videoStatusTone: 'warning',
            isPreparingVideo: false,
          }
        })
        setInlineFeedback(pageKey, 'Video phát được nhưng không trích được frame đầu. Hệ thống sẽ dùng poster fallback nếu bạn tiếp tục lưu.', 'warning')
      } catch (fallbackError) {
        updateDraft(pageKey, (draft) => ({
          ...draft,
          posterFile: null,
          posterName: '',
          posterPreview: '',
          videoDuration: playbackInspection?.duration || 0,
          videoStatus: `Đã chọn video ${file.name} nhưng chưa tạo được poster tự động. Vui lòng upload poster thủ công.`,
          videoStatusTone: 'error',
          isPreparingVideo: false,
        }))
        showMessage(fallbackError.message || error.message || 'Không thể chuẩn bị poster cho video này.', true)
        setInlineFeedback(pageKey, fallbackError.message || error.message || 'Không thể chuẩn bị poster cho video này.', 'error')
      }
    }
  }

  async function handleCreateVideoBanner(pageKey) {
    const draft = bannerDrafts[pageKey] || createInitialBannerDraft()

    if (!draft.videoFile) {
      showMessage('Vui lòng chọn video MP4 hoặc WebM trước khi lưu.', true)
      setInlineFeedback(pageKey, 'Vui lòng chọn video MP4 hoặc WebM trước khi lưu.', 'error')
      return
    }

    if (draft.isPreparingVideo) {
      showMessage('Hệ thống đang chuẩn bị video. Vui lòng đợi thêm một chút rồi lưu.', true)
      setInlineFeedback(pageKey, 'Hệ thống đang chuẩn bị video. Vui lòng đợi thêm một chút rồi lưu.', 'warning')
      return
    }

    if (!draft.posterFile) {
      showMessage('Chưa thể tạo ảnh chờ tự động cho video này. Hãy chọn lại video khác hoặc file nhẹ hơn.', true)
      setInlineFeedback(pageKey, 'Chưa thể tạo ảnh chờ tự động cho video này. Hãy chọn lại video khác hoặc file nhẹ hơn.', 'error')
      return
    }

    setUploading(true)
    setActiveUpload({ pageKey, kind: 'video' })
    setInlineFeedback(pageKey, 'Đang upload video banner...', 'info')

    const uploadedUrls = []

    try {
      const { publicUrl: videoUrl, error: videoError } = await uploadBannerVideo(draft.videoFile, {
        folder: 'videos',
        prefix: 'banner-video',
      })
      if (videoError) {
        throw new Error(videoError.message || 'Không thể upload video banner.')
      }
      uploadedUrls.push(videoUrl)
      setInlineFeedback(pageKey, 'Video đã upload xong. Đang upload poster fallback...', 'info')

      const { publicUrl: posterUrl, error: posterError } = await uploadBannerImage(draft.posterFile, {
        folder: 'posters',
        prefix: 'banner-poster',
      })
      if (posterError) {
        throw new Error(posterError.message || 'Không thể upload poster cho video.')
      }
      uploadedUrls.push(posterUrl)
      setInlineFeedback(pageKey, 'Poster đã upload xong. Đang lưu cấu hình banner vào hệ thống...', 'info')

      const nextList = bannerMap[pageKey] || []
      const shiftedBanners = nextList
        .map((banner, index) => ({ ...banner, nextSortOrder: index + 1 }))
        .filter((banner) => (banner.sort_order ?? 0) !== banner.nextSortOrder)

      if (shiftedBanners.length > 0) {
        const shiftResults = await Promise.all(
          shiftedBanners.map((banner) => updateBanner(banner.id, { sort_order: banner.nextSortOrder })),
        )
        const shiftError = shiftResults.find((result) => result.error)?.error
        if (shiftError) {
          throw new Error(shiftError.message || 'Không thể sắp xếp lại banner hiện có.')
        }
      }

      const { error: dbError } = await addBanner({
        page_key: pageKey,
        media_type: 'video',
        image_url: posterUrl,
        video_url: videoUrl,
        poster_url: posterUrl,
        title: draft.videoName || `${pageKey}-hero-video`,
        is_active: true,
        sort_order: 0,
      })

      if (dbError) {
        throw new Error(dbError.message || 'Không thể lưu banner video.')
      }

      showMessage(`Đã thêm video banner cho ${getHeroPageLabel(pageKey)}.`)
      setInlineFeedback(pageKey, 'Đã lưu banner video thành công. Banner mới đang được ưu tiên hiển thị đầu tiên.', 'success')
      resetDraft(pageKey)
      await loadBanners()
    } catch (error) {
      if (uploadedUrls.length > 0) {
        await removeBannerStorageFiles(uploadedUrls)
      }
      showMessage(error.message, true)
      setInlineFeedback(pageKey, error.message || 'Không thể lưu banner video.', 'error')
    } finally {
      setUploading(false)
      setActiveUpload({ pageKey: '', kind: '' })
    }
  }

  async function handleToggleActive(banner) {
    const { error } = await updateBanner(banner.id, { is_active: !banner.is_active })
    if (error) {
      showMessage(`Lỗi cập nhật trạng thái: ${error.message}`, true)
      return
    }

    await loadBanners()
  }

  async function handleDelete(banner) {
    if (!window.confirm(`Xóa banner của ${getHeroPageLabel(banner.page_key)}?`)) return

    const { error } = await deleteBanner(banner)
    if (error) {
      showMessage(`Lỗi khi xóa: ${error.message}`, true)
      return
    }

    showMessage('Đã xóa banner hero.')
    await loadBanners()
  }

  async function handleMove(pageKey, bannerId, direction) {
    const banners = [...(bannerMap[pageKey] || [])]
    const index = banners.findIndex((item) => item.id === bannerId)
    if (index < 0) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= banners.length) return

    const currentBanner = banners[index]
    const targetBanner = banners[targetIndex]

    const currentOrder = currentBanner.sort_order
    currentBanner.sort_order = targetBanner.sort_order
    targetBanner.sort_order = currentOrder

    const firstUpdate = await updateBanner(currentBanner.id, { sort_order: currentBanner.sort_order })
    const secondUpdate = await updateBanner(targetBanner.id, { sort_order: targetBanner.sort_order })

    if (firstUpdate.error || secondUpdate.error) {
      showMessage('Không thể cập nhật thứ tự hiển thị.', true)
      return
    }

    await loadBanners()
  }

  function renderImageUploader(pageKey, draft) {
    return (
      <div className="banner-upload-card__body">
        <div className="banner-upload-card__field">
          <strong>Ảnh banner</strong>
          <p>
            Chấp nhận JPG, JPEG, PNG, WebP. Ảnh sẽ được cắt theo tỉ lệ 16:9 và tối ưu trước khi lưu.
          </p>
        </div>

        <div className="banner-upload-card__actions">
          <label className="btn btn--primary" style={{ cursor: 'pointer' }}>
            <ImageIcon size={18} />
            <span>
              {uploading && activeUpload.pageKey === pageKey && activeUpload.kind === 'image'
                ? 'Đang xử lý ảnh...'
                : '+ Upload ảnh'}
            </span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={(event) => handleImageFileChange(event, pageKey)}
              disabled={uploading}
              hidden
            />
          </label>
        </div>

        <div className="banner-upload-card__status-list">
          {draft.imageStatus ? (
            <span className="page-badge page-badge--soft">{draft.imageStatus}</span>
          ) : (
            <span className="banner-upload-card__hint">
              Chọn ảnh để mở công cụ crop rồi lưu ngay vào banner của trang này.
            </span>
          )}
        </div>
      </div>
    )
  }

  function renderVideoUploader(pageKey, draft) {
    const isCurrentUpload = uploading && activeUpload.pageKey === pageKey && activeUpload.kind === 'video'

    return (
      <div className="banner-upload-card__body banner-upload-card__body--video">
        <div className="banner-upload-card__field">
          <strong>Video banner</strong>
          <p>Chỉ chấp nhận MP4 hoặc WebM, tối đa {VIDEO_LIMIT_MB}MB. Khuyến nghị dưới 5MB để load nhanh hơn. Poster sẽ được tạo tự động từ video.</p>
          <label className="btn btn--secondary" style={{ cursor: 'pointer' }}>
            <Video size={18} />
            <span>{draft.videoName ? 'Đổi video' : 'Chọn video'}</span>
            <input
              type="file"
              accept="video/mp4,video/webm"
              onChange={(event) => handleVideoChange(event, pageKey)}
              disabled={uploading}
              hidden
            />
          </label>
        </div>

        {draft.videoPreview ? (
          <div className="banner-upload-card__preview">
            <div className="banner-upload-card__preview-media">
              <video
                src={draft.videoPreview}
                poster={draft.posterPreview || undefined}
                autoPlay
                controls
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>

            <div className="banner-upload-card__preview-copy">
              <strong>Xem trước banner video</strong>
              <p>Video sẽ autoplay dạng trang trí ở desktop. Mobile, reduced-motion và trường hợp video lỗi sẽ dùng poster tự tạo để fallback.</p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Dung lượng: {(draft.videoSize / (1024 * 1024)).toFixed(2)} MB
                {draft.videoDuration ? ` • Độ dài: ${Math.round(draft.videoDuration)}s` : ''}
              </div>
            </div>
          </div>
        ) : null}

        <div className="banner-upload-card__status-list">
          {draft.videoName ? <span className="page-badge page-badge--soft">Đã chọn video: {draft.videoName}</span> : null}
          {draft.posterName ? <span className="page-badge page-badge--soft">{draft.posterName.includes('fallback') || draft.videoStatusTone === 'warning' ? 'Poster dự phòng: ' : 'Poster: '}{draft.posterName}</span> : null}
          {draft.videoStatus ? (
            <span className={`banner-upload-card__notice banner-upload-card__notice--${draft.videoStatusTone || 'info'}`}>
              {draft.videoStatus}
            </span>
          ) : null}
        </div>

        <div className="banner-upload-card__actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => handleCreateVideoBanner(pageKey)}
            disabled={uploading || draft.isPreparingVideo || !draft.videoFile || draft.videoStatusTone === 'error'}
          >
            <Plus size={18} />
            {isCurrentUpload ? 'Đang lưu video...' : draft.isPreparingVideo ? 'Đang chuẩn bị video...' : '+ Lưu banner video'}
          </button>

          {(draft.videoFile || draft.posterFile) && (
            <label className="btn btn--secondary" style={{ cursor: 'pointer' }}>
              <ImageIcon size={18} />
              <span>Thay poster thủ công</span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={(event) => handleManualPosterChange(event, pageKey)}
                disabled={uploading}
                hidden
              />
            </label>
          )}
        </div>
      </div>
    )
  }

  function renderBannerSection(pageKey) {
    const banners = bannerMap[pageKey] || []
    const draft = bannerDrafts[pageKey] || createInitialBannerDraft()
    const inlineFeedback = sectionFeedback[pageKey]

    return (
      <section key={pageKey} className="admin-section banner-section">
        <div className="banner-section__header">
          <div>
            <h2>{getHeroPageLabel(pageKey)}</h2>
            <p>
              Chọn 1 trong 2 loại banner: ảnh hoặc video. Banner active đầu tiên sẽ được ưu tiên hiển thị ngoài public.
            </p>
          </div>
        </div>

        <article className="admin-card banner-upload-card">
          <div className="banner-upload-card__switch">
            <button
              type="button"
              className={`banner-upload-card__switch-btn ${draft.mediaType === 'image' ? 'is-active' : ''}`}
              onClick={() => handleMediaTypeChange(pageKey, 'image')}
            >
              <ImageIcon size={16} />
              Upload ảnh
            </button>
            <button
              type="button"
              className={`banner-upload-card__switch-btn ${draft.mediaType === 'video' ? 'is-active' : ''}`}
              onClick={() => handleMediaTypeChange(pageKey, 'video')}
            >
              <Video size={16} />
              Upload video
            </button>
          </div>

          {draft.mediaType === 'image'
            ? renderImageUploader(pageKey, draft)
            : renderVideoUploader(pageKey, draft)}

          {inlineFeedback?.message ? (
            <div className={`banner-upload-card__notice banner-upload-card__notice--${inlineFeedback.tone || 'info'}`}>
              {inlineFeedback.message}
            </div>
          ) : null}
        </article>

        {loading ? (
          <div className="banner-grid banner-grid--loading">
            <div className="banner-grid__skeleton"></div>
            <div className="banner-grid__skeleton"></div>
          </div>
        ) : null}

        {!loading && banners.length === 0 ? (
          <p className="text-muted">Chưa có banner nào cho trang này.</p>
        ) : null}

        {!loading && banners.length > 0 ? (
          <div className="banner-grid">
            {banners.map((banner, index) => (
              <article key={banner.id} className="admin-card banner-card">
                <HeroMedia
                  className="banner-card__preview"
                  mediaType={banner.media_type}
                  imageUrl={banner.image_url}
                  videoUrl={banner.video_url}
                  posterUrl={banner.poster_url}
                  alt={`${getHeroPageLabel(pageKey)} banner`}
                />

                <div className="banner-card__meta">
                  <div className="banner-card__meta-left">
                    <span className="page-badge page-badge--soft">
                      {banner.media_type === 'video' ? 'Banner video' : 'Banner ảnh'}
                    </span>
                    <span className="page-badge page-badge--soft">
                      {banner.is_active ? 'Đang hoạt động' : 'Đã ẩn'}
                    </span>
                  </div>
                  <span className="banner-card__order">Thứ tự #{index + 1}</span>
                </div>

                <div className="banner-card__actions">
                  <div className="banner-card__actions-group">
                    <button
                      type="button"
                      className={`btn btn--ghost ${banner.is_active ? '' : 'btn--secondary'}`}
                      onClick={() => handleToggleActive(banner)}
                    >
                      {banner.is_active ? <PowerOff size={16} /> : <Power size={16} />}
                      {banner.is_active ? 'Ẩn' : 'Bật'}
                    </button>

                    <button
                      type="button"
                      className="btn btn--ghost"
                      style={{ color: '#b23b2a' }}
                      onClick={() => handleDelete(banner)}
                    >
                      <Trash2 size={16} />
                      Xóa
                    </button>
                  </div>

                  <div className="banner-card__actions-group">
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => handleMove(pageKey, banner.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => handleMove(pageKey, banner.id, 'down')}
                      disabled={index === banners.length - 1}
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    )
  }

  return (
    <div className="admin-page admin-settings-page">
      <header className="admin-page__header">
        <div className="admin-page__title">
          <h1>Cài đặt giao diện</h1>
          <p>Quản lý hero/banner theo 2 chế độ upload ảnh hoặc upload video, vẫn giữ an toàn cho banner ảnh cũ.</p>
        </div>
      </header>

      <div className="admin-page__content">
        {errorMsg ? <div className="admin-alert admin-alert--error">{errorMsg}</div> : null}
        {successMsg ? <div className="admin-alert admin-alert--success">{successMsg}</div> : null}

        <AdminAnnouncementManager />

        {heroPageOptions.map((item) => renderBannerSection(item.key))}
      </div>

      <ImageCropModal
        isOpen={Boolean(cropSource)}
        image={cropSource}
        title={`Cắt ảnh cho ${getHeroPageLabel(cropPageKey)}${cropFileName ? ` • ${cropFileName}` : ''}`}
        aspect={heroPageOptions.find((item) => item.key === cropPageKey)?.aspectRatio || 16 / 9}
        confirmLabel="Cắt & lưu ảnh"
        onClose={() => {
          setCropSource('')
          setCropPageKey('')
          setCropFileName('')
        }}
        onApply={handleCropSubmit}
      />
    </div>
  )
}

export default ThemeSettingsPage
