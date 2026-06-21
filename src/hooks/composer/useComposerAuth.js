import { useState, useEffect } from 'react'
import { getCurrentSession, getCurrentUserProfile } from '../../services/authService'
import { getCooldownStorageKey } from './utils'

export function useComposerAuth() {
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [cooldownUntil, setCooldownUntil] = useState(0)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  useEffect(() => {
    let isMounted = true

    async function loadAuth() {
      const session = await getCurrentSession()
      if (!isMounted) return

      if (session?.user) {
        const nextProfile = await getCurrentUserProfile(session.user.id)
        if (!isMounted) return
        setUser(session.user)
        setProfile(nextProfile)
        const savedCooldown = Number(localStorage.getItem(getCooldownStorageKey(session.user.id)) || 0)
        setCooldownUntil(savedCooldown > Date.now() ? savedCooldown : 0)
        setCooldownRemaining(savedCooldown > Date.now() ? Math.ceil((savedCooldown - Date.now()) / 1000) : 0)
      } else {
        setUser(null)
        setProfile(null)
        setCooldownUntil(0)
        setCooldownRemaining(0)
      }

      setAuthLoading(false)
    }

    loadAuth()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!cooldownUntil || cooldownUntil <= Date.now()) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000))
      setCooldownRemaining(remaining)

      if (remaining <= 0) {
        window.clearInterval(intervalId)
      }
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [cooldownUntil])

  return {
    authLoading,
    user,
    profile,
    cooldownRemaining,
    setCooldownUntil,
    setCooldownRemaining,
  }
}
