import { useEffect, useMemo, useState } from 'react'
import AvatarUploader from './AvatarUploader'
import ImageCropModal from '../common/ImageCropModal'
import { uploadAvatarImage, updateProfile } from '../../services/profileService'
import {
  ALLOWED_PROFILE_IMAGE_TYPES,
  validateImageFile,
} from '../../utils/fileValidation'

function EditProfileModal({ user, onClose, onSuccess }) {
  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '')
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null)
  const [cropSource, setCropSource] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const previewUrl = useMemo(() => {
    if (!pendingAvatarFile) return avatarUrl
    return URL.createObjectURL(pendingAvatarFile)
  }, [avatarUrl, pendingAvatarFile])

  useEffect(() => () => {
    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleManualAvatarChange(value) {
    setAvatarUrl(value)
    setPendingAvatarFile(null)
  }

  function handleRemoveAvatar() {
    setPendingAvatarFile(null)
    setAvatarUrl('')
    setIsPreviewOpen(false)
  }

  function handleFileSelect(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file, {
      allowedTypes: ALLOWED_PROFILE_IMAGE_TYPES,
      invalidTypeMessage: 'Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.',
      sizeMessage: 'Ảnh đại diện không được vượt quá 5MB.',
    })

    if (!validation.valid) {
      setError(validation.error)
      setSuccess('')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setCropSource(String(reader.result || ''))
      setError('')
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
    setSuccess('Ảnh đại diện đã sẵn sàng để lưu.')
  }

  async function handleSubmit(event) {
    event?.preventDefault?.()

    if (!name.trim()) {
      setError('Tên hiển thị không được để trống.')
      setSuccess('')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    let nextAvatarUrl = avatarUrl.trim()

    if (pendingAvatarFile) {
      const { publicUrl, error: uploadError } = await uploadAvatarImage(pendingAvatarFile)
      if (uploadError) {
        setError(uploadError.message || 'Không thể tải ảnh đại diện lên.')
        setLoading(false)
        return
      }

      nextAvatarUrl = publicUrl
    }

    const updates = {
      name: name.trim(),
      bio: bio.trim(),
      avatar_url: nextAvatarUrl,
    }

    const { error: updateError } = await updateProfile(updates)
    if (updateError) {
      setError(updateError.message || 'Đã xảy ra lỗi khi cập nhật.')
      setLoading(false)
      return
    }

    setSuccess('Cập nhật hồ sơ thành công.')
    window.dispatchEvent(new Event('profileUpdated'))

    window.setTimeout(() => {
      onSuccess?.()
    }, 800)
  }

  return (
    <>
      <div className="account-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
        <div className="account-modal account-modal--wide">
          <div className="account-modal__header">
            <h2 id="edit-profile-title">Chỉnh sửa hồ sơ</h2>
            <p>Cập nhật hồ sơ theo cách trực quan hơn: tải ảnh, cắt trước khi lưu và xem lại ngay trong modal.</p>
            <button
              type="button"
              className="account-modal__close"
              onClick={onClose}
              aria-label="Đóng chỉnh sửa hồ sơ"
              disabled={loading}
            >
              ✕
            </button>
          </div>

          <div className="account-modal__body account-modal__body--stack">
            {success ? <div className="account-modal__success">{success}</div> : null}
            {error ? <div className="account-modal__main-error">{error}</div> : null}

            <AvatarUploader
              imageUrl={previewUrl}
              displayName={name || user?.name}
              email={user?.email}
              disabled={loading}
              onFileSelect={handleFileSelect}
              onRemove={handleRemoveAvatar}
              onPreview={() => setIsPreviewOpen(true)}
            />

            <form onSubmit={handleSubmit} className="account-modal__form">
              <div className="account-modal__field">
                <label htmlFor="profile-name">Tên hiển thị *</label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="account-modal__field">
                <label htmlFor="profile-bio">Tiểu sử</label>
                <textarea
                  id="profile-bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  disabled={loading}
                  placeholder="Giới thiệu ngắn về bạn..."
                />
              </div>

              <div className="account-modal__field">
                <label htmlFor="profile-avatar-url">URL ảnh đại diện (tuỳ chọn)</label>
                <input
                  id="profile-avatar-url"
                  type="url"
                  value={avatarUrl}
                  onChange={(event) => handleManualAvatarChange(event.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  disabled={loading}
                />
                <small>Nếu muốn, bạn vẫn có thể dùng URL ảnh. Tuy nhiên tải file trực tiếp là cách chính.</small>
              </div>
            </form>
          </div>

          <div className="account-modal__actions">
            <button
              type="button"
              className="btn account-modal__secondary"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="button"
              className="btn account-modal__primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </div>

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
                <p>Đây là ảnh sẽ xuất hiện trên hồ sơ và trong cộng đồng.</p>
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
    </>
  )
}

export default EditProfileModal
