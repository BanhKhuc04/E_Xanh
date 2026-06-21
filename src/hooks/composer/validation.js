import { countImageBlocks, extractPlainTextFromBlocks } from '../../utils/postBlocks'
import { MARKDOWN_IMAGE_LIMIT } from '../../utils/markdown'
import {
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
  CONTENT_MAX_LENGTH,
  TAGS_MAX_COUNT,
} from './constants'
import { parseTags, formatSavedTime } from './utils'

export function validatePostForm(form) {
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

export function getPrioritizedChecklist(form, validationErrors) {
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

export function getComposerStatus({
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
