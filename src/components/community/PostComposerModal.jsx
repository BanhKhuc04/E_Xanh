import CreatePostForm from './CreatePostForm'
import PostLivePreview from './PostLivePreview'
import ComposerSplitLayout from './ComposerSplitLayout'
import { usePostComposerForm } from '../../hooks/usePostComposerForm'

function ComposerStatusIcon({ tone }) {
  const commonProps = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  }

  if (tone === 'success' || tone === 'ready') {
    return (
      <svg {...commonProps}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    )
  }

  if (tone === 'error') {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5" />
        <path d="M12 16h.01" />
      </svg>
    )
  }

  if (tone === 'submitting' || tone === 'saving') {
    return (
      <svg {...commonProps}>
        <path d="M12 3a9 9 0 1 0 9 9" />
        <path d="M12 7v5l3 3" />
      </svg>
    )
  }

  return (
    <svg {...commonProps}>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    </svg>
  )
}

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
    composer.handleSaveDraft({ silent: true, label: 'Đã tự động lưu' })
    onClose()
  }

  if (!isOpen) return null

  const status = composer.composerStatus
  const statusFxClass =
    status.tone === 'error'
      ? 'is-alert'
      : status.tone === 'success'
        ? 'is-success-pop'
        : status.tone === 'saving' || status.tone === 'submitting'
          ? 'is-breathing'
          : 'is-settled'

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
              <span className="composer-modal__badge">Soạn bài nhanh</span>
              <h2 id="post-composer-title">Chia sẻ với cộng đồng</h2>
              <p>Soạn bài trong khung rộng rãi, xem trước song song và gửi chờ duyệt mà không rời khỏi trang hiện tại.</p>
            </div>

            <div
              key={`${status.tone}-${status.message}-${status.badge}`}
              className={`composer-status-card composer-status-card--${status.tone} ${statusFxClass}`.trim()}
              role="status"
              aria-live="polite"
            >
              <div className="composer-status-card__header">
                <div className="composer-status-card__icon">
                  <ComposerStatusIcon tone={status.tone} />
                </div>
                <div className="composer-status-card__heading">
                  <span className="composer-status-card__title">{status.title}</span>
                  <span className={`composer-status-card__badge composer-status-card__badge--${status.tone}`}>
                    {status.badge}
                  </span>
                </div>
              </div>

              <div className="composer-status-card__body">
                <p className="composer-status-card__message">{status.message}</p>

                {status.checklist?.length ? (
                  <ul className="composer-status-card__checklist">
                    {status.checklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}

                {status.meta ? <p className="composer-status-card__meta">{status.meta}</p> : null}
              </div>
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
                    onClearDraft={composer.clearDraft}
                    onInsertInlineImage={composer.handleInlineImageUpload}
                    onSubmit={composer.handleSubmit}
                    isSubmitting={composer.isSubmitting}
                    isUploadingInlineImage={composer.isUploadingInlineImage}
                    cropState={composer.cropState}
                    onCropApply={composer.handleCropApply}
                    onCropClose={composer.handleCropClose}
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
                <span>{composer.draftMeta}. Bài viết sẽ được gửi duyệt trước khi hiển thị công khai.</span>
              )}
            </div>

            <div className="composer-modal__footer-actions">
              <button type="button" className="btn btn--ghost" onClick={composer.clearDraft} disabled={composer.isSubmitting}>
                Xóa nháp
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
    </>
  )
}

export default PostComposerModal
