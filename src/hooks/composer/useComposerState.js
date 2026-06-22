import { useState, useRef, useEffect, useMemo } from 'react'
import { buildInitialForm, buildDraftPayload, hasDraftPayloadContent } from './utils'
import {
  TITLE_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  CONTENT_MAX_LENGTH,
} from './constants'
import { validatePostForm } from './validation'

export function useComposerState(defaultType, initialDraft, setDraftMeta) {
  const [isInitialized, setIsInitialized] = useState(() => initialDraft !== null)
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
      coverPreview: draft.coverPreview || '',
    }
  })
  
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState(
    initialDraft ? 'Đã tự động khôi phục bản nháp chưa gửi của bạn.' : '',
  )
  const [previewHighlight, setPreviewHighlight] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState('idle')
  const [submitError, setSubmitError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  
  const currentPreviewUrlRef = useRef('')

  const validation = useMemo(() => validatePostForm(form), [form])

  useEffect(() => {
    if (!isInitialized && initialDraft) {
      setForm((current) => {
        const base = buildInitialForm(defaultType)
        return {
          ...base,
          title: initialDraft.title || '',
          type: initialDraft.type || base.type,
          category: initialDraft.category || '',
          description: initialDraft.description || '',
          content: initialDraft.content || '',
          content_blocks: initialDraft.content_blocks || [],
          tags: initialDraft.tags || '',
          coverPreview: initialDraft.coverPreview || current.coverPreview,
        }
      })
      setIsInitialized(true)
      if (initialDraft.title || initialDraft.content) {
        setInfoMessage('Đã tự động tải dữ liệu bài viết.')
      }
    }
  }, [initialDraft, isInitialized, defaultType])

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
    setSubmitState('idle')
    setSubmitError('')
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

  function handlePreview() {
    setSuccessMessage('')
    setInfoMessage('')
    setPreviewHighlight(true)
  }

  function closePreview() {
    setPreviewHighlight(false)
  }

  return {
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
  }
}
