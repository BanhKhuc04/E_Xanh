const isDev = import.meta.env.DEV

export function logError(label, error) {
  if (isDev) {
    console.error(label, error)
  }
}

export function logWarn(label, data) {
  if (isDev) {
    console.warn(label, data)
  }
}

export function getUserSafeError(error, fallback = 'Đã có lỗi xảy ra. Vui lòng thử lại.') {
  if (!error) return fallback

  const message = String(error.message || '')

  if (
    message.toLowerCase().includes('jwt') ||
    message.toLowerCase().includes('rls') ||
    message.toLowerCase().includes('permission') ||
    message.toLowerCase().includes('violates') ||
    message.toLowerCase().includes('policy') ||
    message.toLowerCase().includes('supabase')
  ) {
    return fallback
  }

  return message || fallback
}
