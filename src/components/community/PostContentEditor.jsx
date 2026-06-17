import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Bold,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  Trash2,
  Type,
} from 'lucide-react'
import '../../styles/block-editor.css'
import {
  countImageBlocks,
  countWords,
  createImageBlock,
  createTextBlock,
  extractPlainTextFromBlocks,
  getImageCaption,
  normalizeEditorBlocks,
} from '../../utils/postBlocks'

function getSelectionRange(textarea) {
  return {
    start: textarea.selectionStart ?? 0,
    end: textarea.selectionEnd ?? 0,
  }
}

function withWrappedSelection(value, start, end, prefix, suffix, fallbackText = '') {
  const selectedText = value.slice(start, end) || fallbackText
  const nextValue = `${value.slice(0, start)}${prefix}${selectedText}${suffix}${value.slice(end)}`
  const selectionStart = start + prefix.length
  const selectionEnd = selectionStart + selectedText.length

  return { nextValue, selectionStart, selectionEnd }
}

function withLinePrefix(value, start, end, prefix) {
  const lineStart = value.lastIndexOf('\n', Math.max(0, start - 1)) + 1
  const lineEndIndex = value.indexOf('\n', end)
  const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex
  const target = value.slice(lineStart, lineEnd)
  const lines = target.split('\n')
  const shouldRemove = lines.every((line) => line.startsWith(prefix))
  const nextTarget = lines
    .map((line) => {
      if (!line.trim()) return line
      return shouldRemove ? line.replace(prefix, '') : `${prefix}${line}`
    })
    .join('\n')

  return {
    nextValue: `${value.slice(0, lineStart)}${nextTarget}${value.slice(lineEnd)}`,
    selectionStart: lineStart,
    selectionEnd: lineStart + nextTarget.length,
  }
}

