function CreatePostForm({
  form,
  errorMessage,
  successMessage,
  infoMessage,
  onChange,
  onCoverChange,
  onSaveDraft,
  onPreview,
  onSubmit,
}) {
  return (
    <div className="create-post-form">
      <div className="create-post-form__messages">
        {errorMessage ? <div className="create-post-form__message create-post-form__message--error">{errorMessage}</div> : null}
        {successMessage ? (
          <div className="create-post-form__message create-post-form__message--success">{successMessage}</div>
        ) : null}
        {infoMessage ? <div className="create-post-form__message create-post-form__message--info">{infoMessage}</div> : null}
      </div>

      <label className="create-post-form__field">
        <span>Tiêu đề bài viết</span>
        <input
          type="text"
          value={form.title}
          onChange={(event) => onChange('title', event.target.value)}
          placeholder="Ví dụ: 5 cách dùng điều hòa tiết kiệm điện mùa nóng"
        />
      </label>

      <div className="create-post-form__row">
        <label className="create-post-form__field">
          <span>Loại bài viết</span>
          <select value={form.type} onChange={(event) => onChange('type', event.target.value)}>
            <option value="">Chọn loại bài...</option>
            <option value="tip">Mẹo tiết kiệm</option>
            <option value="community">Chia sẻ cộng đồng</option>
            <option value="qa">Hỏi đáp</option>
            <option value="review">Review thiết bị</option>
          </select>
        </label>

        <label className="create-post-form__field">
          <span>Danh mục</span>
          <select value={form.category} onChange={(event) => onChange('category', event.target.value)}>
            <option value="">Chọn thiết bị/chủ đề...</option>
            <option value="Điều hòa">Điều hòa</option>
            <option value="Laptop">Laptop</option>
            <option value="Đèn học">Đèn học</option>
            <option value="Tủ lạnh">Tủ lạnh</option>
            <option value="Thiết bị gia dụng">Thiết bị gia dụng</option>
            <option value="Thói quen xanh">Thói quen xanh</option>
            <option value="Phòng trọ">Phòng trọ</option>
          </select>
        </label>
      </div>

      <label className="create-post-form__field">
        <span>Mô tả ngắn</span>
        <textarea
          rows="3"
          value={form.description}
          onChange={(event) => onChange('description', event.target.value)}
          placeholder="Tóm tắt nội dung bài viết trong 1–2 câu..."
        />
      </label>

      <label className="create-post-form__field">
        <span>Ảnh bìa</span>
        <input className="create-post-form__file-input" type="file" accept="image/jpeg,image/png,image/webp,image/jpg" onChange={onCoverChange} />
        <div className="create-post-form__upload-box" style={{ padding: form.coverPreview ? '0' : undefined, overflow: 'hidden' }}>
          {form.coverPreview ? (
            <img src={form.coverPreview} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
          ) : (
            <>
              <strong>Kéo thả ảnh vào đây hoặc chọn ảnh từ máy</strong>
              <small>Hỗ trợ JPG, PNG, WEBP. Kích thước tối đa 5MB</small>
            </>
          )}
        </div>
      </label>

      <label className="create-post-form__field">
        <span>Nội dung bài viết</span>
        <textarea
          className="create-post-form__content"
          rows="12"
          value={form.content}
          onChange={(event) => onChange('content', event.target.value)}
          placeholder="Viết nội dung chia sẻ của bạn tại đây..."
        />
      </label>

      <label className="create-post-form__field">
        <span>Tags</span>
        <input
          type="text"
          value={form.tags}
          onChange={(event) => onChange('tags', event.target.value)}
          placeholder="Ví dụ: điều hòa, phòng trọ, tiết kiệm điện"
        />
      </label>

      <div className="create-post-form__actions">
        <button type="button" className="btn create-post-form__draft" onClick={onSaveDraft}>
          Lưu nháp
        </button>
        <button type="button" className="btn btn--secondary" onClick={onPreview}>
          Xem trước
        </button>
        <button type="button" className="btn btn--primary" onClick={onSubmit}>
          Gửi bài chờ duyệt
        </button>
      </div>
    </div>
  )
}

export default CreatePostForm
