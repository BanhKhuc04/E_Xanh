import { useMemo, useState } from 'react'
import PostBlockRenderer from './PostBlockRenderer'
import { getInitials, isValidImageUrl } from '../../utils/avatar'
import { extractPlainTextFromBlocks } from '../../utils/postBlocks'

const PREVIEW_MODE_STORAGE_KEY = 'e-xanh-composer-preview-mode'

function readDefaultPreviewMode() {
  if (typeof window === 'undefined') {
    return 'feed'
  }

  const savedMode = window.localStorage.getItem(PREVIEW_MODE_STORAGE_KEY)
  return savedMode === 'detail' ? 'detail' : 'feed'
}

function getRoleLabel(role) {
  if (role === 'admin') return 'Quản trị viên'
  if (role === 'moderator') return 'Điều hành viên'
  return 'Thành viên'
}

function parseTags(tags = '') {
  return tags.split(',').map((item) => item.trim()).filter(Boolean)
}

function PostLivePreview({ form, author }) {
  const [viewMode, setViewMode] = useState(readDefaultPreviewMode)
  const [failedCoverUrl, setFailedCoverUrl] = useState('')

  const authorName = author?.name || author?.email?.split('@')[0] || 'Người dùng E-Xanh'
  const authorAvatar = author?.avatar_url || ''
  const roleLabel = getRoleLabel(author?.role)
  const dateStr = new Date().toLocaleDateString('vi-VN')
  const title = form.title?.trim() || 'Tiêu đề bài viết của bạn'
  const description = form.description?.trim() || 'Mô tả ngắn của bài viết sẽ xuất hiện ở đây để người đọc nắm ý chính.'
  const coverUrl = form.coverPreview || ''
  const tags = parseTags(form.tags)
  const fallbackContent = extractPlainTextFromBlocks(form.content_blocks, form.content)

  const previewBlocks = useMemo(() => {
    if (!Array.isArray(form.content_blocks) || form.content_blocks.length === 0) {
      return []
    }

    if (viewMode === 'feed') {
      return form.content_blocks.slice(0, 2)
    }

    return form.content_blocks.slice(0, 6)
  }, [form.content_blocks, viewMode])

  const hasContent =
    fallbackContent.length > 0 ||
    previewBlocks.some((block) => block?.type === 'image' && block.url)

  function handleChangeMode(nextMode) {
    setViewMode(nextMode)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PREVIEW_MODE_STORAGE_KEY, nextMode)
    }
  }

  return (
    <div className={`post-live-preview post-live-preview--${viewMode}`}>
      <div className="post-live-preview__workspace-header">
        <div>
          <span className="post-live-preview__eyebrow">Live Preview</span>
          <h3>Bài viết sẽ hiển thị như thế nào</h3>
        </div>

        <div className="post-live-preview__mode-toggle" role="tablist" aria-label="Chuyển chế độ xem preview">
          <button
            type="button"
            className={viewMode === 'feed' ? 'is-active' : ''}
            onClick={() => handleChangeMode('feed')}
          >
            Dạng lưới
          </button>
          <button
            type="button"
            className={viewMode === 'detail' ? 'is-active' : ''}
            onClick={() => handleChangeMode('detail')}
          >
            Dạng chi tiết
          </button>
        </div>
      </div>

      <div className="post-live-preview__scroll">
        <article className={`post-live-preview__card post-live-preview__card--${viewMode}`}>
          <div className="post-live-preview__cover">
            {coverUrl && failedCoverUrl !== coverUrl ? (
              <img
                src={coverUrl}
                alt="Preview cover"
                className="post-live-preview__cover-image"
                onError={() => setFailedCoverUrl(coverUrl)}
              />
            ) : (
              <div className="post-live-preview__cover-fallback">
                <span>Ảnh cover sẽ nằm ở đây</span>
              </div>
            )}

            {form.type ? (
              <span className="post-live-preview__type-pill">
                {form.type === 'community' ? 'Cộng đồng' : form.type === 'qa' ? 'Hỏi đáp' : form.type === 'review' ? 'Review' : 'Mẹo tiết kiệm'}
              </span>
            ) : null}
          </div>

          <div className="post-live-preview__body">
            <div className="post-live-preview__meta">
              {isValidImageUrl(authorAvatar) ? (
                <img src={authorAvatar} alt={authorName} className="post-live-preview__avatar-image" />
              ) : (
                <span className="post-live-preview__avatar-fallback">{getInitials(authorName)}</span>
              )}

              <div className="post-live-preview__author">
                <strong>{authorName}</strong>
                <span>{roleLabel} • {dateStr}</span>
              </div>
            </div>

            <div className="post-live-preview__headline">
              <h2>{title}</h2>
              <p>{description}</p>
            </div>

            <div className={`post-live-preview__content${hasContent ? '' : ' is-empty'}`}>
              {hasContent ? (
                <PostBlockRenderer
                  blocks={previewBlocks}
                  fallbackContent={
                    viewMode === 'feed'
                      ? `${fallbackContent.slice(0, 200)}${fallbackContent.length > 200 ? '...' : ''}`
                      : fallbackContent
                  }
                  variant={viewMode}
                />
              ) : (
                <p className="post-live-preview__empty">
                  Bài viết của bạn chưa có nội dung. Hãy thêm văn bản hoặc hình ảnh.
                </p>
              )}
            </div>

            {Array.isArray(form.content_blocks) && form.content_blocks.length > previewBlocks.length ? (
              <div className="post-live-preview__continue">... còn tiếp trong bài viết thật ...</div>
            ) : null}

            {tags.length > 0 ? (
              <div className="post-live-preview__tags">
                {tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            ) : null}
          </div>
        </article>
      </div>
    </div>
  )
}

export default PostLivePreview
