import { useEffect, useState } from 'react'
import { getActiveSiteNotice } from '../../services/siteNoticeService'
import SupportModal from './SupportModal'
import SupportFloatingButton from './SupportFloatingButton'

const LAST_SEEN_KEY = 'exanh:lastSeenAdminNoticeId'

function SupportCenter() {
  const [notice, setNotice] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasUnreadNotice, setHasUnreadNotice] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadNotice() {
      const { data } = await getActiveSiteNotice()
      
      if (!cancelled && data) {
        // Map site notice to support modal notice format
        const dynamicNotice = {
          id: data.id || 'admin-notice-v1',
          title: data.title || 'Thông báo mới nhất từ admin',
          description: data.description || '',
          created_at: data.updated_at || new Date().toISOString(), // Use updated_at since upsert only updates updated_at
          contact_url: data.contact_url || '/lien-he',
          contact_label: data.contact_label || 'Liên hệ Hỗ trợ',
        }

        setNotice(dynamicNotice)

        if (typeof window !== 'undefined') {
          // Use version or updated_at to track unread status if id is same
          const trackId = `${dynamicNotice.id}-${dynamicNotice.created_at}`
          const lastSeenId = window.localStorage.getItem(LAST_SEEN_KEY)
          if (lastSeenId !== trackId) {
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

  function handleMarkSeen() {
    if (typeof window === 'undefined' || !notice) return
    const trackId = `${notice.id}-${notice.created_at}`
    window.localStorage.setItem(LAST_SEEN_KEY, trackId)
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
