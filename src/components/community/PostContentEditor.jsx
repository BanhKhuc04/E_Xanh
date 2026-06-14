import { useRef, useState } from 'react'
import MarkdownContent from '../common/MarkdownContent'

function PostContentEditor({
  id = 'post-content',
  value,
  onChange,
  onInsertImage,
  isUploadingImage = false,
  maxLength = 4000,
  minLength = 80,
  error,
  describedBy = 'post-content-help',
}) {
  const textareaRef = useRef(null)
  const imageInputRef = useRef(null)
  const [activeTab, setActiveTab] = useState('write')

  function updateValue(nextValue) {
    onChange(nextValue.slice(0, maxLength))
  }

  function insertAtSelection(transformer) {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.slice(start, end)
    const nextText = transformer(selectedText, value, start, end)

    if (typeof nextText !== 'string') return

    updateValue(nextText)

    requestAnimationFrame(() => {
      textarea.focus()
    })
  }

  function wrapSelection(prefix, suffix = prefix, placeholder = 'nội dung') {
    insertAtSelection((selectedText, currentValue, start, end) => {
      const content = selectedText || placeholder
      return `${currentValue.slice(0, start)}${prefix}${content}${suffix}${currentValue.slice(end)}`
    })
  }

  function prefixLines(prefix) {
    insertAtSelection((selectedText, currentValue, start, end) => {
      const segment = selectedText || 'nội dung'
      const prefixed = segment
        .split('\n')
        .map((line) => `${prefix}${line || 'nội dung'}`)
        .join('\n')

      return `${currentValue.slice(0, start)}${prefixed}${currentValue.slice(end)}`
    })
  }

  function handleInsertLink() {
    const url = window.prompt('Nhập liên kết bạn muốn chèn')
    if (!url) return

    insertAtSelection((selectedText, currentValue, start, end) => {
      const label = selectedText || 'Xem thêm'
      return `${currentValue.slice(0, start)}[${label}](${url.trim()})${currentValue.slice(end)}`
    })
  }

  async function handleImageSelected(event) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const imageUrl = await onInsertImage?.(file)
      if (!imageUrl) return

      insertAtSelection((selectedText, currentValue, start, end) => {
        const altText = selectedText || file.name.replace(/\.[^.]+$/, '') || 'Ảnh minh họa'
        const snippet = `\n![${altText}](${imageUrl})\n`
        return `${currentValue.slice(0, start)}${snippet}${currentValue.slice(end)}`
      })
      setActiveTab('write')
    } finally {
      event.target.value = ''
    }
  }

  const toolbarActions = [
    { label: 'In đậm', onClick: () => wrapSelection('**') },
    { label: 'In nghiêng', onClick: () => wrapSelection('*') },
    { label: 'Tiêu đề', onClick: () => prefixLines('## ') },
    { label: 'Danh sách', onClick: () => prefixLines('- ') },
    { label: 'Trích dẫn', onClick: () => prefixLines('> ') },
    { label: 'Chèn link', onClick: handleInsertLink },
  ]

  return (
    <div className="post-editor">
      <div className="post-editor__toolbar">
        <div className="post-editor__tools">
          {toolbarActions.map((action) => (
            <button key={action.label} type="button" className="post-editor__tool" onClick={action.onClick}>
              {action.label}
            </button>
          ))}
          <button
            type="button"
            className="post-editor__tool"
            onClick={() => imageInputRef.current?.click()}
            disabled={isUploadingImage}
          >
            {isUploadingImage ? 'Đang tải ảnh...' : 'Chèn ảnh'}
          </button>
        </div>

        <div className="post-editor__tabs">
          <button
            type="button"
            className={`post-editor__tab ${activeTab === 'write' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('write')}
          >
            Viết
          </button>
          <button
            type="button"
            className={`post-editor__tab ${activeTab === 'preview' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Xem trước
          </button>
        </div>
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handleImageSelected}
      />

      {activeTab === 'write' ? (
        <textarea
          id={id}
          ref={textareaRef}
          className={`post-editor__textarea ${error ? 'is-invalid' : ''}`}
          value={value}
          onChange={(event) => updateValue(event.target.value)}
          placeholder="Viết nội dung chia sẻ của bạn tại đây. Bạn có thể dùng tiêu đề, danh sách, trích dẫn, link và ảnh minh họa."
          rows="14"
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
      ) : (
        <div className="post-editor__preview">
          <MarkdownContent content={value} />
        </div>
      )}

      <div className="post-editor__footer">
        <span>Tối thiểu {minLength} ký tự, tối đa {maxLength} ký tự.</span>
        <span>{value.length}/{maxLength} ký tự</span>
      </div>
    </div>
  )
}

export default PostContentEditor
