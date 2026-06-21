/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChange, getCurrentSession, getCurrentUserProfile } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function initAuth() {
      const session = await getCurrentSession()
      if (isMounted) {
        if (session?.user) {
          setUser(session.user)
          const p = await getCurrentUserProfile(session.user.id)
          setProfile(p)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    }

    initAuth()

    const subscription = onAuthStateChange(async (event, session) => {
      if (!isMounted) return
      if (session?.user) {
        setUser(session.user)
        const p = await getCurrentUserProfile(session.user.id)
        if (isMounted) setProfile(p)
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      isMounted = false
      if (subscription?.unsubscribe) subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
