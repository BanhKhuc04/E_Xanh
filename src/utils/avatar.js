import { supabase } from '../lib/supabase'

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
  return (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  )
}

export function normalizeAvatarUrl(value) {
  if (!value) return null

  if (isValidImageUrl(value)) {
    return value
  }

  const cleanPath = String(value).trim().replace(/^\/+/, '')
  if (!cleanPath) return null

  const bucketCandidates = []

  if (cleanPath.startsWith('profile-avatars/')) {
    bucketCandidates.push({
      bucket: 'profile-avatars',
      path: cleanPath.slice('profile-avatars/'.length),
    })
  } else if (cleanPath.startsWith('avatars/')) {
    bucketCandidates.push(
      { bucket: 'profile-avatars', path: cleanPath },
      { bucket: 'avatars', path: cleanPath.slice('avatars/'.length) },
    )
  } else {
    bucketCandidates.push(
      { bucket: 'profile-avatars', path: cleanPath },
      { bucket: 'avatars', path: cleanPath },
    )
  }

  for (const candidate of bucketCandidates) {
    try {
      const { data } = supabase.storage.from(candidate.bucket).getPublicUrl(candidate.path)
      if (data?.publicUrl) {
        return data.publicUrl
      }
    } catch {
      // Ignore and continue with next bucket candidate.
    }
  }

  return null
}
