import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Power, PowerOff, Trash2 } from 'lucide-react'
import AdminAnnouncementManager from '../../components/admin/settings/AdminAnnouncementManager'
import ImageCropModal from '../../components/common/ImageCropModal'
import PostImage from '../../components/common/PostImage'
import { getHeroPageLabel, heroPageOptions } from '../../data/pageHeroes'
import {
  addBanner,
  deleteBanner,
  fetchBannersByPageKeys,
  updateBanner,
  uploadBannerImage,
} from '../../services/bannerService'
import '../../styles/admin.css'
import '../../styles/admin-settings.css'

function ThemeSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [bannerMap, setBannerMap] = useState({})
  const [cropPageKey, setCropPageKey] = useState('')
  const [cropSource, setCropSource] = useState('')

  const pageKeys = useMemo(() => heroPageOptions.map((item) => item.key), [])

  const loadBanners = useCallback(async () => {
    setLoading(true)
    setErrorMsg('')

    const { data, error } = await fetchBannersByPageKeys(pageKeys)
    if (error) {
      setErrorMsg(`Lỗi khi tải danh sách hero/banner: ${error.message}`)
      setLoading(false)
      return
    }

    const grouped = pageKeys.reduce((accumulator, key) => {
      accumulator[key] = []
      return accumulator
    }, {})

    for (const banner of data) {
      if (!grouped[banner.page_key]) {
        grouped[banner.page_key] = []
      }
      grouped[banner.page_key].push(banner)
    }

    setBannerMap(grouped)
    setLoading(false)
  }, [pageKeys])

  useEffect(() => {
    loadBanners()
  }, [loadBanners])

  function showMessage(message, isError = false) {
    if (isError) {
      setErrorMsg(message)
      setSuccessMsg('')
    } else {
      setSuccessMsg(message)
      setErrorMsg('')
    }

    window.setTimeout(() => {
      setErrorMsg('')
      setSuccessMsg('')
    }, 5000)
  }

  function handleFileChange(event, pageKey) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setCropPageKey(pageKey)
      setCropSource(String(reader.result || ''))
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  async function handleCropSubmit(croppedBlob) {
    if (!cropPageKey) return

    setUploading(true)

    try {
      const { publicUrl, error: uploadError } = await uploadBannerImage(croppedBlob)
      if (uploadError) {
        throw new Error(uploadError.message || 'Lỗi upload ảnh.')
      }

      const nextList = bannerMap[cropPageKey] || []
      const { error: dbError } = await addBanner({
        page_key: cropPageKey,
        image_url: publicUrl,
        title: `${cropPageKey}-hero.jpeg`,
        is_active: true,
        sort_order: nextList.length,
      })

      if (dbError) {
        throw new Error(dbError.message || 'Không thể lưu cấu hình hero.')
      }

      showMessage(`Đã thêm ảnh cho ${getHeroPageLabel(cropPageKey)}.`)
      setCropSource('')
      setCropPageKey('')
      await loadBanners()
    } catch (error) {
      showMessage(error.message, true)
    } finally {
      setUploading(false)
    }
  }

  async function handleToggleActive(banner) {
    const { error } = await updateBanner(banner.id, { is_active: !banner.is_active })
    if (error) {
      showMessage(`Lỗi cập nhật trạng thái: ${error.message}`, true)
      return
    }

    await loadBanners()
  }

  async function handleDelete(banner) {
    if (!window.confirm(`Xóa ảnh của ${getHeroPageLabel(banner.page_key)}?`)) return

    const { error } = await deleteBanner(banner.id, banner.image_url)
    if (error) {
      showMessage(`Lỗi khi xóa: ${error.message}`, true)
      return
    }

    showMessage('Đã xóa ảnh hero.')
    await loadBanners()
  }

  async function handleMove(pageKey, bannerId, direction) {
    const banners = [...(bannerMap[pageKey] || [])]
    const index = banners.findIndex((item) => item.id === bannerId)
    if (index < 0) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= banners.length) return

    const currentBanner = banners[index]
    const targetBanner = banners[targetIndex]

    const currentOrder = currentBanner.sort_order
    currentBanner.sort_order = targetBanner.sort_order
    targetBanner.sort_order = currentOrder

    const firstUpdate = await updateBanner(currentBanner.id, { sort_order: currentBanner.sort_order })
    const secondUpdate = await updateBanner(targetBanner.id, { sort_order: targetBanner.sort_order })

    if (firstUpdate.error || secondUpdate.error) {
      showMessage('Không thể cập nhật thứ tự hiển thị.', true)
      return
    }

    await loadBanners()
  }

  function renderBannerSection(pageKey) {
    const banners = bannerMap[pageKey] || []

    return (
      <section key={pageKey} className="admin-section" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{getHeroPageLabel(pageKey)}</h2>
            <p style={{ margin: '6px 0 0', color: 'var(--color-text-muted)' }}>
              Quản lý ảnh hero/banner cho trang này. Ảnh active đầu tiên sẽ được ưu tiên hiển thị ngoài public.
            </p>
          </div>

          <label className="btn btn--primary" style={{ cursor: 'pointer' }}>
            <Plus size={18} />
            <span>{uploading && cropPageKey === pageKey ? 'Đang tải lên...' : 'Thêm ảnh'}</span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={(event) => handleFileChange(event, pageKey)}
              disabled={uploading}
              hidden
            />
          </label>
        </div>

        {loading ? <p>Đang tải...</p> : null}
        {!loading && banners.length === 0 ? (
          <p className="text-muted">Chưa có ảnh nào cho trang này.</p>
        ) : null}

        {!loading && banners.length > 0 ? (
          <div className="banner-grid" style={{ display: 'grid', gap: '18px', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {banners.map((banner, index) => (
              <article key={banner.id} className="admin-card" style={{ padding: '16px', display: 'grid', gap: '14px' }}>
                <PostImage src={banner.image_url} alt={`${getHeroPageLabel(pageKey)} banner`} variant="card" />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <span className="page-badge page-badge--soft">
                    {banner.is_active ? 'Đang hoạt động' : 'Đã ẩn'}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
                    Thứ tự #{(banner.sort_order ?? index) + 1}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
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

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => handleMove(pageKey, banner.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => handleMove(pageKey, banner.id, 'down')}
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
    )
  }

  return (
    <div className="admin-page admin-settings-page">
      <header className="admin-page__header">
        <div className="admin-page__title">
          <h1>Cài đặt giao diện</h1>
          <p>Quản lý tập trung hero images, page banners và thứ tự hiển thị cho toàn bộ trải nghiệm E-XANH.</p>
        </div>
      </header>

      <div className="admin-page__content">
        {errorMsg ? <div className="admin-alert admin-alert--error">{errorMsg}</div> : null}
        {successMsg ? <div className="admin-alert admin-alert--success">{successMsg}</div> : null}

        <AdminAnnouncementManager />

        {heroPageOptions.map((item) => renderBannerSection(item.key))}
      </div>

      <ImageCropModal
        isOpen={Boolean(cropSource)}
        image={cropSource}
        title={`Cắt ảnh cho ${getHeroPageLabel(cropPageKey)}`}
        aspect={heroPageOptions.find((item) => item.key === cropPageKey)?.aspectRatio || 16 / 9}
        confirmLabel="Cắt & lưu ảnh"
        onClose={() => {
          setCropSource('')
          setCropPageKey('')
        }}
        onApply={handleCropSubmit}
      />
    </div>
  )
}

export default ThemeSettingsPage
