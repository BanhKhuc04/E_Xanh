/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getCurrentSession } from '../../services/authService'
import PostComposerModal from './PostComposerModal'

const PostComposerContext = createContext(null)

export function PostComposerProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [composerState, setComposerState] = useState({
    isOpen: false,
    defaultType: 'community',
  })

  async function openComposer(options = {}) {
    const session = await getCurrentSession()
    if (!session?.user) {
      navigate('/dang-nhap', {
        state: {
          from: location.pathname,
          message: 'Vui lòng đăng nhập để đăng bài.',
        },
      })
      return
    }

    setComposerState({
      isOpen: true,
      defaultType: options.defaultType || 'community',
    })
  }

  function closeComposer() {
    setComposerState((current) => ({
      ...current,
      isOpen: false,
    }))
  }

  const value = {
    isComposerOpen: composerState.isOpen,
    openComposer,
    closeComposer,
  }

  return (
    <PostComposerContext.Provider value={value}>
      {children}
      {composerState.isOpen ? (
        <PostComposerModal
          isOpen={composerState.isOpen}
          defaultType={composerState.defaultType}
          onClose={closeComposer}
          onCreated={({ post, message }) => {
            window.dispatchEvent(
              new CustomEvent('postComposerSuccess', {
                detail: { post, message },
              }),
            )
            closeComposer()
          }}
        />
      ) : null}
    </PostComposerContext.Provider>
  )
}

export function usePostComposer() {
  const context = useContext(PostComposerContext)
  if (!context) {
    throw new Error('usePostComposer must be used inside PostComposerProvider')
  }

  return context
}
