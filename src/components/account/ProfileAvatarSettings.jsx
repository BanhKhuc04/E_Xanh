import { useEffect, useMemo, useState } from 'react'
import AvatarUploader from './AvatarUploader'
import ImageCropModal from '../common/ImageCropModal'
import { uploadAvatarImage, updateProfile } from '../../services/profileService'
import {
  ALLOWED_PROFILE_IMAGE_TYPES,
  validateImageFile,
} from '../../utils/fileValidation'

function ProfileAvatarSettings({
  currentAvatarUrl,
  displayName,
  email,
  onAvatarUpdated,
}) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl || '')
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null)
  const [cropSource, setCropSource] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  useEffect(() => {
    setAvatarUrl(currentAvatarUrl || '')
  }, [currentAvatarUrl])

  const previewUrl = useMemo(() => {
    if (!pendingAvatarFile) return avatarUrl
    return URL.createObjectURL(pendingAvatarFile)
  }, [avatarUrl, pendingAvatarFile])

  useEffect(() => () => {
    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleFileSelect(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file, {
      allowedTypes: ALLOWED_PROFILE_IMAGE_TYPES,
      invalidTypeMessage: 'Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.',
      sizeMessage: 'Ảnh đại diện không được vượt quá 5MB.',
    })

    if (!validation.valid) {
      setMessage({ text: validation.error, type: 'error' })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setCropSource(String(reader.result || ''))
      setMessage({ text: '', type: '' })
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  async function handleCropApply(croppedBlob) {
    const croppedFile = new File([croppedBlob], 'avatar-cropped.jpeg', {
      type: 'image/jpeg',
    })
    setPendingAvatarFile(croppedFile)
    setCropSource('')
    setMessage({ text: 'Ảnh đại diện đã sẵn sàng để lưu.', type: 'success' })
  }

  function handleCancelPending() {
    setPendingAvatarFile(null)
    setMessage({ text: '', type: '' })
  }

  async function handleSaveAvatar() {
    if (!pendingAvatarFile) return

    setLoading(true)
    setMessage({ text: '', type: '' })

    const { publicUrl, error: uploadError } = await uploadAvatarImage(pendingAvatarFile)
    if (uploadError) {
      setMessage({ text: uploadError.message || 'Không thể tải ảnh đại diện lên.', type: 'error' })
      setLoading(false)
      return
    }

    const { error: updateError } = await updateProfile({ avatar_url: publicUrl })
    if (updateError) {
      setMessage({ text: updateError.message || 'Không thể cập nhật ảnh đại diện.', type: 'error' })
      setLoading(false)
      return
    }

    setAvatarUrl(publicUrl)
    setPendingAvatarFile(null)
    setMessage({ text: 'Ảnh đại diện đã được cập nhật.', type: 'success' })
    onAvatarUpdated?.(publicUrl)
    window.dispatchEvent(new Event('profileUpdated'))
    setLoading(false)
  }

  async function handleRemoveAvatar() {
    if (!avatarUrl && !pendingAvatarFile) return

    setLoading(true)
    setMessage({ text: '', type: '' })

    const { error } = await updateProfile({ avatar_url: null })
    if (error) {
      setMessage({ text: error.message || 'Không thể xóa ảnh đại diện.', type: 'error' })
      setLoading(false)
      return
    }

    setAvatarUrl('')
    setPendingAvatarFile(null)
    setMessage({ text: 'Đã xóa ảnh đại diện.', type: 'success' })
    onAvatarUpdated?.('')
    window.dispatchEvent(new Event('profileUpdated'))
    setLoading(false)
  }

  return (
    <section className="settings-media-card">
      <div className="settings-section-card__header">
        <div>
          <span className="settings-section-card__eyebrow">Ảnh đại diện</span>
          <h3>Đại diện nhận diện của bạn trên E-XANH</h3>
        </div>
      </div>

      <AvatarUploader
        imageUrl={previewUrl}
        displayName={displayName}
        email={email}
        disabled={loading}
        onFileSelect={handleFileSelect}
        onRemove={handleRemoveAvatar}
        onPreview={() => setIsPreviewOpen(true)}
      />

      <p className="settings-media-card__hint">
        Gợi ý: dùng ảnh vuông từ 400 x 400px trở lên để avatar rõ và sắc nét trên bài viết, bình luận và hồ sơ.
      </p>

      {pendingAvatarFile ? (
        <div className="settings-media-card__actions">
          <button type="button" className="btn btn--primary" onClick={handleSaveAvatar} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu ảnh đại diện'}
          </button>
          <button type="button" className="btn btn--secondary" onClick={handleCancelPending} disabled={loading}>
            Hủy thay đổi
          </button>
        </div>
      ) : null}

      {message.text ? (
        <div className={`settings-inline-alert settings-inline-alert--${message.type || 'info'}`}>
          {message.text}
        </div>
      ) : null}

      <ImageCropModal
        isOpen={Boolean(cropSource)}
        image={cropSource}
        title="Cắt ảnh đại diện"
        aspect={1}
        cropShape="round"
        confirmLabel="Dùng ảnh này"
        onClose={() => setCropSource('')}
        onApply={handleCropApply}
      />

      {isPreviewOpen && previewUrl ? (
        <div className="ui-modal-overlay" onClick={() => setIsPreviewOpen(false)}>
          <div className="ui-modal ui-modal--crop" onClick={(event) => event.stopPropagation()}>
            <div className="ui-modal__header">
              <div>
                <h2>Xem trước ảnh đại diện</h2>
                <p>Ảnh này sẽ xuất hiện trong hồ sơ, bình luận và các bài viết cộng đồng.</p>
              </div>
              <button type="button" className="ui-modal__close" onClick={() => setIsPreviewOpen(false)} aria-label="Đóng xem trước ảnh">
                ✕
              </button>
            </div>
            <div style={{ padding: '24px', display: 'grid', placeItems: 'center' }}>
              <img
                src={previewUrl}
                alt="Xem trước ảnh đại diện"
                style={{ width: 'min(100%, 320px)', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default ProfileAvatarSettings
