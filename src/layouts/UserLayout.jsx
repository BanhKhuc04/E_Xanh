import { Outlet } from 'react-router-dom'
import AnnouncementBar from '../components/common/AnnouncementBar'
import UserFooter from '../components/layout/user/UserFooter'
import UserNavbar from '../components/layout/user/UserNavbar'
import { PostComposerProvider } from '../components/community/PostComposerContext'

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
      </div>
    </PostComposerProvider>
  )
}

export default UserLayout
