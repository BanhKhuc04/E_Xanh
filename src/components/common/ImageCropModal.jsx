import { useMemo, useState } from 'react'
import Cropper from 'react-easy-crop'
import { cropImageSourceToFile } from '../../utils/cropImage'
import {
  getPostImageAspectOptions,
  getPostImageAspectPreset,
  normalizePostImageAspectKey,
} from '../../utils/postImageRatios'

function ImageCropModal({
  isOpen,
  image,
  title = 'Cắt ảnh',
  cropShape = 'rect',
  confirmLabel = 'Áp dụng',
  aspectOptions = getPostImageAspectOptions(),
  defaultAspectKey = '16:9',
  originalFileName = 'post-image',
  onClose,
  onApply,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [selectedAspectKey, setSelectedAspectKey] = useState(defaultAspectKey || '16:9')
  const [loading, setLoading] = useState(false)

  const normalizedOptions = useMemo(
    () => (Array.isArray(aspectOptions) && aspectOptions.length > 0 ? aspectOptions : getPostImageAspectOptions()),
    [aspectOptions],
  )
  const activePreset = useMemo(
    () => {
      const found = normalizedOptions.find(opt => opt.key === selectedAspectKey)
      return found || getPostImageAspectPreset(selectedAspectKey)
    },
    [selectedAspectKey, normalizedOptions],
  )

  if (!isOpen || !image) return null

  function handleCropComplete(_, nextPixels) {
    setCroppedAreaPixels(nextPixels)
  }

  async function handleApply() {
    if (!croppedAreaPixels || loading) return

    setLoading(true)
    try {
      const croppedFile = await cropImageSourceToFile(image, croppedAreaPixels, {
        targetWidth: activePreset.width,
        targetHeight: activePreset.height,
        fileName: originalFileName,
      })
      await onApply?.({
        file: croppedFile,
        aspectKey: selectedAspectKey,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ui-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="image-crop-title">
      <div className="ui-modal ui-modal--crop">
        <div className="ui-modal__header">
          <div>
            <h2 id="image-crop-title">{title}</h2>
            <p>Chọn tỉ lệ hiển thị, di chuyển ảnh và phóng to trước khi lưu.</p>
          </div>
          <button type="button" className="ui-modal__close" onClick={onClose} disabled={loading} aria-label="Đóng cắt ảnh">
            ✕
          </button>
        </div>

        <div className="ui-cropper__presets" role="tablist" aria-label="Chọn tỉ lệ ảnh bài viết">
          {normalizedOptions.map((option) => {
            const isActive = option.key === selectedAspectKey
            return (
              <button
                key={option.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`ui-cropper__preset${isActive ? ' is-active' : ''}`}
                onClick={() => {
                  setSelectedAspectKey(option.key)
                  setCrop({ x: 0, y: 0 })
                  setZoom(1)
                }}
                disabled={loading}
              >
                <strong>{option.label}</strong>
                <span>{option.width} × {option.height}</span>
              </button>
            )
          })}
        </div>

        <div className="ui-cropper">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={activePreset.aspect}
            cropShape={cropShape}
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="ui-cropper__controls">
          <label className="ui-cropper__slider">
            <span>Zoom</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              disabled={loading}
            />
          </label>
          <p className="ui-cropper__hint">
            Ảnh sau khi áp dụng sẽ được xuất theo chuẩn {activePreset.width} × {activePreset.height}.
          </p>
        </div>

        <div className="ui-modal__footer">
          <button type="button" className="btn btn--secondary" onClick={onClose} disabled={loading}>
            Hủy
          </button>
          <button type="button" className="btn btn--primary" onClick={handleApply} disabled={loading}>
            {loading ? 'Đang xử lý...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropModal
