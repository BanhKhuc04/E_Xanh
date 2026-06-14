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

  if (!isOpen) return null

  return (
    <div className="ui-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="post-composer-title" onClick={onClose}>
      <div className="ui-modal ui-modal--composer" onClick={(event) => event.stopPropagation()}>
        <div className="ui-modal__header">
          <div>
            <h2 id="post-composer-title">Chia sẻ với cộng đồng</h2>
            <p>Đăng bài nhanh mà không rời khỏi trang bạn đang xem.</p>
          </div>
          <button type="button" className="ui-modal__close" onClick={onClose} aria-label="Đóng trình soạn bài">
            ✕
          </button>
        </div>

        <div className="composer-modal__body">
          <CreatePostForm
            form={composer.form}
            errorMessage={composer.errorMessage}
            successMessage={composer.successMessage}
            infoMessage={composer.infoMessage}
            onChange={composer.handleChange}
            onCoverChange={composer.handleCoverChange}
            onRemoveCover={composer.removeCover}
            onSaveDraft={composer.handleSaveDraft}
            onPreview={composer.handlePreview}
            onSubmit={composer.handleSubmit}
            isSubmitting={composer.isSubmitting}
            compact
          />

          <CreatePostSidebar
            form={composer.form}
            previewHighlight={composer.previewHighlight}
            previewAuthor={composer.profile?.name || composer.user?.email?.split('@')[0] || 'Bạn'}
          />
        </div>
      </div>
    </div>
  )
}

export default PostComposerModal
