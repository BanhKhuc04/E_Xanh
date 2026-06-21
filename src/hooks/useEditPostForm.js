import { useState } from 'react'
import { createPost, checkRecentPostRateLimit } from '../services/postService'
import { getUserSafeError } from '../utils/logger'
import { extractPlainTextFromBlocks } from '../utils/postBlocks'

// Sub-hooks
import { useComposerState } from './composer/useComposerState'
import { useComposerDraft, readDraft } from './composer/useComposerDraft'
import { useComposerAuth } from './composer/useComposerAuth'
import { useComposerMedia } from './composer/useComposerMedia'

// Constants & Utils
import {
  POST_COOLDOWN_MS,
  TITLE_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
  CONTENT_MAX_LENGTH,
  TAGS_MAX_COUNT,
  DRAFT_STORAGE_KEY,
} from './composer/constants'
import { getCooldownStorageKey, parseTags } from './composer/utils'
import { getComposerStatus } from './composer/validation'
import { MARKDOWN_IMAGE_LIMIT } from '../utils/markdown'

export function usePostComposerForm({
  defaultType = '',
  onSuccess,
}) {
  const [initialDraft] = useState(() => readDraft())

  // 1. Auth & Cooldown
  const {
    authLoading,
    user,
    profile,
    cooldownRemaining,
    setCooldownUntil,
    setCooldownRemaining,
  } = useComposerAuth()

  // 2. Draft Meta state (needed by Draft and State hooks)
  const [draftMeta, setDraftMeta] = useState(initialDraft ? 'Đã khôi phục bản nháp trước đó.' : 'Chưa có thay đổi')

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
    resetForm,
    handleChange,
    handlePreview,
    closePreview,
  } = useComposerState(defaultType, initialDraft, setDraftMeta)

  // 4. Draft Handling
  const {
    lastSavedAt,
    handleSaveDraft,
    clearDraft,
  } = useComposerDraft({
    form,
    isSubmitting,
    resetForm,
    defaultType,
    setInfoMessage,
    setErrorMessage,
    setSuccessMessage,
    initialDraft,
    draftMeta,
    setDraftMeta,
  })

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

  const isAutosaving = draftMeta === 'Đang lưu...'
  const autosaveFailed = draftMeta === 'Không thể tự lưu nháp lúc này.'
  const isFormReady = Object.keys(validation.errors).length === 0

  const composerStatus = getComposerStatus({
    form,
    validationErrors: validation.errors,
    isAutosaving,
    autosaveFailed,
    lastSavedAt,
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

    if (cooldownRemaining > 0) {
      const message = 'Bạn đăng hơi nhanh rồi. Vui lòng thử lại sau ít phút để tránh spam.'
      setErrorMessage(message)
      setSubmitState('error')
      setSubmitError(message)
      return { data: null, error: new Error('Cooldown active') }
    }

    if (!user) {
      const message = 'Vui lòng đăng nhập để đăng bài.'
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

    const rateLimit = await checkRecentPostRateLimit(user.id)
    if (rateLimit.error) {
      const message = 'Không thể kiểm tra tần suất đăng bài lúc này. Bạn thử lại sau ít phút nhé.'
      setErrorMessage(message)
      setSubmitState('error')
      setSubmitError(message)
      return { data: null, error: rateLimit.error }
    }

    if (!rateLimit.allowed) {
      const message = 'Bạn đăng hơi nhanh rồi. Vui lòng thử lại sau ít phút để tránh spam.'
      setErrorMessage(message)
      setSubmitState('error')
      setSubmitError(message)
      return { data: null, error: new Error('Rate limit exceeded') }
    }

    setIsSubmitting(true)
    setSubmitState('submitting')
    const blocksContent = extractPlainTextFromBlocks(form.content_blocks, form.content)

    const result = await createPost({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      content: blocksContent.trim(),
      content_blocks: form.content_blocks,
      tags: parseTags(form.tags).join(', '),
    })

    if (result.error) {
      const safeMessage = getUserSafeError(result.error, 'Hiện chưa thể gửi bài. Bạn thử lại sau ít phút nhé.')
      setErrorMessage(`Lỗi đăng bài: ${safeMessage}`)
      setSubmitState('error')
      setSubmitError(safeMessage)
      setIsSubmitting(false)
      return result
    }

    const nextCooldownUntil = Date.now() + POST_COOLDOWN_MS
    localStorage.setItem(getCooldownStorageKey(user.id), String(nextCooldownUntil))
    setCooldownUntil(nextCooldownUntil)
    setCooldownRemaining(Math.ceil(POST_COOLDOWN_MS / 1000))
    localStorage.removeItem(DRAFT_STORAGE_KEY)
    resetForm(defaultType, { preserveFeedback: true })
    setSuccessMessage('Bài viết đã được gửi thành công và đang chờ duyệt!')
    setSubmitState('success')
    setSubmitError('')
    setIsSubmitting(false)

    if (onSuccess) {
      await onSuccess({
        post: result.data,
        profile,
        message: 'Bài viết đã được gửi thành công và đang chờ duyệt!',
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
    cooldownRemaining,
    draftMeta,
    lastSavedAt,
    submitState,
    submitError,
    isAutosaving,
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
    handleSaveDraft,
    clearDraft,
    handlePreview,
    closePreview,
    handleInlineImageUpload,
    handleCropApply,
    handleCropClose,
    handleSubmit,
    resetForm,
  }
}

