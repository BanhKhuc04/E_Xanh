import { useEffect, useMemo, useState } from 'react'
import { fetchWebsiteAnnouncements } from '../../services/announcementService'
import { logError, logWarn } from '../../utils/logger'

function isAnnouncementDismissed() {
  // Yêu cầu: Luôn hiển thị lại thông báo khi F5, không lưu trạng thái đã đóng vào localStorage nữa
  return false
}

function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadAnnouncements() {
      try {
        const { data, error, meta } = await fetchWebsiteAnnouncements({ activeOnly: true })
        if (!isMounted) return

        if (error) {
          setLoadError(error.message)
          setAnnouncements([])
          console.error('[E-XANH][announcement] Không tải được AnnouncementBar:', error)
        } else {
          setLoadError('')
          setAnnouncements(data || [])

          if ((data || []).length === 0) {
            logWarn('[E-XANH][announcement] No announcement rendered on public UI.', meta)
          }
        }
      } catch (error) {
        if (!isMounted) return
        const message = error?.message || 'Unknown announcement error.'
        setLoadError(message)
        setAnnouncements([])
        logError('[E-XANH][announcement] Unexpected public fetch failure:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadAnnouncements()

    return () => {
      isMounted = false
    }
  }, [])

  const visibleAnnouncement = useMemo(() => {
    return announcements.find((announcement) => !isAnnouncementDismissed(announcement.id, announcement.updated_at))
  }, [announcements])

  const displayType = useMemo(() => {
    if (!visibleAnnouncement) return 'top_bar'
    return visibleAnnouncement.display_type === 'banner'
      ? 'marquee'
      : (visibleAnnouncement.display_type || 'top_bar')
  }, [visibleAnnouncement])

  useEffect(() => {
    if (!loading && !loadError && announcements.length > 0 && !visibleAnnouncement) {
      logWarn('[E-XANH][announcement] All active announcements are dismissed in this browser.', {
        total: announcements.length,
      })
    }
  }, [announcements, loadError, loading, visibleAnnouncement])

  useEffect(() => {
    if (loading || !visibleAnnouncement || displayType === 'popup') {
      document.documentElement.style.setProperty('--announcement-offset', '0px')
      return () => {
        document.documentElement.style.setProperty('--announcement-offset', '0px')
      }
    }

    document.documentElement.style.setProperty('--announcement-offset', displayType === 'marquee' ? '64px' : '52px')

    return () => {
      document.documentElement.style.setProperty('--announcement-offset', '0px')
    }
  }, [displayType, loading, visibleAnnouncement])

  if (loading || !visibleAnnouncement) {
    return null
  }

  function handleDismiss() {
    setAnnouncements((current) =>
      current.filter((announcement) => announcement.id !== visibleAnnouncement.id)
    )
  }

  const typeClassName = `announcement-bar--${visibleAnnouncement.type || 'info'}`
  const displayClassName = `announcement-bar--${displayType}`

  function renderMarqueeSegment(duplicate = false) {
    return (
      <span className="announcement-bar__marquee-item" aria-hidden={duplicate}>
        {visibleAnnouncement.title ? (
          <>
            <strong className="announcement-bar__title">{visibleAnnouncement.title}</strong>
            <span className="announcement-bar__marquee-separator">•</span>
          </>
        ) : null}
        <span className="announcement-bar__message">{visibleAnnouncement.message}</span>
      </span>
    )
  }

  if (displayType === 'popup') {
    return (
      <div className="announcement-popup-overlay" role="dialog" aria-modal="true" aria-label={visibleAnnouncement.title || 'Thông báo website'}>
        <section
          className={['announcement-bar', 'announcement-bar--popup-card', typeClassName].filter(Boolean).join(' ')}
          aria-label={visibleAnnouncement.title || 'Thông báo website'}
        >
          <div className="announcement-bar__content">
            {visibleAnnouncement.title ? (
              <strong className="announcement-bar__title">{visibleAnnouncement.title}</strong>
            ) : null}
            <p className="announcement-bar__message">{visibleAnnouncement.message}</p>
          </div>

          <div className="announcement-bar__actions">
            {visibleAnnouncement.cta_label && visibleAnnouncement.cta_url ? (
              <a
                className="announcement-bar__cta"
                href={visibleAnnouncement.cta_url}
                target={visibleAnnouncement.cta_url.startsWith('http') ? '_blank' : undefined}
                rel={visibleAnnouncement.cta_url.startsWith('http') ? 'noreferrer' : undefined}
              >
                {visibleAnnouncement.cta_label}
              </a>
            ) : null}

            <button type="button" className="announcement-bar__close" onClick={handleDismiss} aria-label="Ẩn thông báo">
              ✕
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <section
      className={['announcement-bar', typeClassName, displayClassName].filter(Boolean).join(' ')}
      aria-label={visibleAnnouncement.title || 'Thông báo website'}
    >
      <div className="shell shell--wide announcement-bar__inner">
        {displayType === 'marquee' ? (
          <div className="announcement-bar__marquee" aria-label={visibleAnnouncement.title || 'Thông báo website'}>
            <div className="announcement-bar__marquee-track">
              {renderMarqueeSegment()}
              <span className="announcement-bar__marquee-copy" aria-hidden="true">
                {renderMarqueeSegment(true)}
              </span>
            </div>
          </div>
        ) : (
          <div className="announcement-bar__content">
            {visibleAnnouncement.title ? (
              <strong className="announcement-bar__title">{visibleAnnouncement.title}</strong>
            ) : null}
            <p className="announcement-bar__message">{visibleAnnouncement.message}</p>
          </div>
        )}

        <div className="announcement-bar__actions">
          {visibleAnnouncement.cta_label && visibleAnnouncement.cta_url ? (
            <a
              className="announcement-bar__cta"
              href={visibleAnnouncement.cta_url}
              target={visibleAnnouncement.cta_url.startsWith('http') ? '_blank' : undefined}
              rel={visibleAnnouncement.cta_url.startsWith('http') ? 'noreferrer' : undefined}
            >
              {visibleAnnouncement.cta_label}
            </a>
          ) : null}

          <button type="button" className="announcement-bar__close" onClick={handleDismiss} aria-label="Ẩn thông báo">
            ✕
          </button>
        </div>
      </div>
    </section>
  )
}

export default AnnouncementBar
