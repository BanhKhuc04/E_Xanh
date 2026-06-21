import { useEffect, useRef, useState } from 'react'
import { uploadProfileCover, updateProfile } from '../../services/profileService'
import ImageCropModal from '../common/ImageCropModal'

const COVER_ASPECT_OPTIONS = [
  {
    key: 'fb-cover',
    label: 'Ảnh bìa chuẩn',
    aspect: 1939 / 811,
    width: 1939,
    height: 811,
  },
]

function ProfileCoverSettings({ currentCoverUrl, onCoverUpdated }) {
  const [coverUrl, setCoverUrl] = useState(currentCoverUrl || '')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [fileToUpload, setFileToUpload] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [imageToCrop, setImageToCrop] = useState(null)
  
  const fileInputRef = useRef(null)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setCoverUrl(currentCoverUrl || '')
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [currentCoverUrl])

  const displayUrl = previewUrl || coverUrl

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    setImageToCrop(objectUrl)
    setIsCropModalOpen(true)
    setMessage({ text: '', type: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCropApply = ({ file }) => {
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    
    setFileToUpload(file)
    setIsCropModalOpen(false)
    setImageToCrop(null)
    setMessage({ text: 'Ảnh bìa đã sẵn sàng để lưu.', type: 'success' })
  }

  const handleCropClose = () => {
    setIsCropModalOpen(false)
    setImageToCrop(null)
  }

  const handleSave = async () => {
    if (!fileToUpload) return

    setLoading(true)
    setMessage({ text: '', type: '' })

    try {
      const { publicUrl, error: uploadError } = await uploadProfileCover(fileToUpload)
      
      if (uploadError) {
        setMessage({ text: uploadError.message, type: 'error' })
        setLoading(false)
        return
      }

      const { error: updateError } = await updateProfile({ cover_url: publicUrl })
      
      if (updateError) {
        setMessage({ text: 'Lỗi cập nhật CSDL: ' + updateError.message, type: 'error' })
      } else {
        setMessage({ text: 'Cập nhật ảnh bìa thành công!', type: 'success' })
        setCoverUrl(publicUrl)
        setPreviewUrl(null)
        setFileToUpload(null)
        if (onCoverUpdated) onCoverUpdated(publicUrl)
        window.dispatchEvent(new Event('profileUpdated'))
      }
    } catch {
      setMessage({ text: 'Đã có lỗi xảy ra.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setPreviewUrl(null)
    setFileToUpload(null)
    setMessage({ text: '', type: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemove = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ảnh bìa?')) return

    setLoading(true)
    setMessage({ text: '', type: '' })

    try {
      const { error } = await updateProfile({ cover_url: null })
      if (error) {
        setMessage({ text: 'Lỗi xóa ảnh bìa: ' + error.message, type: 'error' })
      } else {
        setMessage({ text: 'Đã xóa ảnh bìa.', type: 'success' })
        setCoverUrl('')
        setPreviewUrl(null)
        setFileToUpload(null)
        if (onCoverUpdated) onCoverUpdated(null)
        window.dispatchEvent(new Event('profileUpdated'))
      }
    } catch {
      setMessage({ text: 'Đã có lỗi xảy ra.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="settings-media-card">
      <div className="settings-section-card__header">
        <div>
          <span className="settings-section-card__eyebrow">Ảnh bìa trang cá nhân</span>
          <h3>Banner hiển thị ở đầu hồ sơ công khai</h3>
        </div>
      </div>

      <div className="settings-cover-preview">
        {displayUrl ? (
          <img src={displayUrl} alt="Xem trước ảnh bìa" className="settings-cover-preview__image" />
        ) : (
          <div className="settings-cover-preview__empty">
            <strong>Chưa có ảnh bìa</strong>
            <span>Thêm ảnh tỉ lệ ngang để hồ sơ trông nổi bật hơn.</span>
          </div>
        )}
      </div>

      <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/webp"
          style={{ display: 'none' }}
      />

      <p className="settings-media-card__hint">
        Hỗ trợ JPG, PNG, WebP tối đa 5MB. Ảnh sẽ được nén trước khi upload và hiển thị với `object-fit: cover`.
      </p>

      <div className="settings-media-card__actions">
        {!fileToUpload ? (
          <>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              {coverUrl ? 'Đổi ảnh bìa' : 'Chọn ảnh bìa'}
            </button>
            {coverUrl ? (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={handleRemove}
                disabled={loading}
              >
                Xóa ảnh bìa
              </button>
            ) : null}
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : 'Lưu ảnh bìa'}
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Hủy thay đổi
            </button>
          </>
        )}
      </div>

      {message.text ? (
        <div className={`settings-inline-alert settings-inline-alert--${message.type || 'info'}`}>
          {message.text}
        </div>
      ) : null}

      <ImageCropModal
        isOpen={isCropModalOpen}
        image={imageToCrop}
        title="Căn chỉnh ảnh bìa"
        aspectOptions={COVER_ASPECT_OPTIONS}
        defaultAspectKey="fb-cover"
        cropShape="rect"
        confirmLabel="Áp dụng ảnh bìa"
        onClose={handleCropClose}
        onApply={handleCropApply}
      />
    </section>
  )
}

export default ProfileCoverSettings