function PostContentEditor({
  id = 'post-content',
  value,
  blocks,
  onChange,
  onChangeBlocks,
  onInsertImage,
  isUploadingImage = false,
  maxLength = 4000,
  minLength = 80,
  maxImageCount = 5,
  error,
  describedBy,
}) {
  const textareaRefs = useRef({})
  const localBlocks = useMemo(() => normalizeEditorBlocks(blocks, value), [blocks, value])
  const [editorNotice, setEditorNotice] = useState('')

  const plainText = useMemo(() => extractPlainTextFromBlocks(localBlocks, value), [localBlocks, value])
  const wordCount = useMemo(() => countWords(plainText), [plainText])
  const imageCount = useMemo(() => countImageBlocks(localBlocks), [localBlocks])

  useEffect(() => {
    if (!editorNotice) return undefined

    const timeoutId = window.setTimeout(() => {
      setEditorNotice('')
    }, 2400)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [editorNotice])

  function updateBlocks(nextBlocks) {
    onChangeBlocks?.(nextBlocks)
    onChange?.(extractPlainTextFromBlocks(nextBlocks))
  }

  function showNotice(message) {
    setEditorNotice(message)
  }

  function handleAddBlock(type) {
    if (type === 'image' && imageCount >= maxImageCount) {
      showNotice(`Bạn đã dùng đủ ${maxImageCount}/${maxImageCount} ảnh cho bài viết này.`)
      return
    }

    const nextBlock = type === 'image' ? createImageBlock() : createTextBlock()
    updateBlocks([...localBlocks, nextBlock])
    showNotice(
      type === 'image'
        ? `Đã thêm hình ảnh ${Math.min(imageCount + 1, maxImageCount)}/${maxImageCount}.`
        : 'Đã thêm 1 khung văn bản mới.',
    )
  }

  function handleRemoveBlock(index) {
    if (localBlocks.length <= 1) {
      updateBlocks([createTextBlock()])
      return
    }

    const nextBlocks = localBlocks.filter((_, blockIndex) => blockIndex !== index)
    updateBlocks(nextBlocks)
  }

  function handleMoveBlock(index, direction) {
    const nextBlocks = [...localBlocks]

    if (direction === 'up' && index > 0) {
      ;[nextBlocks[index - 1], nextBlocks[index]] = [nextBlocks[index], nextBlocks[index - 1]]
      updateBlocks(nextBlocks)
      return
    }

    if (direction === 'down' && index < nextBlocks.length - 1) {
      ;[nextBlocks[index + 1], nextBlocks[index]] = [nextBlocks[index], nextBlocks[index + 1]]
      updateBlocks(nextBlocks)
    }
  }

  function handleChangeBlock(index, patch) {
    const nextBlocks = [...localBlocks]
    nextBlocks[index] = {
      ...nextBlocks[index],
      ...patch,
    }
    updateBlocks(nextBlocks)
  }

  function focusTextarea(blockId, selectionStart, selectionEnd = selectionStart) {
    window.requestAnimationFrame(() => {
      const textarea = textareaRefs.current[blockId]
      if (!textarea) return
      textarea.focus()
      textarea.setSelectionRange(selectionStart, selectionEnd)
    })
  }

  function handleFormatText(index, format) {
    const block = localBlocks[index]
    if (!block || block.type !== 'text') return

    const textarea = textareaRefs.current[block.id]
    if (!textarea) return

    const value = block.content || ''
    const { start, end } = getSelectionRange(textarea)
    let result = null

    if (format === 'bold') {
      result = withWrappedSelection(value, start, end, '**', '**', 'chữ đậm')
    }

    if (format === 'italic') {
      result = withWrappedSelection(value, start, end, '*', '*', 'chữ nghiêng')
    }

    if (format === 'heading') {
      result = withLinePrefix(value, start, end, '### ')
    }

    if (format === 'list') {
      result = withLinePrefix(value, start, end, '- ')
    }

    if (format === 'link') {
      const selectedText = value.slice(start, end).trim() || 'liên kết này'
      const url = window.prompt('Nhập đường dẫn cho liên kết:', 'https://')
      if (!url?.trim()) return
      result = withWrappedSelection(value, start, end, `[`, `](${url.trim()})`, selectedText)
    }

    if (!result) return

    handleChangeBlock(index, { content: result.nextValue })
    focusTextarea(block.id, result.selectionStart, result.selectionEnd)
  }

  async function handleUploadImage(index, file) {
    if (!file) return

    try {
      const url = await onInsertImage?.(file)
      if (!url) return

      handleChangeBlock(index, {
        url,
        alt: file.name || '',
      })
      showNotice(`Đã tải ảnh lên thành công ${Math.min(imageCount + 1, maxImageCount)}/${maxImageCount}.`)
    } catch {
      // Lỗi đã được xử lý ở hook phía trên.
    }
  }

  function renderTextBlock(block, index) {
    const textValue = block.content || ''
    const blockPlainText = extractPlainTextFromBlocks([block])

    return (
      <div key={block.id} className="block-editor-card">
        <div className="block-editor-card__top">
          <div className="block-editor-card__title">
            <Type size={16} />
            <span>Văn bản</span>
          </div>

          <div className="block-editor-card__actions">
            <button type="button" onClick={() => handleMoveBlock(index, 'up')} disabled={index === 0} aria-label="Di chuyển đoạn này lên">
              <ArrowUp size={15} />
            </button>
            <button type="button" onClick={() => handleMoveBlock(index, 'down')} disabled={index === localBlocks.length - 1} aria-label="Di chuyển đoạn này xuống">
              <ArrowDown size={15} />
            </button>
            <button type="button" onClick={() => handleRemoveBlock(index)} aria-label="Xóa đoạn này">
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        <div className="block-editor-card__toolbar" role="toolbar" aria-label="Công cụ định dạng văn bản">
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => handleFormatText(index, 'bold')}>
            <Bold size={15} />
            <span>Đậm</span>
          </button>
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => handleFormatText(index, 'italic')}>
            <Italic size={15} />
            <span>Nghiêng</span>
          </button>
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => handleFormatText(index, 'heading')}>
            <Heading3 size={15} />
            <span>Tiêu đề nhỏ</span>
          </button>
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => handleFormatText(index, 'list')}>
            <List size={15} />
            <span>Danh sách</span>
          </button>
          <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => handleFormatText(index, 'link')}>
            <Link2 size={15} />
            <span>Liên kết</span>
          </button>
        </div>

        <textarea
          ref={(node) => {
            textareaRefs.current[block.id] = node
          }}
          className="post-form-control block-editor-card__textarea"
          placeholder="Viết nội dung bài viết của bạn tại đây..."
          value={textValue}
          onChange={(event) => handleChangeBlock(index, { content: event.target.value })}
          rows={7}
        />

        <div className="block-editor-card__meta">
          <span>{countWords(blockPlainText)} từ</span>
          <span>{blockPlainText.length} ký tự</span>
        </div>
      </div>
    )
  }

  function renderImageBlock(block, index) {
    const caption = getImageCaption(block)

    return (
      <div key={block.id} className="block-editor-card block-editor-card--image">
        <div className="block-editor-card__top">
          <div className="block-editor-card__title">
            <ImagePlus size={16} />
            <span>Hình ảnh</span>
          </div>

          <div className="block-editor-card__actions">
            <button type="button" onClick={() => handleMoveBlock(index, 'up')} disabled={index === 0} aria-label="Di chuyển ảnh này lên">
              <ArrowUp size={15} />
            </button>
            <button type="button" onClick={() => handleMoveBlock(index, 'down')} disabled={index === localBlocks.length - 1} aria-label="Di chuyển ảnh này xuống">
              <ArrowDown size={15} />
            </button>
            <button type="button" onClick={() => handleRemoveBlock(index)} aria-label="Xóa ảnh này">
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {block.url ? (
          <div className="block-editor-image-card">
            <div className="block-editor-image-card__frame">
              <img src={block.url} alt={caption || block.alt || 'Ảnh minh họa'} className="block-editor-image-card__preview" />
            </div>

            <div className="block-editor-image-card__fields">
              <input
                type="text"
                className="post-form-control"
                placeholder="Thêm chú thích ảnh nếu cần"
                value={caption}
                onChange={(event) => handleChangeBlock(index, { caption: event.target.value })}
              />

              <div className="block-editor-image-card__buttons">
                <label htmlFor={`image-upload-${block.id}`} className="btn btn--secondary block-editor-image-card__upload">
                  {isUploadingImage ? 'Đang tải lên...' : 'Đổi hình ảnh'}
                </label>
                <button type="button" className="btn btn--ghost" onClick={() => handleChangeBlock(index, { url: '', caption: '', alt: '' })}>
                  Xóa ảnh
                </button>
              </div>
            </div>

            <input
              id={`image-upload-${block.id}`}
              type="file"
              accept="image/*"
              onChange={(event) => handleUploadImage(index, event.target.files?.[0])}
              disabled={isUploadingImage}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div className="block-editor-image-upload">
            <input
              id={`image-upload-${block.id}`}
              type="file"
              accept="image/*"
              onChange={(event) => handleUploadImage(index, event.target.files?.[0])}
              disabled={isUploadingImage}
              style={{ display: 'none' }}
            />

            <label htmlFor={`image-upload-${block.id}`} className="block-editor-image-upload__trigger">
              <ImagePlus size={18} />
              <span>{isUploadingImage ? 'Đang tải ảnh lên...' : 'Thêm hình ảnh'}</span>
              <small>Ảnh sẽ được hiển thị theo khung gọn, bo góc và dễ xem trên mobile.</small>
            </label>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`post-content-editor block-editor ${error ? 'has-error' : ''}`} id={id} aria-describedby={describedBy}>
      <div className="block-editor__header">
        <div className="block-editor__header-copy">
          <h3>Nội dung bài viết</h3>
          <p>Thêm văn bản hoặc hình ảnh để tạo bài viết rõ ràng, dễ đọc.</p>
        </div>

        <div className="block-editor__header-actions">
          <button type="button" className="block-editor__primary-action" onClick={() => handleAddBlock('text')}>
            <Type size={16} />
            <span>+ Văn bản</span>
          </button>
          <button
            type="button"
            className={`block-editor__primary-action block-editor__primary-action--image${imageCount >= maxImageCount ? ' is-limit' : ''}`}
            onClick={() => handleAddBlock('image')}
          >
            <ImagePlus size={16} />
            <span>+ Hình ảnh</span>
          </button>
        </div>
      </div>

      {editorNotice ? (
        <div className="block-editor__notice" role="status" aria-live="polite">
          {editorNotice}
        </div>
      ) : null}

      <div className="block-editor__summary">
        <span>{wordCount} từ</span>
        <span>{plainText.length}/{maxLength} ký tự</span>
        <span>{imageCount}/{maxImageCount} ảnh</span>
        <span>Khuyến nghị {minLength}+ ký tự</span>
      </div>

      {localBlocks.length === 0 ? (
        <div className="block-editor__empty-state">
          <p>Bài viết của bạn chưa có nội dung. Hãy thêm văn bản hoặc hình ảnh.</p>
        </div>
      ) : (
        <div className="block-editor__canvas">
          {localBlocks.map((block, index) => (block.type === 'image' ? renderImageBlock(block, index) : renderTextBlock(block, index)))}
        </div>
      )}
    </div>
  )
}

export default PostContentEditor
