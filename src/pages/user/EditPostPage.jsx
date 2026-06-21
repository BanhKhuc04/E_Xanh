import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import CreatePostForm from '../../components/community/CreatePostForm'
import PostLivePreview from '../../components/community/PostLivePreview'
import { useEditPostForm } from '../../hooks/useEditPostForm'
import PageLoader from '../../components/common/PageLoader'
import '../../styles/create-post.css'

function EditPostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*, categories(*)')
          .eq('id', id)
          .single()
        
        if (error || !data) {
          navigate('/cong-dong')
          return
        }
        setInitialData(data)
      } catch (err) {
        navigate('/cong-dong')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id, navigate])

  const composer = useEditPostForm({
    postId: id,
    initialData,
    onSuccess: () => {
      setTimeout(() => {
        navigate(initialData?.type === 'tip' ? `/meo-tiet-kiem/${initialData.slug || initialData.id}` : `/cong-dong/${initialData.id}`)
      }, 2000)
    }
  })

  useEffect(() => {
    if (!composer.authLoading && !composer.user) {
      navigate('/dang-nhap', {
        state: {
          from: `/sua-bai/${id}`,
          message: 'Vui lòng đăng nhập để sửa bài',
        },
      })
    } else if (!composer.authLoading && composer.user && initialData && composer.user.id !== initialData.author_id) {
      // Prevent editing someone else's post unless admin (but better handled in backend, here just UX)
      if (composer.profile?.role !== 'admin' && composer.profile?.role !== 'moderator') {
        navigate('/cong-dong')
      }
    }
  }, [composer.authLoading, composer.user, composer.profile, initialData, id, navigate])

  if (composer.authLoading || loading) {
    return (
      <div className="create-post-page">
        <div className="shell">
          <PageLoader />
        </div>
      </div>
    )
  }

  if (!composer.user || !initialData) {
    return null
  }

  return (
    <>
      <div className="create-post-page">
        <section className="create-post-page__intro">
          <div className="create-post-page__intro-copy">
            <span className="create-post-page__badge">Không gian soạn bài</span>
            <h1>Chỉnh sửa bài viết</h1>
            <p>Sau khi sửa xong, bài viết sẽ được gửi lại ở trạng thái chờ duyệt.</p>
          </div>

          <div className="create-post-page__intro-note">
            <strong>Quy trình duyệt bài</strong>
            <p>Admin sẽ kiểm tra lại nội dung trước khi hiển thị công khai trên cộng đồng E-XANH.</p>
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
            onClearDraft={undefined} // No draft feature in edit mode
            onSubmit={composer.handleSubmit}
            onInsertInlineImage={composer.handleInlineImageUpload}
            isSubmitting={composer.isSubmitting}
            isUploadingInlineImage={composer.isUploadingInlineImage}
            cropState={composer.cropState}
            onCropApply={composer.handleCropApply}
            onCropClose={composer.handleCropClose}
            draftMeta={composer.draftMeta}
            cooldownRemaining={0}
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

export default EditPostPage
