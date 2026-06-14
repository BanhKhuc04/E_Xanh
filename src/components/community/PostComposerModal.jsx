import CreatePostForm from './CreatePostForm'
import CreatePostSidebar from './CreatePostSidebar'
import { usePostComposerForm } from '../../hooks/usePostComposerForm'

function PostComposerModal({
  isOpen,
  defaultType = 'community',
  onClose,
  onCreated,
}) {
  const composer = usePostComposerForm({
    defaultType,
    onSuccess: async (payload) => {
      await onCreated?.(payload)
    },
  })

  const handleClose = () => {
    composer.handleSaveDraft()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="ui-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="post-composer-title" onClick={handleClose}>
      <div className="ui-modal ui-modal--composer" onClick={(event) => event.stopPropagation()}>
        <div className="ui-modal__header">
          <div>
            <h2 id="post-composer-title">Chia sẻ với cộng đồng</h2>
            <p>Đăng bài nhanh mà không rời khỏi trang bạn đang xem.</p>
          </div>
          <button type="button" className="ui-modal__close" onClick={handleClose} aria-label="Đóng trình soạn bài">
            ✕
          </button>
        </div>

        <div className="composer-modal__body">
          <CreatePostForm
            form={composer.form}
            errorMessage={composer.errorMessage}
            successMessage={composer.successMessage}
            infoMessage={composer.infoMessage}
            fieldErrors={composer.fieldErrors}
            onChange={composer.handleChange}
            onCoverChange={composer.handleCoverChange}
            onRemoveCover={composer.removeCover}
            onSaveDraft={composer.handleSaveDraft}
            onClearDraft={composer.clearDraft}
            onPreview={composer.handlePreview}
            onSubmit={composer.handleSubmit}
            onInsertInlineImage={composer.handleInlineImageUpload}
            isSubmitting={composer.isSubmitting}
            isUploadingInlineImage={composer.isUploadingInlineImage}
            draftMeta={composer.draftMeta}
            cooldownRemaining={composer.cooldownRemaining}
            limits={composer.limits}
            compact
            showActions={false}
          />

          <CreatePostSidebar
            form={composer.form}
            previewHighlight={composer.previewHighlight}
            previewAuthor={composer.profile?.name || composer.user?.email?.split('@')[0] || 'Bạn'}
            compact
          />
        </div>

        <div className="ui-modal__footer composer-modal__footer">
          <div className="composer-modal__footer-note">
            {composer.cooldownRemaining > 0 ? (
              <span>Bạn có thể gửi bài mới sau khoảng {composer.cooldownRemaining} giây để tránh spam.</span>
            ) : (
              <span>Bài viết sẽ được gửi duyệt trước khi hiển thị công khai.</span>
            )}
          </div>

          <div className="composer-modal__footer-actions">
            <button type="button" className="btn create-post-form__draft" onClick={composer.handleSaveDraft} disabled={composer.isSubmitting}>
              Lưu nháp
            </button>
            <button type="button" className="btn btn--ghost" onClick={composer.clearDraft} disabled={composer.isSubmitting}>
              Xóa nháp
            </button>
            <button type="button" className="btn btn--secondary" onClick={composer.handlePreview} disabled={composer.isSubmitting}>
              Xem trước
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={composer.handleSubmit}
              disabled={composer.isSubmitting || composer.cooldownRemaining > 0}
            >
              {composer.isSubmitting ? 'Đang gửi...' : composer.cooldownRemaining > 0 ? `Đợi ${composer.cooldownRemaining}s` : 'Gửi bài chờ duyệt'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostComposerModal
