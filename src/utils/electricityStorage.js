const RECALCULATE_DEVICES_KEY = 'eXanhRecalculateDevices'
const SCROLL_TO_RESULT_KEY = 'eXanhScrollToResult'

export function getHistoryKey(userId = 'guest') {
  return `exanh_electricity_history_${userId}`
}

export function getElectricityHistories(userId = 'guest') {
  try {
    const raw = localStorage.getItem(getHistoryKey(userId))

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveElectricityHistory(history, userId = 'guest') {
  try {
    const currentHistories = getElectricityHistories(userId)
    const nextHistories = [history, ...currentHistories]
    localStorage.setItem(getHistoryKey(userId), JSON.stringify(nextHistories))
    return nextHistories
  } catch {
    return getElectricityHistories(userId)
  }
}

export function deleteElectricityHistory(id, userId = 'guest') {
  try {
    const nextHistories = getElectricityHistories(userId).filter((item) => item.id !== id)
    localStorage.setItem(getHistoryKey(userId), JSON.stringify(nextHistories))
    return nextHistories
  } catch {
    return getElectricityHistories(userId)
  }
}

export function clearElectricityHistories(userId = 'guest') {
  try {
    localStorage.removeItem(getHistoryKey(userId))
    return []
  } catch {
    return getElectricityHistories(userId)
  }
}

export function setRecalculateDevices(items) {
  try {
    localStorage.setItem(RECALCULATE_DEVICES_KEY, JSON.stringify(items))
    return true
  } catch {
    return false
  }
}

export function getRecalculateDevices() {
  try {
    const raw = localStorage.getItem(RECALCULATE_DEVICES_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function clearRecalculateDevices() {
  try {
    localStorage.removeItem(RECALCULATE_DEVICES_KEY)
    return true
  } catch {
    return false
  }
}

export function setScrollToResultFlag() {
  try {
    localStorage.setItem(SCROLL_TO_RESULT_KEY, 'true')
    return true
  } catch {
    return false
  }
}

export function getScrollToResultFlag() {
  try {
    return localStorage.getItem(SCROLL_TO_RESULT_KEY) === 'true'
  } catch {
    return false
  }
}

export function clearScrollToResultFlag() {
  try {
    localStorage.removeItem(SCROLL_TO_RESULT_KEY)
    return true
  } catch {
    return false
  }
}
