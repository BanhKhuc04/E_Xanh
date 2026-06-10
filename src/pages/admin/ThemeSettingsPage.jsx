import { useState, useEffect } from 'react'
import { Plus, Trash2, Power, PowerOff, ArrowUp, ArrowDown } from 'lucide-react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../../utils/cropImage'
import { fetchBanners, uploadBannerImage, addBanner, updateBanner, deleteBanner } from '../../services/bannerService'
import '../../styles/admin.css' // Reuse existing admin styles

function ThemeSettingsPage() {
  const [homeBanners, setHomeBanners] = useState([])
  const [authBanners, setAuthBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [uploading, setUploading] = useState(false)

  // Crop State
  const [showCropModal, setShowCropModal] = useState(false)
  const [imageToCrop, setImageToCrop] = useState(null)
  const [cropPageKey, setCropPageKey] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  // Fetch banners on load
  useEffect(() => {
    loadBanners()
  }, [])

  async function loadBanners() {
    setLoading(true)
    setErrorMsg('')
    try {
      const { data: homeData, error: homeError } = await fetchBanners('home')
      if (homeError) throw homeError
      setHomeBanners(homeData || [])

      const { data: authData, error: authError } = await fetchBanners('auth')
      if (authError) throw authError
      setAuthBanners(authData || [])
    } catch (err) {
      setErrorMsg('Lỗi khi tải danh sách banner: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function showMessage(msg, isError = false) {
    if (isError) {
      setErrorMsg(msg)
      setSuccessMsg('')
    } else {
      setSuccessMsg(msg)
      setErrorMsg('')
    }
    setTimeout(() => {
      setErrorMsg('')
      setSuccessMsg('')
    }, 5000)
  }

  function handleFileChange(event, pageKey) {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setImageToCrop(reader.result)
      setCropPageKey(pageKey)
      setShowCropModal(true)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
    })
    reader.readAsDataURL(file)
    event.target.value = '' // Reset
  }

  function onCropComplete(croppedArea, croppedAreaPixels) {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  async function handleCropSubmit() {
    if (!imageToCrop || !croppedAreaPixels) return

    setUploading(true)
    setErrorMsg('')
    setShowCropModal(false)

    try {
      const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels)
      if (!croppedBlob) throw new Error('Không thể tạo ảnh đã cắt')

      // Upload to storage
      const { publicUrl, error: uploadError } = await uploadBannerImage(croppedBlob)
      if (uploadError) {
        throw new Error(uploadError.message || 'Lỗi upload ảnh.')
      }

      // Add to database
      const newBanner = {
        page_key: cropPageKey,
        image_url: publicUrl,
        title: 'banner_cropped.jpeg',
        is_active: true,
        sort_order: cropPageKey === 'home' ? homeBanners.length : authBanners.length
      }
      
      const { error: dbError } = await addBanner(newBanner)
      if (dbError) {
        throw new Error(dbError.message || 'Lỗi lưu dữ liệu banner.')
      }

      showMessage('Upload banner thành công!')
      loadBanners()
    } catch (err) {
      showMessage(err.message, true)
    } finally {
      setUploading(false)
      setImageToCrop(null)
      setCropPageKey('')
    }
  }

  function handleCancelCrop() {
    setShowCropModal(false)
    setImageToCrop(null)
    setCropPageKey('')
  }

  async function handleToggleActive(banner) {
    try {
      const { error } = await updateBanner(banner.id, { is_active: !banner.is_active })
      if (error) throw error
      loadBanners()
    } catch (err) {
      showMessage('Lỗi cập nhật trạng thái: ' + err.message, true)
    }
  }

  async function handleDelete(banner) {
    if (!window.confirm('Bạn có chắc muốn xóa banner này?')) return

    try {
      const { error } = await deleteBanner(banner.id, banner.image_url)
      if (error) throw error
      showMessage('Đã xóa banner!')
      loadBanners()
    } catch (err) {
      showMessage('Lỗi khi xóa: ' + err.message, true)
    }
  }

  async function handleMove(banner, direction) {
    const list = banner.page_key === 'home' ? [...homeBanners] : [...authBanners]
    const idx = list.findIndex(b => b.id === banner.id)
    if (idx < 0) return

    if (direction === 'up' && idx > 0) {
      // Swap with previous
      const temp = list[idx].sort_order
      list[idx].sort_order = list[idx - 1].sort_order
      list[idx - 1].sort_order = temp
      await updateSortOrders(list[idx], list[idx - 1])
    } else if (direction === 'down' && idx < list.length - 1) {
      // Swap with next
      const temp = list[idx].sort_order
      list[idx].sort_order = list[idx + 1].sort_order
      list[idx + 1].sort_order = temp
      await updateSortOrders(list[idx], list[idx + 1])
    }
  }

  async function updateSortOrders(b1, b2) {
    try {
      await updateBanner(b1.id, { sort_order: b1.sort_order })
      await updateBanner(b2.id, { sort_order: b2.sort_order })
      loadBanners()
    } catch (err) {
      showMessage('Lỗi cập nhật thứ tự: ' + err.message, true)
    }
  }

  function renderBannerList(banners) {
    if (loading) return <p>Đang tải...</p>
    if (banners.length === 0) return <p className="text-muted">Chưa có banner nào. Hãy upload ảnh mới.</p>

    return (
      <div className="banner-grid" style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {banners.map((banner, index) => (
          <div key={banner.id} className="admin-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#eee', borderRadius: '8px', overflow: 'hidden' }}>
              <img 
                src={banner.image_url} 
                alt="Banner" 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {!banner.is_active && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'grid', placeItems: 'center' }}>
                  <span style={{ background: '#333', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Đã ẩn</span>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className={`btn btn--sm ${banner.is_active ? 'btn--outline' : ''}`}
                  onClick={() => handleToggleActive(banner)}
                  title={banner.is_active ? 'Ẩn banner' : 'Hiện banner'}
                  style={{ padding: '8px' }}
                >
                  {banner.is_active ? <PowerOff size={16} /> : <Power size={16} />}
                </button>
                <button 
                  className="btn btn--sm btn--outline" 
                  onClick={() => handleDelete(banner)}
                  title="Xóa banner"
                  style={{ padding: '8px', color: '#dc3545', borderColor: '#dc3545' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                  className="btn btn--sm btn--outline" 
                  onClick={() => handleMove(banner, 'up')}
                  disabled={index === 0}
                  style={{ padding: '6px' }}
                >
                  <ArrowUp size={16} />
                </button>
                <button 
                  className="btn btn--sm btn--outline" 
                  onClick={() => handleMove(banner, 'down')}
                  disabled={index === banners.length - 1}
                  style={{ padding: '6px' }}
                >
                  <ArrowDown size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="admin-page admin-settings-page">
      <header className="admin-page__header">
        <div className="admin-page__title">
          <h1>Cài đặt giao diện</h1>
          <p>Quản lý banner trang chủ và các trang xác thực (Auth)</p>
        </div>
      </header>

      <div className="admin-page__content">
        {errorMsg && <div className="admin-alert admin-alert--error">{errorMsg}</div>}
        {successMsg && <div className="admin-alert admin-alert--success">{successMsg}</div>}

        <section className="admin-section" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Banner Trang chủ</h2>
            <label className="btn btn--primary" style={{ cursor: 'pointer' }}>
              <Plus size={18} />
              <span>{uploading && cropPageKey === 'home' ? 'Đang tải lên...' : 'Thêm banner'}</span>
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/webp" 
                style={{ display: 'none' }} 
                onChange={(e) => handleFileChange(e, 'home')}
                disabled={uploading}
              />
            </label>
          </div>
          {renderBannerList(homeBanners)}
        </section>

        <section className="admin-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Banner Đăng nhập / Đăng ký</h2>
            <label className="btn btn--primary" style={{ cursor: 'pointer' }}>
              <Plus size={18} />
              <span>{uploading && cropPageKey === 'auth' ? 'Đang tải lên...' : 'Thêm banner'}</span>
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/webp" 
                style={{ display: 'none' }} 
                onChange={(e) => handleFileChange(e, 'auth')}
                disabled={uploading}
              />
            </label>
          </div>
          {renderBannerList(authBanners)}
        </section>
      </div>

      {showCropModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', padding: '20px'
        }}>
          <div style={{ flex: 1, position: 'relative', background: '#333', borderRadius: '8px', overflow: 'hidden' }}>
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn btn--outline" onClick={handleCancelCrop} style={{ backgroundColor: '#fff', color: '#333' }}>
              Hủy
            </button>
            <button className="btn btn--primary" onClick={handleCropSubmit}>
              Cắt & Upload Ảnh
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ThemeSettingsPage
