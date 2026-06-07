const ELECTRICITY_HISTORY_KEY = 'eXanhElectricityHistory'
const RECALCULATE_DEVICES_KEY = 'eXanhRecalculateDevices'
const SCROLL_TO_RESULT_KEY = 'eXanhScrollToResult'

export function getElectricityHistories() {
  try {
    const raw = localStorage.getItem(ELECTRICITY_HISTORY_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveElectricityHistory(history) {
  try {
    const currentHistories = getElectricityHistories()
    const nextHistories = [history, ...currentHistories]
    localStorage.setItem(ELECTRICITY_HISTORY_KEY, JSON.stringify(nextHistories))
    return nextHistories
  } catch {
    return getElectricityHistories()
  }
}

export function deleteElectricityHistory(id) {
  try {
    const nextHistories = getElectricityHistories().filter((item) => item.id !== id)
    localStorage.setItem(ELECTRICITY_HISTORY_KEY, JSON.stringify(nextHistories))
    return nextHistories
  } catch {
    return getElectricityHistories()
  }
}

export function clearElectricityHistories() {
  try {
    localStorage.removeItem(ELECTRICITY_HISTORY_KEY)
    return []
  } catch {
    return getElectricityHistories()
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
