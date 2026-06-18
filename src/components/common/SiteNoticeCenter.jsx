import { useEffect, useMemo, useState } from 'react'
import BugReportModal from './BugReportModal'
import FloatingBugButton from './FloatingBugButton'
import SiteNoticeModal from './SiteNoticeModal'
import { getActiveSiteNotice, getNoticeSeenStorageKey } from '../../services/siteNoticeService'

function SiteNoticeCenter() {
  const [notice, setNotice] = useState(null)
  const [isHeroOpen, setIsHeroOpen] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [panelTab, setPanelTab] = useState('guide')

  useEffect(() => {
    let cancelled = false

    async function loadNotice() {
      const { data } = await getActiveSiteNotice()
      if (cancelled || !data) return

      setNotice(data)

      if (typeof window === 'undefined') return

      const seenKey = getNoticeSeenStorageKey(data.version)
      const hasSeenCurrentVersion = window.localStorage.getItem(seenKey) === 'true'

      if (data.is_active && data.show_on_first_visit && !hasSeenCurrentVersion) {
        setIsHeroOpen(true)
      }
    }

    loadNotice()

    return () => {
      cancelled = true
    }
  }, [])

  const shouldShowFloatingButton = useMemo(
    () => Boolean(notice?.show_bug_button),
    [notice],
  )

  function markCurrentVersionSeen() {
    if (!notice || typeof window === 'undefined') return
    window.localStorage.setItem(getNoticeSeenStorageKey(notice.version), 'true')
  }

  function handleAcknowledge() {
    markCurrentVersionSeen()
    setIsHeroOpen(false)
  }

  function handleCloseHero() {
    handleAcknowledge()
  }

  function handleOpenPanel(nextTab = 'guide') {
    setPanelTab(nextTab)
    setIsPanelOpen(true)
  }

  if (!notice) return null

  return (
    <>
      <SiteNoticeModal
        open={isHeroOpen}
        notice={notice}
        onClose={handleCloseHero}
        onAcknowledge={handleAcknowledge}
        onReport={() => {
          handleAcknowledge()
          handleOpenPanel('report')
        }}
      />

      <BugReportModal
        open={isPanelOpen}
        notice={notice}
        initialTab={panelTab}
        onClose={() => setIsPanelOpen(false)}
      />

      {shouldShowFloatingButton ? (
        <FloatingBugButton onClick={() => handleOpenPanel('report')} />
      ) : null}
    </>
  )
}

export default SiteNoticeCenter
