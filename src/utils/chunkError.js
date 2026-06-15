export const CHUNK_RELOAD_PREFIX = 'exanh_chunk_reload:'

export function isChunkLoadError(err) {
  if (!err) return false
  const msg = err.message || ''
  return (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('ChunkLoadError') ||
    msg.includes('Loading chunk') ||
    err.name === 'ChunkLoadError'
  )
}

export function handleChunkErrorReload() {
  const currentPath = window.location.pathname
  const reloadKey = `${CHUNK_RELOAD_PREFIX}${currentPath}`
  const hasReloaded = sessionStorage.getItem(reloadKey)

  if (!hasReloaded) {
    sessionStorage.setItem(reloadKey, 'true')
    window.location.reload()
    return true // indicates reload was triggered
  }
  
  return false // indicates already reloaded, should show UI
}

export function clearChunkErrorReload() {
  const currentPath = window.location.pathname
  const reloadKey = `${CHUNK_RELOAD_PREFIX}${currentPath}`
  sessionStorage.removeItem(reloadKey)
}
