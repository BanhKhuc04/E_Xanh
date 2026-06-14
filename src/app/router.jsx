import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import ScrollToTop from '../components/common/ScrollToTop'
import DevelopmentNotice from '../components/common/DevelopmentNotice'
import AdminRoute from '../components/auth/AdminRoute'
import UserRoute from '../components/auth/UserRoute'
import AdminLayout from '../layouts/AdminLayout'
import UserLayout from '../layouts/UserLayout'

// ─── Eager pages (critical path — kept small) ────────────────────────────────
import HomePage from '../pages/user/HomePage'
import LoginPage from '../pages/user/LoginPage'
import RegisterPage from '../pages/user/RegisterPage'
import NotFoundPage from '../pages/shared/NotFoundPage'

// ─── Lazy pages — User ────────────────────────────────────────────────────────
const TipsPage = lazy(() => import('../pages/user/TipsPage'))
const PostDetailPage = lazy(() => import('../pages/user/PostDetailPage'))
const CommunityPage = lazy(() => import('../pages/user/CommunityPage'))
const CommunityPostDetailPage = lazy(() => import('../pages/user/CommunityPostDetailPage'))
const CreatePostPage = lazy(() => import('../pages/user/CreatePostPage'))
const AccountPage = lazy(() => import('../pages/user/AccountPage'))
const AboutPage = lazy(() => import('../pages/user/AboutPage'))
const TermsPage = lazy(() => import('../pages/user/TermsPage'))
const ContactPage = lazy(() => import('../pages/user/ContactPage'))
const ElectricityCheckPage = lazy(() => import('../pages/user/ElectricityCheckPage'))
const ElectricityHistoryPage = lazy(() => import('../pages/user/ElectricityHistoryPage'))
const SavedPostsPage = lazy(() => import('../pages/user/SavedPostsPage'))

// ─── Lazy pages — Admin ───────────────────────────────────────────────────────
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'))
const AdminAccessDeniedPage = lazy(() => import('../pages/admin/AdminAccessDeniedPage'))
const PostManagementPage = lazy(() => import('../pages/admin/PostManagementPage'))
const CommentManagementPage = lazy(() => import('../pages/admin/CommentManagementPage'))
const UserManagementPage = lazy(() => import('../pages/admin/UserManagementPage'))
const DeviceManagementPage = lazy(() => import('../pages/admin/DeviceManagementPage'))
const StatisticsPage = lazy(() => import('../pages/admin/StatisticsPage'))
const SettingsPage = lazy(() => import('../pages/admin/SettingsPage'))
const ThemeSettingsPage = lazy(() => import('../pages/admin/ThemeSettingsPage'))

// ─── Suspense fallback ─────────────────────────────────────────────────────────
function PageFallback() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
        minHeight: '40vh',
      }}
      aria-live="polite"
      aria-label="Đang tải trang..."
    >
      <div style={{ height: '40px', width: '60%', background: '#eaf59d', borderRadius: '8px', animation: 'pulse 1.5s infinite ease-in-out' }} />
      <div style={{ height: '20px', width: '100%', background: '#f4f8e7', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
      <div style={{ height: '20px', width: '90%', background: '#f4f8e7', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
      <div style={{ height: '20px', width: '95%', background: '#f4f8e7', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: (
      <>
        <ScrollToTop />
        <DevelopmentNotice />
        <Outlet />
      </>
    ),
    children: [
      {
        path: '/',
        element: <UserLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'meo-tiet-kiem',
            element: <Suspense fallback={<PageFallback />}><TipsPage /></Suspense>,
          },
          {
            path: 'meo-tiet-kiem/:slug',
            element: <Suspense fallback={<PageFallback />}><PostDetailPage /></Suspense>,
          },
          {
            path: 'cong-dong',
            element: <Suspense fallback={<PageFallback />}><CommunityPage /></Suspense>,
          },
          {
            path: 'cong-dong/:id',
            element: <Suspense fallback={<PageFallback />}><CommunityPostDetailPage /></Suspense>,
          },
          {
            path: 'dang-bai',
            element: <Suspense fallback={<PageFallback />}><CreatePostPage /></Suspense>,
          },
          {
            path: 'dang-nhap',
            element: <LoginPage />,
          },
          {
            path: 'dang-ky',
            element: <RegisterPage />,
          },
          {
            path: 'tai-khoan',
            element: <Suspense fallback={<PageFallback />}><AccountPage /></Suspense>,
          },
          {
            path: 've-chung-toi',
            element: <Suspense fallback={<PageFallback />}><AboutPage /></Suspense>,
          },
          {
            path: 'dieu-khoan',
            element: <Suspense fallback={<PageFallback />}><TermsPage /></Suspense>,
          },
          {
            path: 'lien-he',
            element: <Suspense fallback={<PageFallback />}><ContactPage /></Suspense>,
          },
          {
            path: 'kiem-tra-tien-dien',
            element: <Suspense fallback={<PageFallback />}><ElectricityCheckPage /></Suspense>,
          },
          {
            path: 'lich-su-kiem-tra',
            element: <Suspense fallback={<PageFallback />}><ElectricityHistoryPage /></Suspense>,
          },
          {
            path: 'bai-da-luu',
            element: <UserRoute />,
            children: [
              {
                index: true,
                element: <Suspense fallback={<PageFallback />}><SavedPostsPage /></Suspense>,
              }
            ]
          },
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
      {
        path: '/admin/khong-co-quyen',
        element: <Suspense fallback={<PageFallback />}><AdminAccessDeniedPage /></Suspense>,
      },
      {
        path: '/admin',
        element: <AdminRoute />,
        children: [
          {
            path: '',
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <Suspense fallback={<PageFallback />}><AdminDashboardPage /></Suspense>,
              },
              {
                path: 'quan-ly-bai-viet',
                element: <Suspense fallback={<PageFallback />}><PostManagementPage /></Suspense>,
              },
              {
                path: 'duyet-bai-viet',
                element: <Navigate to="/admin/quan-ly-bai-viet" replace />,
              },
              {
                path: 'quan-ly-binh-luan',
                element: <Suspense fallback={<PageFallback />}><CommentManagementPage /></Suspense>,
              },
              {
                path: 'quan-ly-nguoi-dung',
                element: <Suspense fallback={<PageFallback />}><UserManagementPage /></Suspense>,
              },
              {
                path: 'quan-ly-thiet-bi',
                element: <Suspense fallback={<PageFallback />}><DeviceManagementPage /></Suspense>,
              },
              {
                path: 'thong-ke',
                element: <Suspense fallback={<PageFallback />}><StatisticsPage /></Suspense>,
              },
              {
                path: 'cai-dat',
                element: <Suspense fallback={<PageFallback />}><SettingsPage /></Suspense>,
              },
              {
                path: 'cai-dat-giao-dien',
                element: <Suspense fallback={<PageFallback />}><ThemeSettingsPage /></Suspense>,
              },
            ],
          },
        ],
      },
    ],
  },
])

export default router
