import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AnnouncementBar from '../../components/common/AnnouncementBar'
import SupportCenter from '../../components/common/SupportCenter'
import UserFooter from './UserFooter'
import UserNavbar from './UserNavbar'
import { PostComposerProvider } from '../../components/community/PostComposerContext'

function UserLayout() {
  const location = useLocation()
  return (
    <PostComposerProvider>
      <div className="user-shell">
        <AnnouncementBar />
        <UserNavbar />
        <AnimatePresence mode="wait">
          <motion.main 
            key={location.pathname}
            className="user-main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <UserFooter />
        <SupportCenter />
      </div>
    </PostComposerProvider>
  )
}

export default UserLayout
