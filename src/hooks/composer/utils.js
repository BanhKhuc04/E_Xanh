import { createTextBlock, extractPlainTextFromBlocks } from '../../utils/postBlocks'
import { MAX_POST_IMAGE_SIZE, POST_IMAGE_TYPES, TAGS_SEPARATOR } from './constants'

export function buildInitialForm(defaultType = '') {
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

export function validateSelectedPostImage(file, { kind = 'cover' } = {}) {
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

export function buildDraftPayload(form) {
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

export function hasDraftPayloadContent(payload) {
  return [
    payload.title,
    payload.type,
    payload.category,
    payload.description,
    extractPlainTextFromBlocks(payload.content_blocks, payload.content),
    payload.tags,
  ].some((item) => String(item || '').trim().length > 0)
}

export function getCooldownStorageKey(userId) {
  return `exanh_post_cooldown_${userId}`
}

export function parseTags(tags = '') {
  return tags
    .split(TAGS_SEPARATOR)
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export function formatSavedTime(dateValue) {
  if (!dateValue) return ''

  return new Date(dateValue).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
