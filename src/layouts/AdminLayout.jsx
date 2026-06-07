import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/layout/admin/AdminSidebar'
import AdminTopbar from '../components/layout/admin/AdminTopbar'
import '../styles/admin.css'

function AdminLayout() {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-shell__content">
        <AdminTopbar />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
