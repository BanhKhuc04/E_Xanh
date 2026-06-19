import { useEffect, useState } from 'react'
import SupportModal from './SupportModal'
import SupportFloatingButton from './SupportFloatingButton'
import { getActiveSiteNotice } from '../../services/siteNoticeService'

const LAST_SEEN_KEY = 'exanh:lastSeenAdminNoticeId'

function SupportCenter() {
  const [notice, setNotice] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasUnreadNotice, setHasUnreadNotice] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadNotice() {
      const { data } = await getActiveSiteNotice()
      if (cancelled || !data) return

      // Use the database's notice as the fallback format
      // In a real system we'd check if it's an admin notice, here we use the active site notice
      const formattedNotice = {
        id: data.id || `admin-notice-${data.version || 'v1'}`,
        title: data.title || 'Cập nhật mới từ admin',
        description: data.description || 'E-XANH đã cập nhật khu vực báo lỗi và liên hệ để hỗ trợ người dùng tốt hơn.',
        created_at: data.updated_at || data.created_at || new Date().toISOString(),
        contact_url: data.contact_url,
        contact_label: data.contact_label,
      }

      setNotice(formattedNotice)

      if (typeof window !== 'undefined') {
        const lastSeenId = window.localStorage.getItem(LAST_SEEN_KEY)
        if (lastSeenId !== String(formattedNotice.id)) {
          setHasUnreadNotice(true)
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
