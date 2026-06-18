import { useEffect, useMemo, useRef, useState } from 'react'
import {
  createPost,
  checkRecentPostRateLimit,
  uploadPostInlineImage,
} from '../services/postService'
import { getCurrentSession, getCurrentUserProfile } from '../services/authService'
import { getUserSafeError } from '../utils/logger'
import { countMarkdownImages, MARKDOWN_IMAGE_LIMIT } from '../utils/markdown'
import { countImageBlocks, createTextBlock, extractPlainTextFromBlocks } from '../utils/postBlocks'
import { DEFAULT_POST_IMAGE_ASPECT } from '../utils/postImageRatios'

const DRAFT_STORAGE_KEY = 'exanh_draft_post'
const POST_COOLDOWN_MS = 30 * 1000
const TITLE_MIN_LENGTH = 10
const TITLE_MAX_LENGTH = 120
const DESCRIPTION_MAX_LENGTH = 180
const CONTENT_MIN_LENGTH = 80
const CONTENT_MAX_LENGTH = 4000
const TAGS_MAX_COUNT = 5
const TAGS_SEPARATOR = ','
const MAX_POST_IMAGE_SIZE = 5 * 1024 * 1024
const POST_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
const AUTOSAVE_DEBOUNCE_MS = 1500

function buildInitialForm(defaultType = '') {
  return {
    title: '',
    type: defaultType || '',
    category: '',
    description: '',
    coverName: '',
    coverFile: null,
    coverPreview: '',
    content: '',
    content_blocks: [createTextBlock()],
    tags: '',
  }
}

function validateSelectedPostImage(file, { kind = 'cover' } = {}) {
  if (!file) {
    return 'Không tìm thấy file ảnh để xử lý.'
  }

  if (file.size > MAX_POST_IMAGE_SIZE) {
    return kind === 'inline'
      ? 'Ảnh trong nội dung không được vượt quá 5MB.'
      : 'Ảnh bìa đang vượt quá 5MB. Hãy chọn file nhẹ hơn để tải lên nhanh hơn.'
  }

  if (!POST_IMAGE_TYPES.includes(file.type)) {
    return kind === 'inline'
      ? 'Ảnh trong nội dung chỉ nhận JPG, PNG hoặc WEBP.'
      : 'Ảnh bìa chỉ nhận JPG, PNG hoặc WEBP.'
  }

  return ''
}

function buildDraftPayload(form) {
  return {
    title: form.title,
    type: form.type,
    category: form.category,
    description: form.description,
    content: form.content,
    content_blocks: form.content_blocks,
    tags: form.tags,
  }
}

function hasDraftPayloadContent(payload) {
  return [
    payload.title,
    payload.type,
    payload.category,
    payload.description,
    extractPlainTextFromBlocks(payload.content_blocks, payload.content),
    payload.tags,
  ].some((item) => String(item || '').trim().length > 0)
}

function readDraft() {
  try {
    const draftStr = localStorage.getItem(DRAFT_STORAGE_KEY)
    return draftStr ? JSON.parse(draftStr) : null
  } catch {
    console.warn('Lỗi khôi phục bản nháp')
    return null
  }
}

function getCooldownStorageKey(userId) {
  return `exanh_post_cooldown_${userId}`
}

