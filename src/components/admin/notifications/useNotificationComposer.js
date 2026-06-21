import { useEffect, useMemo, useState } from 'react'
import { previewSystemNotificationAudience, sendSystemNotification } from '../../../services/adminNotificationService'
import { createSiteNotice } from '../../../services/siteNoticeService'
import { EMPTY_PREVIEW, INITIAL_FORM } from './constants'

export function useNotificationComposer(loadHistory, loadCapabilityAudit, showToast) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [preview, setPreview] = useState(EMPTY_PREVIEW)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadPreview() {
      setPreviewLoading(true)
      setPreviewError('')

      const targetValue = form.targetType === 'role' ? form.targetValue : form.targetValue.trim()
      const { data, error } = await previewSystemNotificationAudience({
        targetType: form.targetType,
        targetValue,
      })

      if (cancelled) return

      if (error) {
        setPreview({ recipients: [], count: 0 })
        setPreviewError(error.message)
      } else {
        setPreview(data || { recipients: [], count: 0 })
        setPreviewError('')
      }

      setPreviewLoading(false)
    }

    if (
      (form.targetType === 'specific_user' && !form.targetValue.trim()) ||
      (form.targetType === 'role' && !form.targetValue)
    ) {
      return undefined
    }

    loadPreview()

    return () => {
      cancelled = true
    }
  }, [form.targetType, form.targetValue])

  const previewRecipients = useMemo(
    () => (preview.recipients || []).slice(0, 4),
    [preview.recipients],
  )

  const isPreviewTargetReady = useMemo(() => {
    if (form.targetType === 'specific_user') {
      return Boolean(form.targetValue.trim())
    }

    if (form.targetType === 'role') {
      return Boolean(form.targetValue)
    }

    return true
  }, [form.targetType, form.targetValue])

  const effectivePreview = isPreviewTargetReady ? preview : EMPTY_PREVIEW
  const effectivePreviewError = isPreviewTargetReady ? previewError : ''

  const canSubmit = Boolean(
    form.title.trim() &&
    form.message.trim() &&
    (form.targetType === 'global' ? true : (effectivePreview.count > 0 && !effectivePreviewError)) &&
    !submitting,
  )

  function handleFieldChange(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value }

      if (field === 'targetType') {
        next.targetValue = value === 'role' ? 'user' : ''
      }

      return next
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim()) {
      showToast('Tiêu đề thông báo đang để trống.', 'error')
      return
    }

    if (!form.message.trim()) {
      showToast('Nội dung thông báo đang để trống.', 'error')
      return
    }

    if (form.targetType === 'global') {
      if (!window.confirm(`Bạn sắp thay đổi Popup Version toàn hệ thống thành version ${form.version || 'v1.0'}.`)) {
        return
      }

      setSubmitting(true)
      const { error } = await createSiteNotice({
        notice_key: 'main',
        version: form.version || 'v1.0',
        title: form.title,
        description: form.message,
        is_active: true,
        show_bug_button: form.showBugButton !== false,
      })

      if (error) {
        showToast(error.message, 'error')
      } else {
        showToast(`Đã cập nhật Popup Version toàn hệ thống thành công.`)
        setForm(INITIAL_FORM)
        // Kích hoạt event để Popup hiện lên ngay lập tức cho Admin xem trước
        window.dispatchEvent(new CustomEvent('force-show-version-notice', {
          detail: {
            title: form.title,
            description: form.message,
            version: form.version || 'v1.0'
          }
        }))
      }
      setSubmitting(false)
      return
    }

    if (effectivePreview.count <= 0) {
      showToast('Không có người nhận hợp lệ để gửi thông báo.', 'error')
      return
    }

    if (!window.confirm(`Bạn sắp gửi thông báo này tới ${effectivePreview.count} người dùng.`)) {
      return
    }

    setSubmitting(true)

    const { data, error } = await sendSystemNotification({
      targetType: form.targetType,
      targetValue: form.targetValue,
      title: form.title,
      message: form.message,
      notificationType: form.notificationType,
      severity: form.severity,
      actionUrl: form.actionUrl,
    })

    if (error) {
      showToast(error.message, 'error')
    } else {
      showToast(`Đã gửi thông báo tới ${data.recipientCount} người dùng.`)
      setForm(INITIAL_FORM)
      setPreview(EMPTY_PREVIEW)
      await loadHistory()
      await loadCapabilityAudit()
    }

    setSubmitting(false)
  }

  return {
    form,
    setForm,
    previewLoading,
    submitting,
    previewRecipients,
    isPreviewTargetReady,
    effectivePreview,
    effectivePreviewError,
    canSubmit,
    handleFieldChange,
    handleSubmit
  }
}
