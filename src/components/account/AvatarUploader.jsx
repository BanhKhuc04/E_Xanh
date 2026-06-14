import { useRef } from 'react'
import { Eye, ImagePlus, Trash2 } from 'lucide-react'
import { getInitials, isValidImageUrl } from '../../utils/avatar'

function AvatarUploader({
  imageUrl,
  displayName,
  email,
  disabled = false,
  onFileSelect,
  onRemove,
  onPreview,
}) {
  const inputRef = useRef(null)

  const hasImage = Boolean(imageUrl && isValidImageUrl(imageUrl))

  return (
    <div className="avatar-uploader">
      <div className="avatar-uploader__preview">
        {hasImage ? (
          <img src={imageUrl} alt={`Ảnh đại diện của ${displayName || 'người dùng'}`} className="avatar-uploader__image" />
        ) : (
          <div className="avatar-uploader__fallback">
            {getInitials(displayName || email || 'EX')}
          </div>
        )}
      </div>

      <div className="avatar-uploader__body">
        <div>
          <strong>Ảnh đại diện</strong>
          <p>Ưu tiên tải ảnh trực tiếp, hỗ trợ JPG, PNG, WebP tối đa 5MB.</p>
        </div>

        <div className="avatar-uploader__actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
          >
            <ImagePlus size={16} />
            Tải ảnh lên
          </button>

          <button
            type="button"
            className="btn btn--ghost"
            onClick={onPreview}
            disabled={disabled || !hasImage}
          >
            <Eye size={16} />
            Xem trước
          </button>

          <button
            type="button"
            className="btn btn--ghost avatar-uploader__danger"
            onClick={onRemove}
            disabled={disabled || !imageUrl}
          >
            <Trash2 size={16} />
            Xóa ảnh
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={onFileSelect}
          disabled={disabled}
          hidden
        />
      </div>
    </div>
  )
}

export default AvatarUploader
