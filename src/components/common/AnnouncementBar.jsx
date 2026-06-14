import { useEffect, useMemo, useState } from 'react'
import { fetchWebsiteAnnouncements } from '../../services/announcementService'

const DISMISS_PREFIX = 'exanh_announcement_dismissed_'

function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadAnnouncements() {
      const { data } = await fetchWebsiteAnnouncements({ activeOnly: true })
      if (!isMounted) return
      setAnnouncements(data || [])
      setLoading(false)
    }

    loadAnnouncements()

    return () => {
      isMounted = false
    }
  }, [])

  const visibleAnnouncement = useMemo(() => {
    return announcements.find(
      (announcement) =>
        !localStorage.getItem(`${DISMISS_PREFIX}${announcement.id}`)
    )
  }, [announcements])

  useEffect(() => {
    if (loading || !visibleAnnouncement) {
      document.documentElement.style.setProperty('--announcement-offset', '0px')
      return () => {
        document.documentElement.style.setProperty('--announcement-offset', '0px')
      }
    }

    document.documentElement.style.setProperty('--announcement-offset', '52px')

    return () => {
      document.documentElement.style.setProperty('--announcement-offset', '0px')
    }
  }, [loading, visibleAnnouncement])

  if (loading || !visibleAnnouncement) {
    return null
  }

  function handleDismiss() {
    localStorage.setItem(`${DISMISS_PREFIX}${visibleAnnouncement.id}`, '1')
    setAnnouncements((current) =>
      current.filter((announcement) => announcement.id !== visibleAnnouncement.id)
    )
  }

  const typeClassName = `announcement-bar--${visibleAnnouncement.type || 'info'}`
  const modeClassName =
    visibleAnnouncement.display_mode === 'marquee'
      ? 'announcement-bar--marquee'
      : ''

  return (
    <section className={['announcement-bar', typeClassName, modeClassName].filter(Boolean).join(' ')}>
      <div className="shell shell--wide announcement-bar__inner">
        <div className="announcement-bar__content">
          {visibleAnnouncement.title ? (
            <strong className="announcement-bar__title">{visibleAnnouncement.title}</strong>
          ) : null}

          {visibleAnnouncement.display_mode === 'marquee' ? (
            <div className="announcement-bar__marquee">
              <div className="announcement-bar__marquee-track">
                <span>{visibleAnnouncement.message}</span>
                <span aria-hidden="true">{visibleAnnouncement.message}</span>
              </div>
            </div>
          ) : (
            <p className="announcement-bar__message">{visibleAnnouncement.message}</p>
          )}
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
      </div>
    </section>
  )
}

export default AnnouncementBar
