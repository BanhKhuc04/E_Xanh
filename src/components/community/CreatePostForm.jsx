import { useMemo, useRef, useState } from 'react'
import PostContentEditor from './PostContentEditor'
import CustomSelect from '../common/CustomSelect'
import ImageCropModal from '../common/ImageCropModal'
import PostImage from '../common/PostImage'
import '../../styles/create-post.css'
import { countWords, extractPlainTextFromBlocks } from '../../utils/postBlocks'

function CreatePostForm({
  form,
  errorMessage,
  successMessage,
  infoMessage,
  fieldErrors = {},
  onChange,
  onCoverChange,
  onClearDraft,
  onSubmit,
  onRemoveCover,
  onInsertInlineImage,
  isSubmitting,
  isUploadingInlineImage = false,
  cropState,
  onCropApply,
  onCropClose,
  draftMeta = '',
  cooldownRemaining = 0,
  limits = {
    titleMax: 90,
    descriptionMax: 180,
    contentMin: 80,
    contentMax: 4000,
    tagsMax: 5,
    contentImageMax: 5,
  },
  compact = false,
  showActions = true,
}) {
  const [isDragging, setIsDragging] = useState(false)
  const coverInputRef = useRef(null)

  const tagCount = useMemo(
    () =>
      form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean).length,
    [form.tags],
  )

  const plainContent = useMemo(
    () => extractPlainTextFromBlocks(form.content_blocks, form.content),
    [form.content, form.content_blocks],
  )
  const wordCount = useMemo(() => countWords(plainContent), [plainContent])
  const imageCount = useMemo(
    () => (Array.isArray(form.content_blocks) ? form.content_blocks.filter((block) => block?.type === 'image' && block.url).length : 0),
    [form.content_blocks],
  )

  function handleDragOver(event) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(event) {
    event.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    if (event.dataTransfer.files?.length) {
      onCoverChange({ target: { files: event.dataTransfer.files } })
    }
  }

  function handleOpenCoverPicker() {
    if (isSubmitting) return
    coverInputRef.current?.click()
  }

  function handleUploadBoxKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpenCoverPicker()
    }
  }

  return (
    <>
      <div className={`create-post-form post-modal-form${compact ? ' create-post-form--compact' : ''}`}>
      <div className="create-post-form__messages">
        {errorMessage ? <div className="create-post-form__message create-post-form__message--error">{errorMessage}</div> : null}
        {successMessage ? (
          <div className="create-post-form__message create-post-form__message--success">{successMessage}</div>
        ) : null}
        {infoMessage ? <div className="create-post-form__message create-post-form__message--info">{infoMessage}</div> : null}
      </div>

      <div className="create-post-form__utility">
        <span className="create-post-form__draft-meta">{draftMeta || 'Chưa có thay đổi'}</span>
        <div className="create-post-form__utility-meta">
          <span>{plainContent.length}/{limits.contentMax} ký tự</span>
          <span>{wordCount} từ</span>
        </div>
      </div>

      <div
        className="create-post-form__field post-form-group"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="post-form-group__header">
          <label htmlFor="post-cover">
            <span>Ảnh bìa</span>
          </label>
          <span className="post-form-group__hint">JPG, PNG, WEBP, tối đa 5MB</span>
        </div>

        <input
          ref={coverInputRef}
          id="post-cover"
          data-testid="post-image-input"
          className="create-post-form__file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={onCoverChange}
          style={{ display: 'none' }}
        />

        <div
          data-testid="post-upload-area"
          className={`create-post-form__upload-box${form.coverPreview ? ' has-preview' : ''}${isDragging ? ' is-dragging' : ''}`}
          role="button"
          tabIndex={isSubmitting ? -1 : 0}
          aria-label="Chọn ảnh bìa từ máy"
          onClick={handleOpenCoverPicker}
          onKeyDown={handleUploadBoxKeyDown}
          aria-disabled={isSubmitting}
        >
          {form.coverPreview ? (
            <>
              <PostImage
                src={form.coverPreview}
                alt="Preview ảnh bìa"
                className="create-post-form__cover-preview"
                variant="preview"
                loading="eager"
              />
              {onRemoveCover ? (
                <button
                  type="button"
                  className="btn btn--ghost create-post-form__remove-cover"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    onRemoveCover()
                  }}
                >
                  Xóa ảnh
                </button>
              ) : null}
            </>
          ) : (
            <div className="create-post-form__upload-copy">
              <strong>Kéo thả ảnh vào đây hoặc chọn ảnh từ máy</strong>
              <small>Ảnh sẽ được crop theo 1 trong 3 tỉ lệ: 16:9, 1:1 hoặc 3:4 trước khi tải lên.</small>
              <button
                type="button"
                className="btn btn--secondary create-post-form__upload-trigger"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  handleOpenCoverPicker()
                }}
                disabled={isSubmitting}
              >
                Chọn ảnh bìa
              </button>
            </div>
          )}
        </div>

        {form.coverName ? <p className="post-form-group__help">Đã chọn: {form.coverName}</p> : null}
        {fieldErrors.coverFile ? <p className="post-form-group__error">{fieldErrors.coverFile}</p> : null}
      </div>

      <div className="create-post-form__field post-form-group">
        <div className="post-form-group__header">
          <label htmlFor="post-title">
            <span>Tiêu đề bài viết</span>
          </label>
          <span className="post-form-group__counter">{form.title.length}/{limits.titleMax}</span>
        </div>
        <input
          id="post-title"
          className={`post-form-control ${fieldErrors.title ? 'is-invalid' : ''}`}
          type="text"
          value={form.title}
          onChange={(event) => onChange('title', event.target.value)}
          placeholder="Ví dụ: 5 cách dùng điều hòa tiết kiệm điện mùa nóng"
          maxLength={limits.titleMax}
          aria-invalid={Boolean(fieldErrors.title)}
          aria-describedby={fieldErrors.title ? 'post-title-error' : undefined}
        />
        {fieldErrors.title ? <p id="post-title-error" className="post-form-group__error">{fieldErrors.title}</p> : null}
      </div>

      <div className="create-post-form__row post-form-row">
        <div className="create-post-form__field post-form-group">
          <div className="post-form-group__header">
            <label htmlFor="post-type">
              <span>Loại bài viết</span>
            </label>
          </div>
          <CustomSelect
            id="post-type"
            value={form.type}
            onChange={(nextValue) => onChange('type', nextValue)}
            error={Boolean(fieldErrors.type)}
            className="create-post-form__select"
            placeholder="Chọn loại bài..."
            options={[
              { value: 'tip', label: 'Mẹo tiết kiệm' },
              { value: 'community', label: 'Chia sẻ cộng đồng' },
              { value: 'qa', label: 'Hỏi đáp' },
              { value: 'review', label: 'Review thiết bị' },
            ]}
          />
          {fieldErrors.type ? <p className="post-form-group__error">{fieldErrors.type}</p> : null}
        </div>

        <div className="create-post-form__field post-form-group">
          <div className="post-form-group__header">
            <label htmlFor="post-category">
              <span>Danh mục</span>
            </label>
          </div>
          <CustomSelect
            id="post-category"
            value={form.category}
            onChange={(nextValue) => onChange('category', nextValue)}
            error={Boolean(fieldErrors.category)}
            className="create-post-form__select"
            placeholder="Chọn thiết bị/chủ đề..."
            options={[
              { value: 'Điều hòa', label: 'Điều hòa' },
              { value: 'Laptop', label: 'Laptop' },
              { value: 'Đèn học', label: 'Đèn học' },
              { value: 'Tủ lạnh', label: 'Tủ lạnh' },
              { value: 'Thiết bị gia dụng', label: 'Thiết bị gia dụng' },
              { value: 'Thói quen xanh', label: 'Thói quen xanh' },
              { value: 'Phòng trọ', label: 'Phòng trọ' },
            ]}
          />
          {fieldErrors.category ? <p className="post-form-group__error">{fieldErrors.category}</p> : null}
        </div>
      </div>

      <div className="create-post-form__field post-form-group">
        <div className="post-form-group__header">
          <label htmlFor="post-description">
            <span>Mô tả ngắn</span>
          </label>
          <span className="post-form-group__counter">{form.description.length}/{limits.descriptionMax}</span>
        </div>
        <textarea
          id="post-description"
          className={`post-form-control ${fieldErrors.description ? 'is-invalid' : ''}`}
          rows="3"
          value={form.description}
          onChange={(event) => onChange('description', event.target.value)}
          placeholder="Tóm tắt nội dung bài viết trong 1–2 câu..."
          maxLength={limits.descriptionMax}
          aria-invalid={Boolean(fieldErrors.description)}
          aria-describedby={fieldErrors.description ? 'post-description-error' : undefined}
        />
        {fieldErrors.description ? <p id="post-description-error" className="post-form-group__error">{fieldErrors.description}</p> : null}
      </div>

      <div className="create-post-form__field post-form-group">
        <div className="post-form-group__header post-form-group__header--content">
          <label htmlFor="post-content">
            <span>Nội dung</span>
          </label>
          <div className="post-form-group__content-stats">
            <span className="post-form-group__counter">{plainContent.length}/{limits.contentMax} ký tự</span>
            <span className="post-form-group__counter">{imageCount}/{limits.contentImageMax} ảnh</span>
          </div>
        </div>

        <div className="create-post-form__editor-shell">
          <PostContentEditor
            id="post-content"
            value={form.content}
            blocks={form.content_blocks}
            onChange={(nextValue) => onChange('content', nextValue)}
            onChangeBlocks={(nextBlocks) => onChange('content_blocks', nextBlocks)}
            onInsertImage={onInsertInlineImage}
            isUploadingImage={isUploadingInlineImage}
            maxLength={limits.contentMax}
            minLength={limits.contentMin}
            maxImageCount={limits.contentImageMax}
            error={fieldErrors.content}
            describedBy={fieldErrors.content ? 'post-content-error' : 'post-content-help'}
          />
        </div>

        <p id="post-content-help" className="post-form-group__help">
          Tối thiểu {limits.contentMin} ký tự. Tối đa {limits.contentImageMax} ảnh trong nội dung.
        </p>
        {fieldErrors.content ? <p id="post-content-error" className="post-form-group__error">{fieldErrors.content}</p> : null}
      </div>

      <div className="create-post-form__field post-form-group">
        <div className="post-form-group__header">
          <label htmlFor="post-tags">
            <span>Tags</span>
          </label>
          <span className="post-form-group__counter">{tagCount}/{limits.tagsMax} tags</span>
        </div>
        <input
          id="post-tags"
          className={`post-form-control ${fieldErrors.tags ? 'is-invalid' : ''}`}
          type="text"
          value={form.tags}
          onChange={(event) => onChange('tags', event.target.value)}
          placeholder="Ví dụ: điều hòa, phòng trọ, tiết kiệm điện"
          aria-invalid={Boolean(fieldErrors.tags)}
          aria-describedby={fieldErrors.tags ? 'post-tags-error' : 'post-tags-help'}
        />
        <p id="post-tags-help" className="post-form-group__help">Tối đa {limits.tagsMax} tags, ngăn cách bằng dấu phẩy.</p>
        {fieldErrors.tags ? <p id="post-tags-error" className="post-form-group__error">{fieldErrors.tags}</p> : null}
      </div>

      {showActions ? (
        <div className="create-post-form__actions" role="group" aria-label="Hành động đăng bài">
          {onClearDraft ? (
            <button type="button" className="btn btn--ghost create-post-form__secondary-action" onClick={onClearDraft} disabled={isSubmitting}>
              Xóa nháp
            </button>
          ) : null}
          <button type="button" className="btn btn--primary create-post-form__primary-action" onClick={onSubmit} disabled={isSubmitting || cooldownRemaining > 0}>
            {isSubmitting ? 'Đang gửi...' : 'Gửi bài chờ duyệt'}
          </button>
        </div>
      ) : null}
      </div>
      <ImageCropModal
        key={`${cropState?.image || 'closed'}-${cropState?.aspectKey || '16:9'}`}
        isOpen={cropState?.isOpen}
        image={cropState?.image}
        defaultAspectKey={cropState?.aspectKey}
        title={cropState?.title}
        confirmLabel={cropState?.confirmLabel}
        originalFileName={cropState?.file?.name}
        onApply={onCropApply}
        onClose={onCropClose}
      />
    </>
  )
}

export default CreatePostForm
