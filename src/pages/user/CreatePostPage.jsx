import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import CreatePostForm from '../../components/community/CreatePostForm'
import CreatePostSidebar from '../../components/community/CreatePostSidebar'
import PageHero from '../../components/common/PageHero'
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
    <div className="create-post-page">
      <PageHero
        pageKey="community"
        badge="Fallback route"
        title="Đăng bài chia sẻ"
        description="Trang này vẫn được giữ để không phá link cũ, nhưng dùng cùng composer UI như modal trong cộng đồng."
        fallbackImage="/images/fallback-green.jpg"
        imageAlt="Minh họa người dùng đang viết bài chia sẻ sống xanh"
      />

      <section className="create-post-page__alert">
        <strong>Quy trình duyệt bài</strong>
        <p>
          Bài viết của bạn sẽ được gửi ở trạng thái Chờ duyệt. Admin sẽ kiểm tra nội dung trước khi hiển thị công khai.
        </p>
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
        />

        <CreatePostSidebar
          form={composer.form}
          previewHighlight={composer.previewHighlight}
          previewAuthor={composer.profile?.name || composer.user?.email?.split('@')[0] || 'Bạn'}
        />
      </div>
    </div>
  )
}

export default CreatePostPage