function parseTags(tags = '') {
  return tags
    .split(TAGS_SEPARATOR)
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function validatePostForm(form) {
  const errors = {}
  const trimmedTitle = form.title.trim()
  const trimmedDescription = form.description.trim()
  const tags = parseTags(form.tags)
  const imageCount = countImageBlocks(form.content_blocks)
  const blocksContent = extractPlainTextFromBlocks(form.content_blocks, form.content)
  const trimmedContent = (blocksContent || '').trim()

  if (!trimmedTitle) {
    errors.title = 'Tiêu đề là phần đầu tiên người đọc nhìn thấy. Hãy nhập một tiêu đề ngắn gọn và rõ ý.'
  } else if (trimmedTitle.length < TITLE_MIN_LENGTH) {
    errors.title = `Tiêu đề cần tối thiểu ${TITLE_MIN_LENGTH} ký tự.`
  } else if (trimmedTitle.length > TITLE_MAX_LENGTH) {
    errors.title = `Tiêu đề chỉ nên tối đa ${TITLE_MAX_LENGTH} ký tự để dễ đọc hơn.`
  }

  if (trimmedDescription.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Mô tả ngắn nên gói gọn trong ${DESCRIPTION_MAX_LENGTH} ký tự.`
  }

  if (!form.type.trim()) {
    errors.type = 'Hãy chọn loại bài viết để hệ thống gợi ý đúng ngữ cảnh hiển thị.'
  }

  if (!form.category.trim()) {
    errors.category = 'Hãy chọn danh mục phù hợp để người đọc dễ tìm thấy bài viết hơn.'
  }

  if (imageCount > MARKDOWN_IMAGE_LIMIT) {
    errors.content = `Mỗi bài viết chỉ được thêm tối đa ${MARKDOWN_IMAGE_LIMIT} ảnh minh họa.`
  }

  if (!trimmedContent && imageCount === 0) {
    errors.content = 'Hãy viết nội dung bài chia sẻ trước khi gửi duyệt.'
  } else if (trimmedContent.length > 0 && trimmedContent.length < CONTENT_MIN_LENGTH && imageCount === 0) {
    errors.content = `Nội dung cần ít nhất ${CONTENT_MIN_LENGTH} ký tự để đủ ý và hạn chế spam.`
  } else if (trimmedContent.length > CONTENT_MAX_LENGTH) {
    errors.content = `Nội dung đang vượt quá ${CONTENT_MAX_LENGTH} ký tự. Bạn hãy rút gọn bớt nhé.`
  }

  if (tags.length > TAGS_MAX_COUNT) {
    errors.tags = `Tối đa ${TAGS_MAX_COUNT} tags, phân tách bằng dấu phẩy.`
  }

  return { errors }
}

function formatSavedTime(dateValue) {
  if (!dateValue) return ''

  return new Date(dateValue).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getPrioritizedChecklist(form, validationErrors) {
  const title = form.title.trim()
  const category = form.category.trim()
  const plainContent = extractPlainTextFromBlocks(form.content_blocks, form.content).trim()
  const imageCount = countImageBlocks(form.content_blocks)
  const checklist = []

  if (!title) {
    checklist.push('Bạn chưa điền tiêu đề bài viết.')
  } else if (validationErrors.title) {
    checklist.push(validationErrors.title)
  }

  if (!category) {
    checklist.push('Bạn chưa chọn danh mục.')
  } else if (validationErrors.category) {
    checklist.push(validationErrors.category)
  }

  if (!plainContent && imageCount === 0) {
    checklist.push('Bạn chưa nhập nội dung bài viết.')
  } else if (validationErrors.content) {
    checklist.push(validationErrors.content)
  }

  if (!form.coverPreview && !form.coverFile && checklist.length < 2) {
    checklist.push('Bạn nên thêm ảnh bìa để bài viết nổi bật và dễ thu hút hơn.')
  }

  if (checklist.length < 2 && validationErrors.type) {
    checklist.push(validationErrors.type)
  }

  if (checklist.length < 2 && validationErrors.tags) {
    checklist.push(validationErrors.tags)
  }

  return checklist.slice(0, 2)
}

function getComposerStatus({
  form,
  validationErrors,
  isAutosaving,
  autosaveFailed,
  lastSavedAt,
  isSubmitting,
  submitState,
  submitError,
  isFormReady,
}) {
  const checklist = getPrioritizedChecklist(form, validationErrors)
  const savedAtLabel = formatSavedTime(lastSavedAt)

  if (isSubmitting) {
    return {
      tone: 'submitting',
      badge: 'Đang gửi',
      title: 'Trạng thái bài viết',
      message: 'Đang gửi bài viết lên hệ thống...',
    }
  }

  if (submitState === 'success') {
    return {
      tone: 'success',
      badge: 'Thành công',
      title: 'Trạng thái bài viết',
      message: 'Đã gửi bài thành công, đang chờ quản trị viên duyệt.',
    }
  }

  if (submitState === 'error') {
    return {
      tone: 'error',
      badge: 'Lỗi',
      title: 'Trạng thái bài viết',
      message: submitError || 'Gửi bài thất bại. Vui lòng thử lại.',
    }
  }

  if (isAutosaving) {
    return {
      tone: 'saving',
      badge: 'Đang lưu',
      title: 'Trạng thái bài viết',
      message: 'Đang tự động lưu nháp...',
    }
  }

  if (!isFormReady) {
    return {
      tone: autosaveFailed ? 'error' : 'warning',
      badge: autosaveFailed ? 'Cần kiểm tra' : 'Thiếu thông tin',
      title: 'Trạng thái bài viết',
      message: autosaveFailed
        ? 'Không thể tự động lưu nháp lúc này. Bạn nên kiểm tra lại trước khi gửi.'
        : 'Bài viết chưa đủ điều kiện để gửi duyệt.',
      checklist,
      meta: savedAtLabel ? `Nháp gần nhất đã lưu lúc ${savedAtLabel}.` : '',
    }
  }

  return {
    tone: 'ready',
    badge: 'Sẵn sàng gửi',
    title: 'Trạng thái bài viết',
    message: 'Bài viết đã sẵn sàng để gửi duyệt.',
    meta: savedAtLabel ? `Đã tự động lưu lúc ${savedAtLabel}.` : '',
  }
}

export function usePostComposerForm({
  defaultType = '',
  onSuccess,
}) {
  const currentPreviewUrlRef = useRef('')
  const lastSavedDraftRef = useRef('')
  const cropResolveRef = useRef(null)
  const cropRejectRef = useRef(null)
  const [initialDraft] = useState(() => readDraft())
  const [form, setForm] = useState(() => {
    const draft = initialDraft
    const base = buildInitialForm(defaultType)

    if (!draft) return base

    return {
      ...base,
      title: draft.title || '',
      type: draft.type || base.type,
      category: draft.category || '',
      description: draft.description || '',
      content: draft.content || '',
      content_blocks: draft.content_blocks || [],
      tags: draft.tags || '',
    }
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState(
    initialDraft ? 'Đã tự động khôi phục bản nháp chưa gửi của bạn.' : '',
  )
  const [draftMeta, setDraftMeta] = useState(initialDraft ? 'Đã khôi phục bản nháp trước đó.' : 'Chưa có thay đổi')
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const [previewHighlight, setPreviewHighlight] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState('idle')
  const [submitError, setSubmitError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [cooldownUntil, setCooldownUntil] = useState(0)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const [isUploadingInlineImage, setIsUploadingInlineImage] = useState(false)
  const [cropState, setCropState] = useState({
    isOpen: false,
    image: '',
    file: null,
    aspectKey: DEFAULT_POST_IMAGE_ASPECT,
    title: 'Cắt ảnh',
    confirmLabel: 'Áp dụng',
    mode: 'cover',
  })
  const validation = useMemo(() => validatePostForm(form), [form])
  const isAutosaving = draftMeta === 'Đang lưu...'
  const autosaveFailed = draftMeta === 'Không thể tự lưu nháp lúc này.'
  const isFormReady = Object.keys(validation.errors).length === 0
  const composerStatus = useMemo(
    () =>
      getComposerStatus({
        form,
        validationErrors: validation.errors,
        isAutosaving,
        autosaveFailed,
        lastSavedAt,
        isSubmitting,
        submitState,
        submitError,
        isFormReady,
      }),
    [
      autosaveFailed,
      form,
      isAutosaving,
      isFormReady,
      isSubmitting,
      lastSavedAt,
      submitError,
      submitState,
      validation.errors,
    ],
  )

  useEffect(() => {
    lastSavedDraftRef.current = initialDraft ? JSON.stringify(initialDraft) : ''
  }, [initialDraft])

  useEffect(() => {
    let isMounted = true

    async function loadAuth() {
      const session = await getCurrentSession()
      if (!isMounted) return

      if (session?.user) {
        const nextProfile = await getCurrentUserProfile(session.user.id)
        if (!isMounted) return
        setUser(session.user)
        setProfile(nextProfile)
        const savedCooldown = Number(localStorage.getItem(getCooldownStorageKey(session.user.id)) || 0)
        setCooldownUntil(savedCooldown > Date.now() ? savedCooldown : 0)
        setCooldownRemaining(savedCooldown > Date.now() ? Math.ceil((savedCooldown - Date.now()) / 1000) : 0)
      } else {
        setUser(null)
        setProfile(null)
        setCooldownUntil(0)
        setCooldownRemaining(0)
      }

      setAuthLoading(false)
    }

    loadAuth()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    currentPreviewUrlRef.current = form.coverPreview
  }, [form.coverPreview])

  useEffect(() => {
    if (!successMessage && !infoMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage('')
      setInfoMessage('')
      setPreviewHighlight(false)
    }, 4000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [infoMessage, successMessage])

  useEffect(() => () => {
    if (currentPreviewUrlRef.current) {
      URL.revokeObjectURL(currentPreviewUrlRef.current)
    }
  }, [])

  useEffect(() => () => {
    if (cropState.image) {
      URL.revokeObjectURL(cropState.image)
    }
  }, [cropState.image])

  useEffect(() => {
    if (!cooldownUntil || cooldownUntil <= Date.now()) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000))
      setCooldownRemaining(remaining)

      if (remaining <= 0) {
        window.clearInterval(intervalId)
      }
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [cooldownUntil])

  useEffect(() => {
    const draftPayload = buildDraftPayload(form)
    const nextSnapshot = JSON.stringify(draftPayload)
    const hasDraftContent = hasDraftPayloadContent(draftPayload)

    if (isSubmitting) {
      return undefined
    }

    if (!hasDraftContent) return undefined

    if (nextSnapshot === lastSavedDraftRef.current) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, nextSnapshot)
        lastSavedDraftRef.current = nextSnapshot
        const savedAt = Date.now()
        setLastSavedAt(savedAt)
        setDraftMeta(
          `Đã tự động lưu lúc ${new Date(savedAt).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}`
        )
      } catch {
        setDraftMeta('Không thể tự lưu nháp lúc này.')
      }
    }, AUTOSAVE_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [form, isSubmitting])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isSubmitting) return
      
      const draftPayload = buildDraftPayload(form)
      const hasDraftContent = hasDraftPayloadContent(draftPayload)
      
      if (hasDraftContent) {
        try {
          const nextSnapshot = JSON.stringify(draftPayload)
          localStorage.setItem(DRAFT_STORAGE_KEY, nextSnapshot)
          lastSavedDraftRef.current = nextSnapshot
        } catch {
          // ignore error on unload
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [form, isSubmitting])

  function resetForm(nextType = defaultType, options = {}) {
    const { preserveFeedback = false } = options

    setForm((current) => {
      if (current.coverPreview) {
        URL.revokeObjectURL(current.coverPreview)
      }
      return buildInitialForm(nextType)
    })
    setErrorMessage('')
    if (!preserveFeedback) {
      setSuccessMessage('')
      setInfoMessage('')
    }
    setPreviewHighlight(false)
    setFieldErrors({})
    setLastSavedAt(null)
    setSubmitState('idle')
    setSubmitError('')
    lastSavedDraftRef.current = ''
    setDraftMeta('Chưa có thay đổi')
  }

  function handleChange(field, value) {
    const normalizedValue =
      field === 'title'
        ? value.slice(0, TITLE_MAX_LENGTH)
        : field === 'description'
          ? value.slice(0, DESCRIPTION_MAX_LENGTH)
          : field === 'content'
            ? value.slice(0, CONTENT_MAX_LENGTH)
            : value

    setForm((current) => {
      const nextForm = {
        ...current,
        [field]: normalizedValue,
      }
      const nextDraftPayload = buildDraftPayload(nextForm)
      setDraftMeta(hasDraftPayloadContent(nextDraftPayload) ? 'Đang lưu...' : 'Chưa có thay đổi')
      return nextForm
    })

    setSubmitState('idle')
    setSubmitError('')

    setFieldErrors((current) => {
      if (!current[field]) return current
      const nextErrors = { ...current }
      delete nextErrors[field]
      return nextErrors
    })
  }

  function closeCropModal() {
    setCropState((current) => {
      if (current.image) {
        URL.revokeObjectURL(current.image)
      }

      return {
        isOpen: false,
        image: '',
        file: null,
        aspectKey: DEFAULT_POST_IMAGE_ASPECT,
        title: 'Cắt ảnh',
        confirmLabel: 'Áp dụng',
        mode: 'cover',
      }
    })
  }

  function rejectPendingCrop(message = 'Đã hủy chọn ảnh.') {
    const reject = cropRejectRef.current
    cropResolveRef.current = null
    cropRejectRef.current = null
    if (reject) {
      reject(new Error(message))
    }
  }

  function openCropModalForFile(file, options = {}) {
    return new Promise((resolve, reject) => {
      const previewUrl = URL.createObjectURL(file)

      cropResolveRef.current = resolve
      cropRejectRef.current = reject
      setCropState({
        isOpen: true,
        image: previewUrl,
        file,
        aspectKey: options.aspectKey || DEFAULT_POST_IMAGE_ASPECT,
        title: options.title || 'Cắt ảnh bài viết',
        confirmLabel: options.confirmLabel || 'Áp dụng',
        mode: options.mode || 'cover',
      })
    })
  }

  async function handleCropApply({ file, aspectKey }) {
    const resolve = cropResolveRef.current
    cropResolveRef.current = null
    cropRejectRef.current = null
    closeCropModal()
    await resolve?.({ file, aspectKey })
  }

  function handleCropClose() {
    closeCropModal()
    rejectPendingCrop()
  }

  async function handleCoverChange(event) {
    const file = event.target.files?.[0]
    if (event?.target) {
      event.target.value = ''
    }
    if (!file) return

    const validationMessage = validateSelectedPostImage(file, { kind: 'cover' })
    if (validationMessage) {
      setFieldErrors((current) => ({
        ...current,
        coverFile: validationMessage,
      }))
      return
    }

    try {
      const cropped = await openCropModalForFile(file, {
        mode: 'cover',
        title: 'Cắt ảnh bìa bài viết',
        aspectKey: DEFAULT_POST_IMAGE_ASPECT,
      })
      const previewUrl = URL.createObjectURL(cropped.file)

      setForm((current) => {
        if (current.coverPreview) {
          URL.revokeObjectURL(current.coverPreview)
        }

        return {
          ...current,
          coverName: cropped.file.name,
          coverFile: cropped.file,
          coverPreview: previewUrl,
        }
      })

      setFieldErrors((current) => {
        if (!current.coverFile) return current
        const nextErrors = { ...current }
        delete nextErrors.coverFile
        return nextErrors
      })
    } catch {
      // Người dùng đóng modal crop thì không cần báo lỗi.
    }
  }

  function removeCover() {
    setForm((current) => {
      if (current.coverPreview) {
        URL.revokeObjectURL(current.coverPreview)
      }

      return {
        ...current,
        coverName: '',
        coverFile: null,
        coverPreview: '',
      }
    })

    setFieldErrors((current) => {
      if (!current.coverFile) return current
      const nextErrors = { ...current }
      delete nextErrors.coverFile
      return nextErrors
    })
  }

  function handleSaveDraft(options = {}) {
    const { silent = false, label = 'Đã tự động lưu' } = options
    setSuccessMessage('')

    try {
      const draftToSave = buildDraftPayload(form)
      if (!hasDraftPayloadContent(draftToSave)) {
        localStorage.removeItem(DRAFT_STORAGE_KEY)
        lastSavedDraftRef.current = ''
        setDraftMeta('Chưa có thay đổi')
        return
      }

      const nextSnapshot = JSON.stringify(draftToSave)
      localStorage.setItem(DRAFT_STORAGE_KEY, nextSnapshot)
      lastSavedDraftRef.current = nextSnapshot
      const savedAt = Date.now()
      setLastSavedAt(savedAt)
      if (!silent) {
        setInfoMessage('Đã lưu nháp')
      }
      setDraftMeta(
        `${label} lúc ${new Date(savedAt).toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        })}`
      )
    } catch {
      setErrorMessage('Không thể lưu bản nháp lúc này.')
    }
  }

  function clearDraft() {
    localStorage.removeItem(DRAFT_STORAGE_KEY)
    lastSavedDraftRef.current = ''
    resetForm(defaultType)
    setInfoMessage('Đã xóa bản nháp cũ. Bạn có thể bắt đầu lại từ đầu.')
  }

  function handlePreview() {
    setSuccessMessage('')
    setInfoMessage('')
    setPreviewHighlight(true)
  }

  function closePreview() {
    setPreviewHighlight(false)
  }

  async function handleInlineImageUpload(file) {
    if (!user?.id) {
      const error = new Error('Bạn cần đăng nhập để chèn ảnh vào nội dung bài viết.')
      setErrorMessage(error.message)
      throw error
    }

    const inlineImageCount = Array.isArray(form.content_blocks) && form.content_blocks.length > 0
      ? countImageBlocks(form.content_blocks)
      : countMarkdownImages(form.content)

    if (inlineImageCount >= MARKDOWN_IMAGE_LIMIT) {
      const error = new Error(`Bạn chỉ có thể chèn tối đa ${MARKDOWN_IMAGE_LIMIT} ảnh trong nội dung bài viết.`)
      setFieldErrors((current) => ({
        ...current,
        content: error.message,
      }))
      throw error
    }

    const validationMessage = validateSelectedPostImage(file, { kind: 'inline' })
    if (validationMessage) {
      setFieldErrors((current) => ({
        ...current,
        content: validationMessage,
      }))
      throw new Error(validationMessage)
    }

    const cropped = await openCropModalForFile(file, {
      mode: 'inline',
      title: 'Cắt ảnh chèn trong bài viết',
      aspectKey: DEFAULT_POST_IMAGE_ASPECT,
      confirmLabel: 'Cắt và tải ảnh',
    })
    const croppedFile = cropped.file
    const inlineAspectKey = cropped.aspectKey || DEFAULT_POST_IMAGE_ASPECT

    setIsUploadingInlineImage(true)

    try {
      const { publicUrl, error } = await uploadPostInlineImage(croppedFile, user.id)
      if (error) {
        throw error
      }

      return {
        url: publicUrl,
        aspectKey: inlineAspectKey,
      }
    } catch (error) {
      const safeMessage = getUserSafeError(error, 'Không thể tải ảnh vào nội dung bài viết lúc này.')
      setErrorMessage(safeMessage)
      setFieldErrors((current) => ({
        ...current,
        content: safeMessage,
      }))
      throw new Error(safeMessage, { cause: error })
    } finally {
      setIsUploadingInlineImage(false)
    }
  }

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

    // Frontend chỉ là lớp chặn nhẹ chống spam; vẫn cần rate limit thật ở Supabase/database.
    const { errors } = validatePostForm(form)
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
