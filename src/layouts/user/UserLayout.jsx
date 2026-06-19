import { Outlet } from 'react-router-dom'
import AnnouncementBar from '../../components/common/AnnouncementBar'
import SupportCenter from '../../components/common/SupportCenter'
import UserFooter from './UserFooter'
import UserNavbar from './UserNavbar'
import { PostComposerProvider } from '../../components/community/PostComposerContext'

function UserLayout() {
  return (
    <PostComposerProvider>
      <div className="user-shell">
        <AnnouncementBar />
        <UserNavbar />
        <main className="user-main">
          <Outlet />
        </main>
        <UserFooter />
        <SupportCenter />
      </div>
    </PostComposerProvider>
  )
}

export default UserLayout
