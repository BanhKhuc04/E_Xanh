import { useEffect, useRef, useState } from 'react'
import {
  createPost,
  checkRecentPostRateLimit,
  uploadPostInlineImage,
} from '../services/postService'
import { getCurrentSession, getCurrentUserProfile } from '../services/authService'
import { getUserSafeError } from '../utils/logger'
import { countMarkdownImages, MARKDOWN_IMAGE_LIMIT } from '../utils/markdown'

const DRAFT_STORAGE_KEY = 'exanh_draft_post'
const POST_COOLDOWN_MS = 30 * 1000
const TITLE_MIN_LENGTH = 10
const TITLE_MAX_LENGTH = 120
const DESCRIPTION_MAX_LENGTH = 180
const CONTENT_MIN_LENGTH = 80
const CONTENT_MAX_LENGTH = 4000
const TAGS_MAX_COUNT = 5
const TAGS_SEPARATOR = ','

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
    content_blocks: [],
    tags: '',
  }
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

function extractPlainTextFromBlocks(blocks) {
  if (!Array.isArray(blocks)) return ''
  return blocks.map(block => {
    if (block.type === 'list' && Array.isArray(block.items)) {
      return block.items.join('\n')
    }
    return block.content || block.label || block.alt || ''
  }).join('\n\n')
}

function validatePostForm(form) {
  const errors = {}
  const trimmedTitle = form.title.trim()
  const trimmedDescription = form.description.trim()
  const tags = parseTags(form.tags)
  
  const blocksContent = form.content_blocks && form.content_blocks.length > 0 
    ? extractPlainTextFromBlocks(form.content_blocks) 
    : form.content
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

  if (!trimmedContent) {
    errors.content = 'Hãy viết nội dung bài chia sẻ trước khi gửi duyệt.'
  } else if (trimmedContent.length < CONTENT_MIN_LENGTH) {
    errors.content = `Nội dung cần ít nhất ${CONTENT_MIN_LENGTH} ký tự để đủ ý và hạn chế spam.`
  } else if (trimmedContent.length > CONTENT_MAX_LENGTH) {
    errors.content = `Nội dung đang vượt quá ${CONTENT_MAX_LENGTH} ký tự. Bạn hãy rút gọn bớt nhé.`
  }

  if (tags.length > TAGS_MAX_COUNT) {
    errors.tags = `Tối đa ${TAGS_MAX_COUNT} tags, phân tách bằng dấu phẩy.`
  }

  return { errors }
}

