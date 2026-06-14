import { useState } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../../utils/cropImage'

function ImageCropModal({
  isOpen,
  image,
  title = 'Cắt ảnh',
  aspect = 1,
  cropShape = 'rect',
  confirmLabel = 'Áp dụng',
  onClose,
  onApply,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!isOpen || !image) return null

  function handleCropComplete(_, nextPixels) {
    setCroppedAreaPixels(nextPixels)
  }

  async function handleApply() {
    if (!croppedAreaPixels || loading) return

    setLoading(true)
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels)
      await onApply?.(croppedBlob)
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
            <p>Di chuyển và phóng to ảnh trước khi lưu.</p>
          </div>
          <button type="button" className="ui-modal__close" onClick={onClose} disabled={loading} aria-label="Đóng cắt ảnh">
            ✕
          </button>
        </div>

        <div className="ui-cropper">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
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
