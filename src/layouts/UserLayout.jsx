import { Outlet } from 'react-router-dom'
import UserFooter from '../components/layout/user/UserFooter'
import UserNavbar from '../components/layout/user/UserNavbar'
import { PostComposerProvider } from '../components/community/PostComposerContext'

function UserLayout() {
  return (
    <PostComposerProvider>
      <div className="user-shell">
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
