import { useRouteError } from 'react-router-dom'
import { logWarn, logError } from '../../utils/logger'

const CHUNK_RELOAD_KEY = 'exanh_chunk_reload_once'

export default function RouteErrorBoundary() {
  const error = useRouteError()

  const isChunkError = (err) => {
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

  if (isChunkError(error)) {
    logWarn('[E-XANH][Router] Caught chunk load error:', error.message)
    const hasReloaded = sessionStorage.getItem(CHUNK_RELOAD_KEY)
    
    if (!hasReloaded) {
      logWarn('[E-XANH][Router] Auto-reloading once to fetch new chunks...')
      sessionStorage.setItem(CHUNK_RELOAD_KEY, 'true')
      window.location.reload()
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', color: '#666' }}>
          Đang cập nhật phiên bản mới...
        </div>
      )
    }

    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ color: '#2e7d32', marginBottom: '16px' }}>Website vừa được cập nhật 🚀</h2>
        <p style={{ color: '#555', marginBottom: '24px', lineHeight: 1.6 }}>
          Phiên bản mới nhất của E-XANH đã được phát hành.<br />
          Vui lòng tải lại trang để sử dụng các tính năng mới nhất.
        </p>
        <button
          onClick={() => {
            sessionStorage.removeItem(CHUNK_RELOAD_KEY)
            window.location.reload()
          }}
          style={{
            padding: '10px 24px',
            background: '#2e7d32',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Tải lại trang
        </button>
      </div>
    )
  }

  logError('[E-XANH][Router] Unhandled route error:', error)

  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ color: '#d32f2f', marginBottom: '16px' }}>Đã có lỗi xảy ra</h2>
      <p style={{ color: '#555', marginBottom: '24px' }}>
        Rất tiếc, đã có lỗi hệ thống ngoài ý muốn xảy ra.<br />
        Vui lòng thử tải lại trang hoặc liên hệ quản trị viên.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '10px 24px',
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '15px',
          cursor: 'pointer'
        }}
      >
        Tải lại trang
      </button>
    </div>
  )
}
