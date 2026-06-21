import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminAnnouncementManager from '../../components/admin/settings/AdminAnnouncementManager'
import { heroPageOptions } from '../../data/pageHeroes'
import { fetchBannersByPageKeys } from '../../services/bannerService'
import '../../styles/admin.css'
import '../../styles/admin-settings.css'
import ThemeBannerSection from './theme/ThemeBannerSection'

function ThemeSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [bannerMap, setBannerMap] = useState({})

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
    const timerId = window.setTimeout(() => {
      void loadBanners()
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
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

  return (
    <div className="admin-page admin-settings-page">
      <header className="admin-page__header">
        <div className="admin-page__title">
          <h1>Cài đặt giao diện</h1>
          <p>Quản lý hero/banner theo 2 chế độ upload ảnh hoặc upload video, vẫn giữ an toàn cho banner ảnh cũ.</p>
        </div>
      </header>

      <div className="admin-page__content">
        {errorMsg ? <div className="admin-alert admin-alert--error">{errorMsg}</div> : null}
        {successMsg ? <div className="admin-alert admin-alert--success">{successMsg}</div> : null}

        <AdminAnnouncementManager />

        {heroPageOptions.map((item) => (
          <ThemeBannerSection
            key={item.key}
            pageKey={item.key}
            banners={bannerMap[item.key] || []}
            loadBanners={loadBanners}
            loading={loading}
            showMessage={showMessage}
          />
        ))}
      </div>
    </div>
  )
}

export default ThemeSettingsPage
