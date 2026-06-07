import { Outlet } from 'react-router-dom'
import UserFooter from '../components/layout/user/UserFooter'
import UserNavbar from '../components/layout/user/UserNavbar'

function UserLayout() {
  return (
    <div className="user-shell">
      <UserNavbar />
      <main className="user-main">
        <Outlet />
      </main>
      <UserFooter />
    </div>
  )
}

export default UserLayout
