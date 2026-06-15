import CreatePostForm from './CreatePostForm'
import PostPreviewModal from './PostPreviewModal'
import PostLivePreview from './PostLivePreview'
import ComposerSplitLayout from './ComposerSplitLayout'
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

  function handleClose() {
    composer.handleSaveDraft()
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="ui-modal-overlay ui-modal-overlay--composer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-composer-title"
        onClick={handleClose}
      >
        <div className="ui-modal ui-modal--composer" onClick={(event) => event.stopPropagation()}>
          <div className="ui-modal__header ui-modal__header--composer">
            <div className="ui-modal__header-content">
              <span className="composer-modal__badge">Composer Workspace</span>
              <h2 id="post-composer-title">Chia sẻ với cộng đồng</h2>
              <p>Soạn bài trong không gian rộng, preview song song và gửi bài mà không rời khỏi trang bạn đang xem.</p>
            </div>

            <button
              type="button"
              className="ui-modal__close ui-modal__close--composer"
              onClick={handleClose}
              aria-label="Đóng trình soạn bài"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="ui-modal__body composer-modal__body">
            <ComposerSplitLayout
              leftPane={(
                <div className="composer-modal__form-column">
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
                </div>
              )}
              rightPane={(
                <div className="composer-modal__preview-column">
                  <PostLivePreview form={composer.form} author={composer.profile} />
                </div>
              )}
            />
          </div>

          <div className="ui-modal__footer composer-modal__footer">
            <div className="composer-modal__footer-note">
              {composer.cooldownRemaining > 0 ? (
                <span>Bạn có thể gửi bài mới sau khoảng {composer.cooldownRemaining} giây để tránh spam.</span>
              ) : (
                <span>Bài viết sẽ được gửi duyệt trước khi hiển thị công khai. Nháp đang được tự lưu để bạn không mất nội dung.</span>
              )}
            </div>

            <div className="composer-modal__footer-actions">
              <button type="button" className="btn btn--ghost" onClick={composer.clearDraft} disabled={composer.isSubmitting}>
                Xóa nháp
              </button>
              <button type="button" className="btn btn--secondary" onClick={composer.handleSaveDraft} disabled={composer.isSubmitting}>
                Lưu nháp
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

      <PostPreviewModal
        isOpen={composer.previewHighlight}
        form={composer.form}
        onClose={composer.closePreview}
        authorName={composer.profile?.name || composer.user?.email?.split('@')[0]}
      />
    </>
  )
}

export default PostComposerModal
