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
import { isChunkLoadError, handleChunkErrorReload } from './utils/chunkError'

// Bắt lỗi chunk load ngoài router context (VD: lỗi dynamic import chưa kịp vào ErrorBoundary)
window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason
  if (isChunkLoadError(error)) {
    console.warn('[E-XANH][Global] Caught unhandled chunk load error:', error?.message)
    handleChunkErrorReload()
  }
})

import { AuthProvider } from './contexts/AuthContext'
import VersionNotice from './components/common/VersionNotice'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <VersionNotice />
        <Analytics />
        <SpeedInsights />
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>
)