export function usePostComposerForm({
  defaultType = '',
  onSuccess,
}) {
  const currentPreviewUrlRef = useRef('')
  const initialDraftRef = useRef(readDraft())
  const [form, setForm] = useState(() => {
    const draft = initialDraftRef.current
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
    initialDraftRef.current ? 'Đã tự động khôi phục bản nháp chưa gửi của bạn.' : '',
  )
  const [draftMeta, setDraftMeta] = useState(
    initialDraftRef.current ? 'Đã khôi phục bản nháp trước đó.' : 'Nháp sẽ tự động lưu sau vài giây.'
  )
  const [previewHighlight, setPreviewHighlight] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [cooldownUntil, setCooldownUntil] = useState(0)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const [isUploadingInlineImage, setIsUploadingInlineImage] = useState(false)

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
      } else {
        setUser(null)
        setProfile(null)
        setCooldownUntil(0)
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

  useEffect(() => {
    if (!cooldownUntil || cooldownUntil <= Date.now()) {
      setCooldownRemaining(0)
      return undefined
    }

    setCooldownRemaining(Math.ceil((cooldownUntil - Date.now()) / 1000))

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
    const hasDraftContent = [
      form.title,
      form.description,
      form.content,
      form.tags,
    ].some((item) => String(item || '').trim().length > 0)

    if (!hasDraftContent || isSubmitting) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({
            title: form.title,
            type: form.type,
            category: form.category,
            description: form.description,
            content: form.content,
            content_blocks: form.content_blocks,
            tags: form.tags,
          })
        )
        setDraftMeta(
          `Tự động lưu lúc ${new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}`
        )
      } catch {
        setDraftMeta('Không thể tự lưu nháp lúc này.')
      }
    }, 4000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [form, isSubmitting])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isSubmitting) return
      
      const hasDraftContent = [
        form.title,
        form.description,
        form.content,
        form.tags,
      ].some((item) => String(item || '').trim().length > 0)
      
      if (hasDraftContent) {
        try {
          localStorage.setItem(
            DRAFT_STORAGE_KEY,
            JSON.stringify({
              title: form.title,
              type: form.type,
              category: form.category,
              description: form.description,
              content: form.content,
              tags: form.tags,
            })
          )
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
    setDraftMeta('Nháp sẽ tự động lưu sau vài giây.')
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

    setForm((current) => ({
      ...current,
      [field]: normalizedValue,
    }))

    setFieldErrors((current) => {
      if (!current[field]) return current
      const nextErrors = { ...current }
      delete nextErrors[field]
      return nextErrors
    })
  }

  function handleCoverChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors((current) => ({
        ...current,
        coverFile: 'Ảnh bìa đang vượt quá 5MB. Hãy chọn file nhẹ hơn để tải lên nhanh hơn.',
      }))
      return
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setFieldErrors((current) => ({
        ...current,
        coverFile: 'Ảnh bìa chỉ nhận JPG, PNG hoặc WEBP.',
      }))
      return
    }

    const previewUrl = URL.createObjectURL(file)

    setForm((current) => {
      if (current.coverPreview) {
        URL.revokeObjectURL(current.coverPreview)
      }

      return {
        ...current,
        coverName: file.name,
        coverFile: file,
        coverPreview: previewUrl,
      }
    })

    setFieldErrors((current) => {
      if (!current.coverFile) return current
      const nextErrors = { ...current }
      delete nextErrors.coverFile
      return nextErrors
    })
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

  function handleSaveDraft() {
    setSuccessMessage('')

    try {
      const draftToSave = {
        title: form.title,
        type: form.type,
        category: form.category,
        description: form.description,
        content: form.content,
        content_blocks: form.content_blocks,
        tags: form.tags,
      }
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftToSave))
      setInfoMessage('Đã lưu nháp')
      setDraftMeta(
        `Lưu nháp thủ công lúc ${new Date().toLocaleTimeString('vi-VN', {
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

    const blocksContent = form.content_blocks && form.content_blocks.length > 0 
      ? extractPlainTextFromBlocks(form.content_blocks) 
      : form.content
      
    if (countMarkdownImages(blocksContent) >= MARKDOWN_IMAGE_LIMIT) {
      const error = new Error(`Bạn chỉ có thể chèn tối đa ${MARKDOWN_IMAGE_LIMIT} ảnh trong nội dung bài viết.`)
      setFieldErrors((current) => ({
        ...current,
        content: error.message,
      }))
      throw error
    }

    setIsUploadingInlineImage(true)

    try {
      const { publicUrl, error } = await uploadPostInlineImage(file, user.id)
      if (error) {
        throw error
      }

      return publicUrl
    } catch (error) {
      const safeMessage = getUserSafeError(error, 'Không thể tải ảnh vào nội dung bài viết lúc này.')
      setErrorMessage(safeMessage)
      setFieldErrors((current) => ({
        ...current,
        content: safeMessage,
      }))
      throw new Error(safeMessage)
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
    setFieldErrors({})

    if (isSubmitting) {
      return { data: null, error: new Error('Submission in progress') }
    }

    if (cooldownRemaining > 0) {
      setErrorMessage(`Bạn đăng hơi nhanh rồi. Vui lòng thử lại sau ít phút để tránh spam.`)
      return { data: null, error: new Error('Cooldown active') }
    }

    if (!user) {
      setErrorMessage('Vui lòng đăng nhập để đăng bài.')
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
      setErrorMessage('Không thể kiểm tra tần suất đăng bài lúc này. Bạn thử lại sau ít phút nhé.')
      return { data: null, error: rateLimit.error }
    }

    if (!rateLimit.allowed) {
      setErrorMessage('Bạn đăng hơi nhanh rồi. Vui lòng thử lại sau ít phút để tránh spam.')
      return { data: null, error: new Error('Rate limit exceeded') }
    }

    setIsSubmitting(true)
    const blocksContent = form.content_blocks && form.content_blocks.length > 0 
      ? extractPlainTextFromBlocks(form.content_blocks) 
      : form.content
      
    const result = await createPost({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      content: blocksContent.trim(),
      content_blocks: form.content_blocks,
      tags: parseTags(form.tags).join(', '),
    })

    if (result.error) {
      setErrorMessage(`Lỗi đăng bài: ${getUserSafeError(result.error, 'Hiện chưa thể gửi bài. Bạn thử lại sau ít phút nhé.')}`)
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
    isUploadingInlineImage,
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
    handleSubmit,
    resetForm,
  }
}
