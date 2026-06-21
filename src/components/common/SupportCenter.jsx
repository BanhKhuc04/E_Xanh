import { useEffect, useState } from 'react'
import SupportModal from './SupportModal'
import SupportFloatingButton from './SupportFloatingButton'

const LAST_SEEN_KEY = 'exanh:lastSeenAdminNoticeId'

function SupportCenter() {
  const [notice, setNotice] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasUnreadNotice, setHasUnreadNotice] = useState(false)

  useEffect(() => {
    let cancelled = false

    function loadNotice() {
      // In a real system we'd check an admin_notices endpoint
      // Using a local static notice to avoid semantic mismatch with public site notices
      const staticAdminNotice = {
        id: 'admin-notice-v1',
        title: 'Cập nhật khu vực Hỗ trợ',
        description: 'E-XANH đã cải thiện khu vực báo lỗi và hỗ trợ trực tuyến để phục vụ bạn tốt hơn.',
        created_at: new Date('2024-01-01').toISOString(),
        contact_url: '/lien-he',
        contact_label: 'Liên hệ Hỗ trợ',
      }

      if (!cancelled) {
        setNotice(staticAdminNotice)

        if (typeof window !== 'undefined') {
          const lastSeenId = window.localStorage.getItem(LAST_SEEN_KEY)
          if (lastSeenId !== String(staticAdminNotice.id)) {
            setHasUnreadNotice(true)
          }
        }
      }
    }

    loadNotice()

    return () => {
      cancelled = true
    }
  }, [])

  function handleMarkSeen(id) {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(LAST_SEEN_KEY, String(id))
    setHasUnreadNotice(false)
  }

  return (
    <>
      <SupportModal
        open={isModalOpen}
        notice={notice}
        isNew={hasUnreadNotice}
        onClose={() => setIsModalOpen(false)}
        onMarkSeen={handleMarkSeen}
      />

      <SupportFloatingButton
        onClick={() => setIsModalOpen(true)}
        hasUnreadNotice={hasUnreadNotice}
      />
    </>
  )
}

export default SupportCenter
