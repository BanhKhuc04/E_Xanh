import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import router from './app/router'
import './styles/global.css'
import './styles/layout.css'
import './styles/social-ui.css'

// Xóa cờ reload khi app load thành công
sessionStorage.removeItem('exanh_chunk_reload_once')

// Bắt lỗi chunk load ngoài router context (VD: lỗi dynamic import chưa kịp vào ErrorBoundary)
window.addEventListener('unhandledrejection', (event) => {
  const msg = event.reason?.message || ''
  if (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('ChunkLoadError') ||
    msg.includes('Loading chunk') ||
    event.reason?.name === 'ChunkLoadError'
  ) {
    console.warn('[E-XANH][Global] Caught unhandled chunk load error:', msg)
    if (!sessionStorage.getItem('exanh_chunk_reload_once')) {
      sessionStorage.setItem('exanh_chunk_reload_once', 'true')
      window.location.reload()
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
      <Analytics />
      <SpeedInsights />
    </HelmetProvider>
  </StrictMode>
)
