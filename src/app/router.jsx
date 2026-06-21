import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import ScrollToTop from '../components/common/ScrollToTop'
import RouteErrorBoundary from '../components/common/RouteErrorBoundary'
import AdminRoute from '../app/guards/AdminRoute'
import UserRoute from '../app/guards/UserRoute'
import AdminLayout from '../layouts/admin/AdminLayout'
import UserLayout from '../layouts/user/UserLayout'

// ─── Eager pages (critical path — kept small) ────────────────────────────────
const HomePage = lazy(() => import('../pages/user/HomePage'))
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const NotFoundPage = lazy(() => import('../pages/shared/NotFoundPage'))

// ─── Lazy pages — User ────────────────────────────────────────────────────────
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'))
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
const SettingsUserPage = lazy(() => import('../pages/user/SettingsUserPage'))
const PublicProfilePage = lazy(() => import('../pages/user/PublicProfilePage'))
const AuthCallbackPage = lazy(() => import('../pages/auth/AuthCallbackPage'))

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
const SystemNotificationPage = lazy(() => import('../pages/admin/SystemNotificationPage'))

// ─── Suspense fallback ─────────────────────────────────────────────────────────
function PageFallback() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 0',
        minHeight: '40vh',
      }}
      aria-live="polite"
      aria-label="Đang tải trang..."
    >
      <div className="page-loader__spinner" style={{ margin: '0 auto' }}></div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    element: (
      <>
        <ScrollToTop />
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
            path: 'quen-mat-khau',
            element: <Suspense fallback={<PageFallback />}><ForgotPasswordPage /></Suspense>,
          },
          {
            path: 'dat-lai-mat-khau',
            element: <Suspense fallback={<PageFallback />}><ResetPasswordPage /></Suspense>,
          },
          {
            path: 'auth/callback',
            element: <Suspense fallback={<PageFallback />}><AuthCallbackPage /></Suspense>,
          },
          {
            path: 'tai-khoan',
            element: <Suspense fallback={<PageFallback />}><AccountPage /></Suspense>,
          },
          {
            path: 'nguoi-dung/:userId',
            element: <Suspense fallback={<PageFallback />}><PublicProfilePage /></Suspense>,
          },
          {
            path: 'tai-khoan/cai-dat',
            element: <UserRoute />,
            children: [
              {
                index: true,
                element: <Suspense fallback={<PageFallback />}><SettingsUserPage /></Suspense>,
              }
            ]
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
            element: <UserRoute />,
            children: [
              {
                index: true,
                element: <Suspense fallback={<PageFallback />}><ElectricityHistoryPage /></Suspense>,
              }
            ]
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
                path: 'thong-bao-he-thong',
                element: <Suspense fallback={<PageFallback />}><SystemNotificationPage /></Suspense>,
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
