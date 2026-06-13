export function getInitials(nameOrEmail) {
  if (!nameOrEmail) return 'NA'
  
  // Xử lý nếu là email
  if (nameOrEmail.includes('@')) {
    nameOrEmail = nameOrEmail.split('@')[0]
  }

  // Tách từ và lấy tối đa 2 chữ cái đầu
  const words = nameOrEmail.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return 'NA'
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

export function isValidImageUrl(url) {
  if (!url) return false
  return url.startsWith('http://') || url.startsWith('https://')
}
