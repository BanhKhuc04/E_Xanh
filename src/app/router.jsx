import { createBrowserRouter, Navigate } from 'react-router-dom'
import AdminRoute from '../components/auth/AdminRoute'
import AdminLayout from '../layouts/AdminLayout'
import UserLayout from '../layouts/UserLayout'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminAccessDeniedPage from '../pages/admin/AdminAccessDeniedPage'
import PostManagementPage from '../pages/admin/PostManagementPage'
import CommentManagementPage from '../pages/admin/CommentManagementPage'
import UserManagementPage from '../pages/admin/UserManagementPage'
import DeviceManagementPage from '../pages/admin/DeviceManagementPage'
import StatisticsPage from '../pages/admin/StatisticsPage'
import SettingsPage from '../pages/admin/SettingsPage'
import AccountPage from '../pages/user/AccountPage'
import AboutPage from '../pages/user/AboutPage'
import CommunityPage from '../pages/user/CommunityPage'
import ContactPage from '../pages/user/ContactPage'
import CreatePostPage from '../pages/user/CreatePostPage'
import ElectricityCheckPage from '../pages/user/ElectricityCheckPage'
import ElectricityHistoryPage from '../pages/user/ElectricityHistoryPage'
import HomePage from '../pages/user/HomePage'
import LoginPage from '../pages/user/LoginPage'
import NotFoundPage from '../pages/shared/NotFoundPage'
import PostDetailPage from '../pages/user/PostDetailPage'
import RegisterPage from '../pages/user/RegisterPage'
import SavedPostsPage from '../pages/user/SavedPostsPage'
import TermsPage from '../pages/user/TermsPage'
import TipsPage from '../pages/user/TipsPage'

const router = createBrowserRouter([
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
        element: <TipsPage />,
      },
      {
        path: 'meo-tiet-kiem/:slug',
        element: <PostDetailPage />,
      },
      {
        path: 'cong-dong',
        element: <CommunityPage />,
      },
      {
        path: 'dang-bai',
        element: <CreatePostPage />,
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
        element: <AccountPage />,
      },
      {
        path: 've-chung-toi',
        element: <AboutPage />,
      },
      {
        path: 'dieu-khoan',
        element: <TermsPage />,
      },
      {
        path: 'lien-he',
        element: <ContactPage />,
      },
      {
        path: 'kiem-tra-tien-dien',
        element: <ElectricityCheckPage />,
      },
      {
        path: 'lich-su-kiem-tra',
        element: <ElectricityHistoryPage />,
      },
      {
        path: 'bai-da-luu',
        element: <SavedPostsPage />,
      },
    ],
  },
  {
    path: '/admin/khong-co-quyen',
    element: <AdminAccessDeniedPage />,
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
            element: <AdminDashboardPage />,
          },
          {
            path: 'quan-ly-bai-viet',
            element: <PostManagementPage />,
          },
          {
            path: 'duyet-bai-viet',
            element: <Navigate to="/admin/quan-ly-bai-viet" replace />,
          },
          {
            path: 'quan-ly-binh-luan',
            element: <CommentManagementPage />,
          },
          {
            path: 'quan-ly-nguoi-dung',
            element: <UserManagementPage />,
          },
          {
            path: 'quan-ly-thiet-bi',
            element: <DeviceManagementPage />,
          },
          {
            path: 'thong-ke',
            element: <StatisticsPage />,
          },
          {
            path: 'cai-dat',
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
