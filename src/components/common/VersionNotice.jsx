import { useState, useEffect } from 'react'
import '../../styles/version-notice.css'

export default function VersionNotice() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if the user has already seen this version notice
    const versionKey = 'e-xanh-version-notice-v2'
    const hasSeen = localStorage.getItem(versionKey)
    
    if (!hasSeen) {
      // Show after a short delay
      const showTimer = setTimeout(() => {
        setIsVisible(true)
        localStorage.setItem(versionKey, 'true')
      }, 1000)
      
      // Auto hide after 25 seconds
      const hideTimer = setTimeout(() => {
        setIsVisible(false)
      }, 26000)

      return () => {
        clearTimeout(showTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="version-notice-toast slide-up-fade">
      <div className="version-notice-toast__inner">
        <div className="version-notice-toast__icon">🚀</div>
        <div className="version-notice-toast__content">
          <h4>Bản cập nhật mới!</h4>
          <p>E-XANH vừa được tối ưu tỷ lệ ảnh bìa chuẩn và sửa lỗi hiển thị thông tin thành viên. Trải nghiệm ngay nhé!</p>
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
