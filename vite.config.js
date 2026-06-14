import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://e-xanh.vercel.app',
      dynamicRoutes: [
        '/',
        '/meo-tiet-kiem',
        '/cong-dong',
        '/kiem-tra-tien-dien',
        '/ve-chung-toi',
        '/dieu-khoan',
        '/lien-he',
        '/dang-bai',
      ],
      exclude: [
        '/admin', 
        '/admin/**',
        '/dang-nhap',
        '/dang-ky',
        '/tai-khoan',
        '/bai-da-luu',
        '/lich-su-kiem-tra'
      ],
    }),
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor: react core
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor'
          }
          // Router
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) {
            return 'router'
          }
          // Supabase
          if (id.includes('node_modules/@supabase/')) {
            return 'supabase'
          }
          // Redux
          if (id.includes('node_modules/@reduxjs/') || id.includes('node_modules/react-redux/') || id.includes('node_modules/redux/')) {
            return 'redux'
          }
          // UI libraries
          if (
            id.includes('node_modules/lucide-react/') ||
            id.includes('node_modules/react-bootstrap/') ||
            id.includes('node_modules/bootstrap/')
          ) {
            return 'ui'
          }
        },
      },
    },
  },
})
