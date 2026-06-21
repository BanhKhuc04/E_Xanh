import { useState, useEffect } from 'react'
import { updatePost } from '../services/postService'
import { getUserSafeError } from '../utils/logger'
import { extractPlainTextFromBlocks } from '../utils/postBlocks'

// Sub-hooks
import { useComposerState } from './composer/useComposerState'
import { useComposerAuth } from './composer/useComposerAuth'
import { useComposerMedia } from './composer/useComposerMedia'

// Constants & Utils
import {
  TITLE_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
  CONTENT_MAX_LENGTH,
  TAGS_MAX_COUNT,
} from './composer/constants'
import { parseTags } from './composer/utils'
import { getComposerStatus } from './composer/validation'
import { MARKDOWN_IMAGE_LIMIT } from '../utils/markdown'

export function useEditPostForm({
  postId,
  initialData,
  onSuccess,
}) {
  // 1. Auth
  const {
    authLoading,
    user,
    profile,
  } = useComposerAuth()

  const [draftMeta, setDraftMeta] = useState('Đang chỉnh sửa bài viết...')

  // Convert DB tags format if necessary, and image URLs.
  const mappedInitialData = initialData ? {
    title: initialData.title || '',
    type: initialData.type || 'community',
    category: initialData.categories?.name || '',
    description: initialData.description || '',
    content: initialData.content || '',
    content_blocks: initialData.content_blocks || [],
    tags: initialData.tags || '',
    coverPreview: initialData.image_url || '',
  } : null

  // 3. Main State
  const {
    form,
    setForm,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
    infoMessage,
    setInfoMessage,
    previewHighlight,
    setPreviewHighlight,
    isSubmitting,
    setIsSubmitting,
    submitState,
    setSubmitState,
    submitError,
    setSubmitError,
    fieldErrors,
    setFieldErrors,
    validation,
    handleChange,
    handlePreview,
    closePreview,
  } = useComposerState(mappedInitialData?.type || 'community', mappedInitialData, setDraftMeta)

  // 5. Media (Crop & Upload)
  const {
    isUploadingInlineImage,
    cropState,
    handleCoverChange,
    removeCover,
    handleInlineImageUpload,
    handleCropApply,
    handleCropClose,
  } = useComposerMedia({
    form,
    setForm,
    setFieldErrors,
    setErrorMessage,
    user,
  })

  // We set original image URL so the form doesn't complain about empty cover if they don't change it.
  useEffect(() => {
    if (initialData?.image_url && !form.coverPreview) {
      setForm(prev => ({ ...prev, coverPreview: initialData.image_url }))
    }
  }, [initialData, form.coverPreview, setForm])

  const isFormReady = Object.keys(validation.errors).length === 0

  const composerStatus = getComposerStatus({
    form,
    validationErrors: validation.errors,
    isAutosaving: false,
    autosaveFailed: false,
    lastSavedAt: null,
    isSubmitting,
    submitState,
    submitError,
    isFormReady,
  })

  async function handleSubmit(event) {
    event?.preventDefault?.()
    setInfoMessage('')
    setPreviewHighlight(false)
    setErrorMessage('')
    setSuccessMessage('')
    setSubmitState('idle')
    setSubmitError('')
    setFieldErrors({})

    if (isSubmitting) {
      return { data: null, error: new Error('Submission in progress') }
    }

    if (!user) {
      const message = 'Vui lòng đăng nhập để lưu bài.'
      setErrorMessage(message)
      setSubmitState('error')
      setSubmitError(message)
      return { data: null, error: new Error('Not authenticated') }
    }

    const { errors } = validation
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setErrorMessage('Bạn kiểm tra lại các trường được đánh dấu để hoàn thiện bài viết nhé.')
      return { data: null, error: new Error('Validation failed') }
    }

    setIsSubmitting(true)
    setSubmitState('submitting')
    const blocksContent = extractPlainTextFromBlocks(form.content_blocks, form.content)

    // Cập nhật lại trạng thái thành pending để Admin duyệt
    const result = await updatePost(postId, {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      content: blocksContent.trim(),
      content_blocks: form.content_blocks,
      tags: parseTags(form.tags).join(', '),
      status: 'pending' // Chuyển bài về chờ duyệt lại
    })

    if (result.error) {
      const safeMessage = getUserSafeError(result.error, 'Hiện chưa thể lưu bài. Bạn thử lại sau ít phút nhé.')
      setErrorMessage(`Lỗi lưu bài: ${safeMessage}`)
      setSubmitState('error')
      setSubmitError(safeMessage)
      setIsSubmitting(false)
      return result
    }

    setSuccessMessage('Bài viết đã được sửa thành công và đang chờ duyệt lại!')
    setSubmitState('success')
    setSubmitError('')
    setIsSubmitting(false)

    if (onSuccess) {
      await onSuccess({
        post: result.data,
        profile,
        message: 'Bài viết đã được sửa thành công và đang chờ duyệt lại!',
      })
    }

    return result
  }

  return {
    form,
    errorMessage,
    successMessage,
    infoMessage,
    fieldErrors,
    previewHighlight,
    isSubmitting,
    authLoading,
    user,
    profile,
    draftMeta,
    submitState,
    submitError,
    isFormReady,
    composerStatus,
    isUploadingInlineImage,
    cropState,
    limits: {
      titleMax: TITLE_MAX_LENGTH,
      descriptionMax: DESCRIPTION_MAX_LENGTH,
      contentMin: CONTENT_MIN_LENGTH,
      contentMax: CONTENT_MAX_LENGTH,
      tagsMax: TAGS_MAX_COUNT,
      contentImageMax: MARKDOWN_IMAGE_LIMIT,
    },
    handleChange,
    handleCoverChange,
    removeCover,
    handlePreview,
    closePreview,
    handleInlineImageUpload,
    handleCropApply,
    handleCropClose,
    handleSubmit,
  }
}
