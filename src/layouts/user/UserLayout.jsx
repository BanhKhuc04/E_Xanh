import { Outlet } from 'react-router-dom'
import AnnouncementBar from '../../components/common/AnnouncementBar'
import UserFooter from './UserFooter'
import UserNavbar from './UserNavbar'
import { PostComposerProvider } from '../../components/community/PostComposerContext'
import FloatingBugReport from '../../components/common/FloatingBugReport'

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
        <FloatingBugReport />
      </div>
    </PostComposerProvider>
  )
}

export default UserLayout
