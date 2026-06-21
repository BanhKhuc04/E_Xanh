export function getAvatarFallback(name, email) {
  if (name) {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  if (email) return email.split('@')[0].slice(0, 2).toUpperCase()
  return 'EX'
}

export function formatRoleLabel(role) {
  if (role === 'admin') return 'Quản trị viên'
  if (role === 'moderator') return 'Điều phối viên'
  return 'Thành viên'
}

export function validateFacebookUrl(value) {
  if (!value.trim()) return ''

  try {
    const parsed = new URL(value.trim())
    const allowedHosts = ['facebook.com', 'www.facebook.com', 'fb.com', 'www.fb.com']
    if (parsed.protocol !== 'https:' || !allowedHosts.includes(parsed.hostname.toLowerCase())) {
      return 'Liên kết Facebook phải bắt đầu bằng https://facebook.com/... hoặc https://fb.com/...'
    }
  } catch {
    return 'Liên kết Facebook không đúng định dạng URL.'
  }

  return ''
}

export function validateWebsiteUrl(value) {
  if (!value.trim()) return ''

  try {
    const parsed = new URL(value.trim())
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return 'Liên kết cá nhân phải bắt đầu bằng http:// hoặc https://'
    }
  } catch {
    return 'Liên kết cá nhân không đúng định dạng URL.'
  }

  return ''
}
