import { useState, useRef, useEffect } from 'react'
import { uploadPostInlineImage } from '../../services/postService'
import { getUserSafeError } from '../../utils/logger'
import { countMarkdownImages, MARKDOWN_IMAGE_LIMIT } from '../../utils/markdown'
import { countImageBlocks } from '../../utils/postBlocks'
import { DEFAULT_POST_IMAGE_ASPECT } from '../../utils/postImageRatios'
import { validateSelectedPostImage } from './utils'

export function useComposerMedia({
  form,
  setForm,
  setFieldErrors,
  setErrorMessage,
  user,
}) {
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
  
  const cropResolveRef = useRef(null)
  const cropRejectRef = useRef(null)

  useEffect(() => () => {
    if (cropState.image) {
      URL.revokeObjectURL(cropState.image)
    }
  }, [cropState.image])

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

  return {
    isUploadingInlineImage,
    cropState,
    handleCoverChange,
    removeCover,
    handleInlineImageUpload,
    handleCropApply,
    handleCropClose,
  }
}
