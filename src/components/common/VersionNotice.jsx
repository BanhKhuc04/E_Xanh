import { useState, useEffect } from 'react'
import { getActiveSiteNotice } from '../../services/siteNoticeService'
import '../../styles/version-notice.css'

export default function VersionNotice() {
  const [isVisible, setIsVisible] = useState(false)
  const [noticeData, setNoticeData] = useState(null)

  useEffect(() => {
    let hideTimer = null

    async function fetchNotice() {
      const { data } = await getActiveSiteNotice()
      if (data && data.version) {
        const versionKey = `e-xanh-version-notice-${data.version}`
        const hasSeen = localStorage.getItem(versionKey)
        
        if (!hasSeen) {
          setNoticeData(data)
          // Show after a short delay
          setTimeout(() => {
            setIsVisible(true)
            localStorage.setItem(versionKey, 'true')
          }, 1000)
          
          // Auto hide after 25 seconds
          hideTimer = setTimeout(() => {
            setIsVisible(false)
          }, 26000)
        }
      }
    }

    fetchNotice()

    return () => {
      if (hideTimer) clearTimeout(hideTimer)
    }
  }, [])

  if (!isVisible || !noticeData) return null

  return (
    <div className="version-notice-toast slide-up-fade">
      <div className="version-notice-toast__inner">
        <div className="version-notice-toast__icon">🚀</div>
        <div className="version-notice-toast__content">
          <h4>{noticeData.title || 'Bản cập nhật mới!'}</h4>
          <p>{noticeData.description || `E-XANH vừa được cập nhật lên phiên bản ${noticeData.version}. Trải nghiệm ngay nhé!`}</p>
        </div>
        <button 
          onClick={() => setIsVisible(false)} 
          className="version-notice-toast__close"
          aria-label="Đóng"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
