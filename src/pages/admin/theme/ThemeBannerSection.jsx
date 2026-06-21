import { ArrowDown, ArrowUp, Image as ImageIcon, Plus, Power, PowerOff, Trash2, Video } from 'lucide-react'
import HeroMedia from '../../../components/common/HeroMedia'
import ImageCropModal from '../../../components/common/ImageCropModal'
import { getHeroPageLabel, heroPageOptions } from '../../../data/pageHeroes'
import { MAX_VIDEO_SIZE } from '../../../utils/fileValidation'
import { useBannerSection } from './useBannerSection'

const VIDEO_LIMIT_MB = Math.round(MAX_VIDEO_SIZE / (1024 * 1024))

export default function ThemeBannerSection({ pageKey, banners, loadBanners, loading, showMessage }) {
  const {
    draft,
    inlineFeedback,
    uploading,
    cropSource,
    cropFileName,
    setCropSource,
    setCropFileName,
    handleMediaTypeChange,
    handleImageFileChange,
    handleCropSubmit,
    handleManualPosterChange,
    handleVideoChange,
    handleCreateVideoBanner,
    handleToggleActive,
    handleDelete,
    handleMove
  } = useBannerSection(pageKey, banners, loadBanners, showMessage)

  function renderImageUploader() {
    return (
      <div className="banner-upload-card__body">
        <div className="banner-upload-card__field">
          <strong>Ảnh banner</strong>
          <p>
            Chấp nhận JPG, JPEG, PNG, WebP. Ảnh sẽ được cắt theo tỉ lệ 16:9 và tối ưu trước khi lưu.
          </p>
        </div>

        <div className="banner-upload-card__actions">
          <label className="btn btn--primary" style={{ cursor: 'pointer' }}>
            <ImageIcon size={18} />
            <span>
              {uploading && draft.mediaType === 'image'
                ? 'Đang xử lý ảnh...'
                : '+ Upload ảnh'}
            </span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageFileChange}
              disabled={uploading}
              hidden
            />
          </label>
        </div>

        <div className="banner-upload-card__status-list">
          {draft.imageStatus ? (
            <span className="page-badge page-badge--soft">{draft.imageStatus}</span>
          ) : (
            <span className="banner-upload-card__hint">
              Chọn ảnh để mở công cụ crop rồi lưu ngay vào banner của trang này.
            </span>
          )}
        </div>
      </div>
    )
  }

  function renderVideoUploader() {
    const isCurrentUpload = uploading && draft.mediaType === 'video'

    return (
      <div className="banner-upload-card__body banner-upload-card__body--video">
        <div className="banner-upload-card__field">
          <strong>Video banner</strong>
          <p>Chỉ chấp nhận MP4 hoặc WebM, tối đa {VIDEO_LIMIT_MB}MB. Khuyến nghị dưới 5MB để load nhanh hơn. Poster sẽ được tạo tự động từ video.</p>
          <label className="btn btn--secondary" style={{ cursor: 'pointer' }}>
            <Video size={18} />
            <span>{draft.videoName ? 'Đổi video' : 'Chọn video'}</span>
            <input
              type="file"
              accept="video/mp4,video/webm"
              onChange={handleVideoChange}
              disabled={uploading}
              hidden
            />
          </label>
        </div>

        {draft.videoPreview ? (
          <div className="banner-upload-card__preview">
            <div className="banner-upload-card__preview-media">
              <video
                src={draft.videoPreview}
                poster={draft.posterPreview || undefined}
                autoPlay
                controls
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>

            <div className="banner-upload-card__preview-copy">
              <strong>Xem trước banner video</strong>
              <p>Video sẽ autoplay dạng trang trí ở desktop. Mobile, reduced-motion và trường hợp video lỗi sẽ dùng poster tự tạo để fallback.</p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Dung lượng: {(draft.videoSize / (1024 * 1024)).toFixed(2)} MB
                {draft.videoDuration ? ` • Độ dài: ${Math.round(draft.videoDuration)}s` : ''}
              </div>
            </div>
          </div>
        ) : null}

        <div className="banner-upload-card__status-list">
          {draft.videoName ? <span className="page-badge page-badge--soft">Đã chọn video: {draft.videoName}</span> : null}
          {draft.posterName ? <span className="page-badge page-badge--soft">{draft.posterName.includes('fallback') || draft.videoStatusTone === 'warning' ? 'Poster dự phòng: ' : 'Poster: '}{draft.posterName}</span> : null}
          {draft.videoStatus ? (
            <span className={`banner-upload-card__notice banner-upload-card__notice--${draft.videoStatusTone || 'info'}`}>
              {draft.videoStatus}
            </span>
          ) : null}
        </div>

        <div className="banner-upload-card__actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleCreateVideoBanner}
            disabled={uploading || draft.isPreparingVideo || !draft.videoFile || draft.videoStatusTone === 'error'}
          >
            <Plus size={18} />
            {isCurrentUpload ? 'Đang lưu video...' : draft.isPreparingVideo ? 'Đang chuẩn bị video...' : '+ Lưu banner video'}
          </button>

          {(draft.videoFile || draft.posterFile) && (
            <label className="btn btn--secondary" style={{ cursor: 'pointer' }}>
              <ImageIcon size={18} />
              <span>Thay poster thủ công</span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleManualPosterChange}
                disabled={uploading}
                hidden
              />
            </label>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <section key={pageKey} className="admin-section banner-section">
        <div className="banner-section__header">
          <div>
            <h2>{getHeroPageLabel(pageKey)}</h2>
            <p>
              Chọn 1 trong 2 loại banner: ảnh hoặc video. Banner active đầu tiên sẽ được ưu tiên hiển thị ngoài public.
            </p>
          </div>
        </div>

        <article className="admin-card banner-upload-card">
          <div className="banner-upload-card__switch">
            <button
              type="button"
              className={`banner-upload-card__switch-btn ${draft.mediaType === 'image' ? 'is-active' : ''}`}
              onClick={() => handleMediaTypeChange('image')}
            >
              <ImageIcon size={16} />
              Upload ảnh
            </button>
            <button
              type="button"
              className={`banner-upload-card__switch-btn ${draft.mediaType === 'video' ? 'is-active' : ''}`}
              onClick={() => handleMediaTypeChange('video')}
            >
              <Video size={16} />
              Upload video
            </button>
          </div>

          {draft.mediaType === 'image'
            ? renderImageUploader()
            : renderVideoUploader()}

          {inlineFeedback?.message ? (
            <div className={`banner-upload-card__notice banner-upload-card__notice--${inlineFeedback.tone || 'info'}`}>
              {inlineFeedback.message}
            </div>
          ) : null}
        </article>

        {loading ? (
          <div className="banner-grid banner-grid--loading">
            <div className="banner-grid__skeleton"></div>
            <div className="banner-grid__skeleton"></div>
          </div>
        ) : null}

        {!loading && banners.length === 0 ? (
          <p className="text-muted">Chưa có banner nào cho trang này.</p>
        ) : null}

        {!loading && banners.length > 0 ? (
          <div className="banner-grid">
            {banners.map((banner, index) => (
              <article key={banner.id} className="admin-card banner-card">
                <HeroMedia
                  className="banner-card__preview"
                  mediaType={banner.media_type}
                  imageUrl={banner.image_url}
                  videoUrl={banner.video_url}
                  posterUrl={banner.poster_url}
                  alt={`${getHeroPageLabel(pageKey)} banner`}
                />

                <div className="banner-card__meta">
                  <div className="banner-card__meta-left">
                    <span className="page-badge page-badge--soft">
                      {banner.media_type === 'video' ? 'Banner video' : 'Banner ảnh'}
                    </span>
                    <span className="page-badge page-badge--soft">
                      {banner.is_active ? 'Đang hoạt động' : 'Đã ẩn'}
                    </span>
                  </div>
                  <span className="banner-card__order">Thứ tự #{index + 1}</span>
                </div>

                <div className="banner-card__actions">
                  <div className="banner-card__actions-group">
                    <button
                      type="button"
                      className={`btn btn--ghost ${banner.is_active ? '' : 'btn--secondary'}`}
                      onClick={() => handleToggleActive(banner)}
                    >
                      {banner.is_active ? <PowerOff size={16} /> : <Power size={16} />}
                      {banner.is_active ? 'Ẩn' : 'Bật'}
                    </button>

                    <button
                      type="button"
                      className="btn btn--ghost"
                      style={{ color: '#b23b2a' }}
                      onClick={() => handleDelete(banner)}
                    >
                      <Trash2 size={16} />
                      Xóa
                    </button>
                  </div>

                  <div className="banner-card__actions-group">
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => handleMove(banner.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => handleMove(banner.id, 'down')}
                      disabled={index === banners.length - 1}
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <ImageCropModal
        isOpen={Boolean(cropSource)}
        image={cropSource}
        title={`Cắt ảnh cho ${getHeroPageLabel(pageKey)}${cropFileName ? ` • ${cropFileName}` : ''}`}
        aspect={heroPageOptions.find((item) => item.key === pageKey)?.aspectRatio || 16 / 9}
        confirmLabel="Cắt & lưu ảnh"
        onClose={() => {
          setCropSource('')
          setCropFileName('')
        }}
        onApply={handleCropSubmit}
      />
    </>
  )
}
