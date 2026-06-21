import { useState, useRef, useEffect } from 'react'
import { buildDraftPayload, hasDraftPayloadContent } from './utils'
import { DRAFT_STORAGE_KEY, AUTOSAVE_DEBOUNCE_MS } from './constants'

export function readDraft() {
  try {
    const draftStr = localStorage.getItem(DRAFT_STORAGE_KEY)
    return draftStr ? JSON.parse(draftStr) : null
  } catch {
    console.warn('Lỗi khôi phục bản nháp')
    return null
  }
}

export function useComposerDraft({
  form,
  isSubmitting,
  resetForm,
  defaultType,
  setInfoMessage,
  setErrorMessage,
  setSuccessMessage,
  initialDraft,
}) {
  const [draftMeta, setDraftMeta] = useState(initialDraft ? 'Đã khôi phục bản nháp trước đó.' : 'Chưa có thay đổi')
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const lastSavedDraftRef = useRef('')

  useEffect(() => {
    lastSavedDraftRef.current = initialDraft ? JSON.stringify(initialDraft) : ''
  }, [initialDraft])

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

  return {
    draftMeta,
    setDraftMeta,
    lastSavedAt,
    setLastSavedAt,
    handleSaveDraft,
    clearDraft,
  }
}
