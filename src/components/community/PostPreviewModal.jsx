import PostBlockRenderer from './PostBlockRenderer'
import { extractPlainTextFromBlocks } from '../../utils/postBlocks'
import PostImage from '../common/PostImage'

function PostPreviewModal({
  isOpen,
  form,
  onClose,
  authorName,
}) {
  if (!isOpen) return null

  // Calculate length for warning
  const blocksContent = extractPlainTextFromBlocks(form.content_blocks, form.content)
  
  const isTooShort = (blocksContent || '').trim().length < 80

  return (
    <div className="ui-modal-overlay" role="dialog" aria-modal="true" style={{ zIndex: 1100 }}>
      <div className="ui-modal" style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="ui-modal__header">
          <div>
            <h2>Xem trước bài viết</h2>
          </div>
          <button type="button" className="ui-modal__close" onClick={onClose} aria-label="Đóng xem trước">
            ✕
          </button>
        </div>

        <div className="ui-modal__body" style={{ overflowY: 'auto', padding: '24px', flex: 1, backgroundColor: '#fff' }}>
          {isTooShort && (
            <div style={{ background: '#fff3cd', color: '#856404', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.875rem' }}>
              ⚠️ Bài viết chưa đủ điều kiện đăng (cần tối thiểu 80 ký tự nội dung). Bạn vẫn có thể xem trước hiển thị.
            </div>
          )}
          
          <article className="post-preview">
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px', lineHeight: 1.2 }}>{form.title || 'Tiêu đề bài viết'}</h1>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>
              <span>Tác giả: <strong>{authorName || 'Bạn'}</strong></span>
              <span>•</span>
              <span>Thể loại: {form.type || 'Chưa chọn'}</span>
            </div>

            {form.coverPreview && (
              <div style={{ marginBottom: '32px' }}>
                <PostImage src={form.coverPreview} alt="Cover" variant="detail" loading="eager" />
              </div>
            )}

            <div className="post-preview__content" style={{ fontSize: '1.125rem' }}>
              <PostBlockRenderer 
                blocks={form.content_blocks} 
                fallbackContent={form.content} 
              />
            </div>
          </article>
        </div>

        <div className="ui-modal__footer">
          <button type="button" className="btn btn--secondary" onClick={onClose}>
            Đóng xem trước
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostPreviewModal
