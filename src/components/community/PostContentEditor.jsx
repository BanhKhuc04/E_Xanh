import { useEffect, useMemo, useState } from 'react'
import '../../styles/block-editor.css'

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

function createEmptyBlock(type = 'paragraph') {
  if (type === 'list') {
    return { id: generateId(), type, items: [''] }
  }

  if (type === 'link') {
    return { id: generateId(), type, label: '', url: '' }
  }

  if (type === 'image') {
    return { id: generateId(), type, url: '', alt: '' }
  }

  return { id: generateId(), type, content: '' }
}

function extractEditorText(blocks = []) {
  return blocks
    .map((block) => {
      if (block.type === 'list' && Array.isArray(block.items)) {
        return block.items.join('\n')
      }
      if (block.type === 'image' && block.url) {
        return `![${block.alt || 'Ảnh minh họa'}](${block.url})`
      }
      if (block.type === 'link' && block.url) {
        return `[${block.label || 'Link'}](${block.url})`
      }
      return block.content || block.label || block.alt || ''
    })
    .join('\n\n')
    .trim()
}

function countWords(text = '') {
  return text.split(/\s+/).map((item) => item.trim()).filter(Boolean).length
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
  error,
  describedBy,
}) {
  const [localBlocks, setLocalBlocks] = useState([createEmptyBlock()])

  useEffect(() => {
    if (Array.isArray(blocks) && blocks.length > 0) {
      setLocalBlocks(blocks)
      return
    }

    if (value?.trim()) {
      setLocalBlocks([{ id: generateId(), type: 'paragraph', content: value }])
      return
    }

    setLocalBlocks([createEmptyBlock()])
  }, [blocks, value])

  const editorText = useMemo(() => extractEditorText(localBlocks), [localBlocks])
  const wordCount = useMemo(() => countWords(editorText), [editorText])

  function updateBlocks(nextBlocks) {
    setLocalBlocks(nextBlocks)
    onChangeBlocks(nextBlocks)
    onChange(extractEditorText(nextBlocks))
  }

  function handleAddBlock(type, index = localBlocks.length - 1) {
    const nextBlocks = [...localBlocks]
    nextBlocks.splice(index + 1, 0, createEmptyBlock(type))
    updateBlocks(nextBlocks)
  }

  function handleRemoveBlock(index) {
    if (localBlocks.length <= 1) return
    const nextBlocks = [...localBlocks]
    nextBlocks.splice(index, 1)
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

  function handleChangeBlock(index, field, nextValue) {
    const nextBlocks = [...localBlocks]
    nextBlocks[index] = {
      ...nextBlocks[index],
      [field]: nextValue,
    }
    updateBlocks(nextBlocks)
  }

  async function handleUploadImage(index, file) {
    if (!file) return

    try {
      const url = await onInsertImage(file)
      if (!url) return

      const nextBlocks = [...localBlocks]
      nextBlocks[index] = {
        ...nextBlocks[index],
        url,
        alt: file.name || nextBlocks[index].alt || '',
      }
      updateBlocks(nextBlocks)
    } catch {
      // Hook đã xử lý error/toast phía trên.
    }
  }

  function renderBlockEditor(block, index) {
    return (
      <div key={block.id} className="block-editor-item">
        <div className="block-editor-item__header">
          <span className="block-editor-item__type">
            {block.type === 'paragraph' && 'Đoạn văn'}
            {block.type === 'heading' && 'Tiêu đề'}
            {block.type === 'list' && 'Danh sách'}
            {block.type === 'quote' && 'Trích dẫn'}
            {block.type === 'image' && 'Hình ảnh'}
            {block.type === 'link' && 'Liên kết'}
          </span>

          <div className="block-editor-item__actions">
            <button type="button" onClick={() => handleMoveBlock(index, 'up')} disabled={index === 0} title="Di chuyển lên">
              ▲
            </button>
            <button type="button" onClick={() => handleMoveBlock(index, 'down')} disabled={index === localBlocks.length - 1} title="Di chuyển xuống">
              ▼
            </button>
            <button type="button" onClick={() => handleRemoveBlock(index)} disabled={localBlocks.length <= 1} className="text-danger" title="Xóa block">
              ✕
            </button>
          </div>
        </div>

        <div className="block-editor-item__content">
          {block.type === 'heading' ? (
            <input
              type="text"
              className="post-form-control block-editor__heading-input"
              placeholder="Nhập tiêu đề nhỏ..."
              value={block.content || ''}
              onChange={(event) => handleChangeBlock(index, 'content', event.target.value)}
            />
          ) : null}

          {block.type === 'paragraph' ? (
            <textarea
              className="post-form-control block-editor__textarea"
              placeholder="Nhập nội dung đoạn văn..."
              value={block.content || ''}
              onChange={(event) => handleChangeBlock(index, 'content', event.target.value)}
              rows={4}
            />
          ) : null}

          {block.type === 'quote' ? (
            <textarea
              className="post-form-control block-editor-quote"
              placeholder="Nhập câu trích dẫn..."
              value={block.content || ''}
              onChange={(event) => handleChangeBlock(index, 'content', event.target.value)}
              rows={3}
            />
          ) : null}

          {block.type === 'list' ? (
            <textarea
              className="post-form-control block-editor-list"
              placeholder="Mỗi dòng là một gạch đầu dòng..."
              value={Array.isArray(block.items) ? block.items.join('\n') : ''}
              onChange={(event) => handleChangeBlock(index, 'items', event.target.value.split('\n'))}
              rows={4}
            />
          ) : null}

          {block.type === 'link' ? (
            <div className="block-editor__link-fields">
              <input
                type="text"
                className="post-form-control"
                placeholder="Tên nút hoặc liên kết"
                value={block.label || ''}
                onChange={(event) => handleChangeBlock(index, 'label', event.target.value)}
              />
              <input
                type="url"
                className="post-form-control"
                placeholder="https://..."
                value={block.url || ''}
                onChange={(event) => handleChangeBlock(index, 'url', event.target.value)}
              />
            </div>
          ) : null}

          {block.type === 'image' ? (
            <div className="block-editor-image">
              {block.url ? (
                <div className="block-editor-image__preview">
                  <img src={block.url} alt={block.alt || 'Ảnh minh họa'} className="block-editor-image__img" />
                  <input
                    type="text"
                    className="post-form-control"
                    placeholder="Chú thích ảnh (alt text)"
                    value={block.alt || ''}
                    onChange={(event) => handleChangeBlock(index, 'alt', event.target.value)}
                  />
                  <button type="button" className="btn btn--secondary btn--small" onClick={() => handleChangeBlock(index, 'url', '')}>
                    Đổi ảnh khác
                  </button>
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
                  <label htmlFor={`image-upload-${block.id}`} className="btn btn--secondary block-editor-image-upload__trigger">
                    {isUploadingImage ? 'Đang tải lên...' : 'Chèn ảnh vào nội dung'}
                  </label>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="block-editor-item__add">
          <div className="block-editor-add-toolbar">
            <button type="button" onClick={() => handleAddBlock('paragraph', index)}>+ Đoạn văn</button>
            <button type="button" onClick={() => handleAddBlock('heading', index)}>+ Tiêu đề</button>
            <button type="button" onClick={() => handleAddBlock('image', index)}>+ Hình ảnh</button>
            <button type="button" onClick={() => handleAddBlock('list', index)}>+ Danh sách</button>
            <button type="button" onClick={() => handleAddBlock('quote', index)}>+ Trích dẫn</button>
            <button type="button" onClick={() => handleAddBlock('link', index)}>+ Liên kết</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`post-content-editor block-editor ${error ? 'has-error' : ''}`} id={id} aria-describedby={describedBy}>
      <div className="block-editor__toolbar block-editor__toolbar--sticky">
        <div className="block-editor__toolbar-copy">
          <strong>Nội dung dạng block</strong>
          <span>Tạo đoạn văn, tiêu đề, ảnh và CTA rõ ràng để preview bám sát bài thật.</span>
        </div>

        <div className="block-editor__toolbar-actions">
          <button type="button" className="block-editor__chip" onClick={() => handleAddBlock('paragraph', localBlocks.length - 1)}>
            + Đoạn văn
          </button>
          <button type="button" className="block-editor__chip" onClick={() => handleAddBlock('heading', localBlocks.length - 1)}>
            + Tiêu đề
          </button>
          <button type="button" className="block-editor__chip" onClick={() => handleAddBlock('image', localBlocks.length - 1)}>
            + Ảnh
          </button>
        </div>
      </div>

      <div className="block-editor__summary">
        <span>{wordCount} từ</span>
        <span>{editorText.length}/{maxLength} ký tự</span>
        <span>Tối thiểu {minLength} ký tự</span>
      </div>

      <div className="block-editor__canvas">
        {localBlocks.map((block, index) => renderBlockEditor(block, index))}
      </div>
    </div>
  )
}

export default PostContentEditor
