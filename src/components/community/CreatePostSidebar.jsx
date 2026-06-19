import PostImage from '../common/PostImage'

function CreatePostSidebar({ form, previewHighlight, previewAuthor = 'Nguyễn Văn A', compact = false }) {
  const previewType = form.type || 'Mẹo tiết kiệm'
  const previewTitle = form.title || 'Tiêu đề bài viết của bạn sẽ hiển thị tại đây.'
  const previewDescription =
    form.description || 'Mô tả ngắn của bài viết sẽ được rút gọn và hiển thị ở đây.'

  return (
    <aside className="create-post-sidebar">
      <section className="create-post-sidebar__card">
        <h2>Trạng thái bài viết</h2>
        <div className="create-post-sidebar__timeline">
          <div className="is-active">
            <strong>Nháp</strong>
            <span>Đang chỉnh sửa</span>
          </div>
          <div>
            <strong>Chờ duyệt</strong>
            <span>Admin kiểm tra</span>
          </div>
          <div>
            <strong>Đã duyệt</strong>
            <span>Hiển thị công khai</span>
          </div>
        </div>
      </section>

      <section className={`create-post-sidebar__card ${previewHighlight ? 'is-highlighted' : ''}`}>
        <h2>Xem trước bài viết</h2>
        <div className="create-post-sidebar__preview">
          <div className="create-post-sidebar__preview-cover" style={{ padding: form.coverPreview ? '0' : undefined, overflow: 'hidden' }}>
            {form.coverPreview ? (
              <PostImage src={form.coverPreview} alt="Preview" variant="preview" aspect="16:9" loading="eager" />
            ) : (
              <>
                <span>Ảnh bìa</span>
                <em>Chờ duyệt</em>
              </>
            )}
          </div>

          <div className="create-post-sidebar__preview-body">
            <span className="create-post-sidebar__preview-tag">{previewType}</span>
            <h3>{previewTitle}</h3>
            <p>{previewDescription}</p>
            <div className="create-post-sidebar__preview-meta">
              <strong>{previewAuthor}</strong>
              <small>Trạng thái: Chờ duyệt</small>
            </div>
          </div>
        </div>
      </section>

      {compact ? (
        <section className="create-post-sidebar__card create-post-sidebar__card--tips">
          <h2>Gửi bài gọn và an toàn</h2>
          <ul>
            <li>Tiêu đề cụ thể, mô tả ngắn rõ ý.</li>
            <li>Nội dung nên có ví dụ thực tế và tránh sao chép.</li>
            <li>Không quảng cáo, không spam, không gửi liên tục.</li>
            <li>Ảnh bìa phù hợp sẽ giúp bài duyệt nhanh hơn.</li>
          </ul>
        </section>
      ) : (
        <>
          <section className="create-post-sidebar__card">
            <h2>Quy định đăng bài</h2>
            <ul>
              <li>Viết rõ ràng, dễ hiểu</li>
              <li>Chia sẻ thông tin hữu ích</li>
              <li>Không sao chép nội dung</li>
              <li>Không spam hoặc quảng cáo</li>
            </ul>
          </section>

          <section className="create-post-sidebar__card create-post-sidebar__card--tips">
            <h2>Mẹo để bài được duyệt nhanh</h2>
            <ul>
              <li>Tiêu đề cụ thể</li>
              <li>Có ví dụ thực tế</li>
              <li>Ảnh minh họa phù hợp</li>
              <li>Nội dung không gây hiểu nhầm</li>
            </ul>
          </section>
        </>
      )}
    </aside>
  )
}

export default CreatePostSidebar
