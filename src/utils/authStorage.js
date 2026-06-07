const CURRENT_USER_KEY = 'eXanhCurrentUser'
const AUTH_CHANGE_EVENT = 'eXanhAuthChange'

function emitAuthChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)

    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export function loginUser(user) {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    emitAuthChange()
    return user
  } catch {
    return null
  }
}

export function registerUser(user) {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    emitAuthChange()
    return user
  } catch {
    return null
  }
}

export function logoutUser() {
  try {
    localStorage.removeItem(CURRENT_USER_KEY)
    emitAuthChange()
    return true
  } catch {
    return false
  }
}

export function getAuthChangeEventName() {
  return AUTH_CHANGE_EVENT
}
