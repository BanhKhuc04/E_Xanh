import { useEffect, useRef, useState } from 'react'
import { createPost } from '../services/postService'
import { getCurrentSession, getCurrentUserProfile } from '../services/authService'

const DRAFT_STORAGE_KEY = 'exanh_draft_post'

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
      tags: draft.tags || '',
    }
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState(
    initialDraftRef.current ? 'Đã tự động khôi phục bản nháp chưa gửi của bạn.' : '',
  )
  const [previewHighlight, setPreviewHighlight] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

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
      } else {
        setUser(null)
        setProfile(null)
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

  function resetForm(nextType = defaultType) {
    setForm((current) => {
      if (current.coverPreview) {
        URL.revokeObjectURL(current.coverPreview)
      }
      return buildInitialForm(nextType)
    })
    setErrorMessage('')
    setSuccessMessage('')
    setInfoMessage('')
    setPreviewHighlight(false)
  }

  function handleChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
    setErrorMessage('')
  }

  function handleCoverChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Kích thước ảnh vượt quá 5MB. Vui lòng chọn ảnh nhẹ hơn.')
      return
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Định dạng ảnh không hợp lệ. Chỉ hỗ trợ JPG, PNG, WEBP.')
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

    setErrorMessage('')
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
  }

  function handleSaveDraft() {
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const draftToSave = {
        title: form.title,
        type: form.type,
        category: form.category,
        description: form.description,
        content: form.content,
        tags: form.tags,
      }
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftToSave))
      setInfoMessage('Đã lưu nháp')
    } catch {
      setErrorMessage('Không thể lưu bản nháp lúc này.')
    }
  }

  function handlePreview() {
    setErrorMessage('')
    setSuccessMessage('')
    setInfoMessage('Khung xem trước đã được cập nhật theo nội dung bạn đang nhập.')
    setPreviewHighlight(true)
  }

  async function handleSubmit(event) {
    event?.preventDefault?.()
    setInfoMessage('')
    setPreviewHighlight(false)
    setErrorMessage('')
    setSuccessMessage('')

    if (!user) {
      setErrorMessage('Vui lòng đăng nhập để đăng bài.')
      return { data: null, error: new Error('Not authenticated') }
    }

    if (!form.title.trim()) {
      setErrorMessage('Vui lòng nhập tiêu đề')
      return { data: null, error: new Error('Missing title') }
    }

    if (!form.content.trim()) {
      setErrorMessage('Vui lòng nhập nội dung')
      return { data: null, error: new Error('Missing content') }
    }

    if (form.content.trim().length < 50) {
      setErrorMessage('Nội dung bài viết cần tối thiểu 50 ký tự.')
      return { data: null, error: new Error('Content too short') }
    }

    setIsSubmitting(true)
    const result = await createPost(form)

    if (result.error) {
      setErrorMessage(`Lỗi đăng bài: ${result.error.message}`)
      setIsSubmitting(false)
      return result
    }

    localStorage.removeItem(DRAFT_STORAGE_KEY)
    setSuccessMessage('Bài viết đã được gửi thành công và đang chờ duyệt!')
    resetForm(defaultType)
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
    previewHighlight,
    isSubmitting,
    authLoading,
    user,
    profile,
    handleChange,
    handleCoverChange,
    removeCover,
    handleSaveDraft,
    handlePreview,
    handleSubmit,
    resetForm,
  }
}
