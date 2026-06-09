import { useState, useEffect } from 'react'
import '../../styles/development-notice.css'

function DevelopmentNotice() {
  const [isDismissed, setIsDismissed] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Only check localStorage after mount to avoid hydration mismatch if SSR is used
    const dismissed = localStorage.getItem('exanh_dev_notice_dismissed') === 'true'
    setIsDismissed(dismissed)
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('exanh_dev_notice_dismissed', 'true')
  }

  const ReportIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )

  const formUrl = "https://forms.gle/H7haoeUWb16TNUDw6"

  const handleReportClick = () => {
    window.open(formUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="development-notice-container">
      {!isDismissed ? (
        <div className="development-notice-box">
          <button className="development-notice-close" onClick={handleDismiss} aria-label="Đóng thông báo">
            &times;
          </button>
          <h4 className="development-notice-title">E-XANH đang trong quá trình phát triển</h4>
          <p className="development-notice-desc">
            Website có thể phát sinh lỗi, mong bạn báo lỗi để nhóm phát triển cải thiện.
          </p>
          
          <div className="development-notice-info">
            <p>Phiên bản hiện tại: <strong>Beta v1.0</strong></p>
            <p>Cập nhật gần nhất: <strong>09/06/2026</strong></p>
            <p>Dự kiến cập nhật tiếp theo: <strong>Sắp cập nhật</strong></p>
          </div>
          
          <button onClick={handleReportClick} className="development-report-button">
            <ReportIcon />
            Báo cáo lỗi
          </button>
        </div>
      ) : (
        <button onClick={handleReportClick} className="development-report-button development-notice-mini-btn">
          <ReportIcon />
          Báo lỗi
        </button>
      )}
    </div>
  )
}

export default DevelopmentNotice
