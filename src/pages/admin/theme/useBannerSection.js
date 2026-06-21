import { useState } from 'react'
import {
  addBanner,
  deleteBanner,
  removeBannerStorageFiles,
  updateBanner,
  uploadBannerImage,
  uploadBannerVideo,
} from '../../../services/bannerService'
import {
  ALLOWED_PROFILE_IMAGE_TYPES,
  validateImageFile,
  validateVideoFile,
} from '../../../utils/fileValidation'
import {
  generateFallbackPosterFile,
  generateVideoPosterFile,
  inspectVideoFilePlayback,
} from '../../../utils/videoPoster'
import { createInitialBannerDraft, revokePreviewUrl } from './utils'
import { getHeroPageLabel } from '../../../data/pageHeroes'

export function useBannerSection(pageKey, banners, loadBanners, showMessage) {
  const [draft, setDraft] = useState(createInitialBannerDraft())
  const [inlineFeedback, setInlineFeedback] = useState(null)
  const [uploading, setUploading] = useState(false)
  
  const [cropSource, setCropSource] = useState('')
  const [cropFileName, setCropFileName] = useState('')

  function showInlineFeedback(message = '', tone = 'info') {
    if (!message) {
      setInlineFeedback(null)
    } else {
      setInlineFeedback({ message, tone })
    }
  }

  function resetDraft() {
    revokePreviewUrl(draft.videoPreview)
    revokePreviewUrl(draft.posterPreview)
    setDraft(createInitialBannerDraft())
  }

  function handleMediaTypeChange(mediaType) {
    revokePreviewUrl(draft.videoPreview)
    revokePreviewUrl(draft.posterPreview)
    setDraft({ ...createInitialBannerDraft(), mediaType })
    showInlineFeedback('')
  }

  function handleImageFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    const validation = validateImageFile(file, {
      allowedTypes: ALLOWED_PROFILE_IMAGE_TYPES,
      invalidTypeMessage: 'Chỉ chấp nhận ảnh JPG, JPEG, PNG hoặc WebP.',
    })

    if (!validation.valid) {
      showMessage(validation.error, true)
      showInlineFeedback(validation.error, 'error')
      return
    }

    setDraft((current) => ({
      ...current,
      imageStatus: `Đã chọn ảnh ${file.name}. Hãy cắt ảnh theo tỉ lệ 16:9 rồi lưu.`,
    }))
    showInlineFeedback('Ảnh đã được chọn. Tiếp theo hãy cắt ảnh và lưu để đưa lên đầu banner của trang này.', 'info')

    const reader = new FileReader()
    reader.onload = () => {
      setCropSource(String(reader.result || ''))
      setCropFileName(file.name)
    }
    reader.readAsDataURL(file)
  }

  async function handleCropSubmit(croppedBlob) {
    setUploading(true)
    showInlineFeedback('Đang upload ảnh banner và đưa ảnh mới lên đầu danh sách...', 'info')

    try {
      const { publicUrl, error: uploadError } = await uploadBannerImage(croppedBlob, {
        folder: 'images',
        prefix: 'banner-image',
      })
      if (uploadError) {
        throw new Error(uploadError.message || 'Lỗi upload ảnh.')
      }

      const shiftedBanners = banners
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
        image_url: publicUrl,
        title: cropFileName || `${pageKey}-hero-image`,
        is_active: true,
        sort_order: 0,
      })

      if (dbError) {
        throw new Error(dbError.message || 'Không thể lưu cấu hình hero.')
      }

      showMessage(`Đã thêm ảnh banner cho ${getHeroPageLabel(pageKey)}.`)
      showInlineFeedback('Đã lưu ảnh banner thành công. Ảnh mới đang được ưu tiên hiển thị đầu tiên.', 'success')
      setCropSource('')
      setCropFileName('')
      resetDraft()
      await loadBanners()
    } catch (error) {
      showMessage(error.message, true)
      showInlineFeedback(error.message || 'Không thể lưu banner ảnh.', 'error')
    } finally {
      setUploading(false)
    }
  }

  function handleManualPosterChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    const validation = validateImageFile(file, {
      allowedTypes: ALLOWED_PROFILE_IMAGE_TYPES,
      invalidTypeMessage: 'Chỉ chấp nhận ảnh JPG, JPEG, PNG hoặc WebP làm poster.',
    })

    if (!validation.valid) {
      showMessage(validation.error, true)
      showInlineFeedback(validation.error, 'error')
      return
    }

    const nextPreview = URL.createObjectURL(file)

    setDraft((current) => {
      revokePreviewUrl(current.posterPreview)

      return {
        ...current,
        posterFile: file,
        posterName: file.name,
        posterPreview: nextPreview,
        videoStatus: current.videoFile ? 'Đã upload poster thủ công. Bạn có thể lưu banner video ngay.' : 'Đã chọn poster. Vui lòng chọn thêm video.',
        videoStatusTone: 'success',
      }
    })
    showInlineFeedback('Đã thay đổi ảnh poster thủ công thành công.', 'success')
  }

  async function handleVideoChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    const validation = validateVideoFile(file)
    if (!validation.valid) {
      showMessage(validation.error, true)
      showInlineFeedback(validation.error, 'error')
      return
    }

    const nextPreview = URL.createObjectURL(file)

    setDraft((current) => {
      revokePreviewUrl(current.videoPreview)
      revokePreviewUrl(current.posterPreview)

      return {
        ...current,
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
    showInlineFeedback('Video đã được chọn. Hệ thống đang kiểm tra khả năng phát và chuẩn bị poster tự động.', 'info')

    let playbackInspection = null

    try {
      playbackInspection = await inspectVideoFilePlayback(file)
      if (!playbackInspection.playable) {
        setDraft((current) => {
          revokePreviewUrl(current.videoPreview)
          revokePreviewUrl(current.posterPreview)

          return {
            ...current,
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
        showInlineFeedback(`${playbackInspection.reason} File này không thể dùng làm banner video. Hãy xuất lại bằng MP4 H.264 hoặc WebM VP9.`, 'error')
        showMessage(`${playbackInspection.reason} Hãy xuất lại bằng MP4 H.264 hoặc WebM VP9 rồi upload lại.`, true)
        return
      }

      const generatedPosterFile = await generateVideoPosterFile(file)
      const posterPreview = URL.createObjectURL(generatedPosterFile)

      setDraft((current) => {
        revokePreviewUrl(current.posterPreview)

        return {
          ...current,
          posterFile: generatedPosterFile,
          posterName: generatedPosterFile.name,
          posterPreview,
          videoDuration: playbackInspection.duration || 0,
          videoStatus: `Đã chọn video ${file.name}. Poster được tạo tự động, bạn có thể lưu ngay.`,
          videoStatusTone: 'success',
          isPreparingVideo: false,
        }
      })
      showInlineFeedback('Poster đã tạo xong. Bạn có thể bấm lưu banner video ngay bây giờ.', 'success')
    } catch (error) {
      try {
        const fallbackPosterFile = await generateFallbackPosterFile(file.name)
        const fallbackPreview = URL.createObjectURL(fallbackPosterFile)

        setDraft((current) => {
          revokePreviewUrl(current.posterPreview)

          return {
            ...current,
            posterFile: fallbackPosterFile,
            posterName: fallbackPosterFile.name,
            posterPreview: fallbackPreview,
            videoDuration: playbackInspection?.duration || 0,
            videoStatus: `Không đọc được frame đầu của ${file.name}. Hệ thống đã dùng poster mặc định. Bạn có thể chọn upload poster thủ công bên dưới.`,
            videoStatusTone: 'warning',
            isPreparingVideo: false,
          }
        })
        showInlineFeedback('Video phát được nhưng không trích được frame đầu. Hệ thống sẽ dùng poster fallback nếu bạn tiếp tục lưu.', 'warning')
      } catch (fallbackError) {
        setDraft((current) => ({
          ...current,
          posterFile: null,
          posterName: '',
          posterPreview: '',
          videoDuration: playbackInspection?.duration || 0,
          videoStatus: `Đã chọn video ${file.name} nhưng chưa tạo được poster tự động. Vui lòng upload poster thủ công.`,
          videoStatusTone: 'error',
          isPreparingVideo: false,
        }))
        showMessage(fallbackError.message || error.message || 'Không thể chuẩn bị poster cho video này.', true)
        showInlineFeedback(fallbackError.message || error.message || 'Không thể chuẩn bị poster cho video này.', 'error')
      }
    }
  }

  async function handleCreateVideoBanner() {
    if (!draft.videoFile) {
      showMessage('Vui lòng chọn video MP4 hoặc WebM trước khi lưu.', true)
      showInlineFeedback('Vui lòng chọn video MP4 hoặc WebM trước khi lưu.', 'error')
      return
    }

    if (draft.isPreparingVideo) {
      showMessage('Hệ thống đang chuẩn bị video. Vui lòng đợi thêm một chút rồi lưu.', true)
      showInlineFeedback('Hệ thống đang chuẩn bị video. Vui lòng đợi thêm một chút rồi lưu.', 'warning')
      return
    }

    if (!draft.posterFile) {
      showMessage('Chưa thể tạo ảnh chờ tự động cho video này. Hãy chọn lại video khác hoặc file nhẹ hơn.', true)
      showInlineFeedback('Chưa thể tạo ảnh chờ tự động cho video này. Hãy chọn lại video khác hoặc file nhẹ hơn.', 'error')
      return
    }

    setUploading(true)
    showInlineFeedback('Đang upload video banner...', 'info')

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
      showInlineFeedback('Video đã upload xong. Đang upload poster fallback...', 'info')

      const { publicUrl: posterUrl, error: posterError } = await uploadBannerImage(draft.posterFile, {
        folder: 'posters',
        prefix: 'banner-poster',
      })
      if (posterError) {
        throw new Error(posterError.message || 'Không thể upload poster cho video.')
      }
      uploadedUrls.push(posterUrl)
      showInlineFeedback('Poster đã upload xong. Đang lưu cấu hình banner vào hệ thống...', 'info')

      const shiftedBanners = banners
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
      showInlineFeedback('Đã lưu banner video thành công. Banner mới đang được ưu tiên hiển thị đầu tiên.', 'success')
      resetDraft()
      await loadBanners()
    } catch (error) {
      if (uploadedUrls.length > 0) {
        await removeBannerStorageFiles(uploadedUrls)
      }
      showMessage(error.message, true)
      showInlineFeedback(error.message || 'Không thể lưu banner video.', 'error')
    } finally {
      setUploading(false)
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

  async function handleMove(bannerId, direction) {
    const index = banners.findIndex((item) => item.id === bannerId)
    if (index < 0) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= banners.length) return

    const currentBanner = banners[index]
    const targetBanner = banners[targetIndex]

    const firstUpdate = await updateBanner(currentBanner.id, { sort_order: targetBanner.sort_order })
    const secondUpdate = await updateBanner(targetBanner.id, { sort_order: currentBanner.sort_order })

    if (firstUpdate.error || secondUpdate.error) {
      showMessage('Không thể cập nhật thứ tự hiển thị.', true)
      return
    }

    await loadBanners()
  }

  return {
    draft,
    inlineFeedback,
    uploading,
    cropSource,
    cropFileName,
    setCropSource,
    setCropFileName,
    handleMediaTypeChange,
    handleImageFileChange,
    handleCropSubmit,
    handleManualPosterChange,
    handleVideoChange,
    handleCreateVideoBanner,
    handleToggleActive,
    handleDelete,
    handleMove
  }
}
