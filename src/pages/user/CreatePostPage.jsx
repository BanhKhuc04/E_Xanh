import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import CreatePostForm from '../../components/community/CreatePostForm'
import PostLivePreview from '../../components/community/PostLivePreview'
import { usePostComposerForm } from '../../hooks/usePostComposerForm'
import '../../styles/create-post.css'

function CreatePostPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const composer = usePostComposerForm({
    defaultType: location.state?.defaultType || 'community',
  })

  useEffect(() => {
    if (!composer.authLoading && !composer.user) {
      navigate('/dang-nhap', {
        state: {
          from: location.pathname,
          message: 'Vui lòng đăng nhập để đăng bài',
        },
      })
    }
  }, [composer.authLoading, composer.user, location.pathname, navigate])

  if (composer.authLoading) {
    return <div className="create-post-page"><div className="shell" style={{ padding: '40px 0', textAlign: 'center' }}>Đang tải...</div></div>
  }

  if (!composer.user) {
    return null
  }

  return (
    <>
      <div className="create-post-page">
        <section className="create-post-page__intro">
          <div className="create-post-page__intro-copy">
            <span className="create-post-page__badge">Không gian soạn bài</span>
            <h1>Viết bài chia sẻ rõ ràng, dễ đọc và dễ duyệt hơn</h1>
            <p>Bài viết sẽ được gửi ở trạng thái chờ duyệt. Nháp được tự động lưu trong lúc bạn soạn.</p>
          </div>

          <div className="create-post-page__intro-note">
            <strong>Quy trình duyệt bài</strong>
            <p>Admin sẽ kiểm tra nội dung trước khi hiển thị công khai trên cộng đồng E-XANH.</p>
          </div>
        </section>

        <div className="create-post-page__layout">
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
            onSubmit={composer.handleSubmit}
            onInsertInlineImage={composer.handleInlineImageUpload}
            isSubmitting={composer.isSubmitting}
            isUploadingInlineImage={composer.isUploadingInlineImage}
            cropState={composer.cropState}
            onCropApply={composer.handleCropApply}
            onCropClose={composer.handleCropClose}
            draftMeta={composer.draftMeta}
            cooldownRemaining={composer.cooldownRemaining}
            limits={composer.limits}
          />

          <aside className="create-post-page__preview-column">
            <PostLivePreview form={composer.form} author={composer.profile || composer.user} />
          </aside>
        </div>
      </div>
    </>
  )
}

export default CreatePostPage
