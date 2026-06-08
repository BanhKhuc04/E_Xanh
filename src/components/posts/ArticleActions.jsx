import { useState, useEffect } from 'react'

function ArticleActions({ post }) {
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function checkSaved() {
      if (!post?.id || String(post.id).length < 30) return
      const { isPostSaved } = await import('../../services/interactionService')
      const { data } = await isPostSaved(post.id)
      if (data) setIsSaved(true)
    }
    checkSaved()
  }, [post?.id])

  async function handleSaveClick() {
    if (isSaving) return
    if (!post?.id || String(post.id).length < 30) {
      alert('Chức năng lưu bài chỉ hỗ trợ bài viết thật trên hệ thống.')
      return
    }

    setIsSaving(true)
    const { savePost, unsavePost } = await import('../../services/interactionService')
    if (isSaved) {
      const { error } = await unsavePost(post.id)
      if (!error) setIsSaved(false)
      else alert(error.message)
    } else {
      const { error } = await savePost(post.id)
      if (!error) setIsSaved(true)
      else alert(error.message)
    }
    setIsSaving(false)
  }

  return (
    <div className="article-actions">
      <button type="button" className="article-actions__button">Thích</button>
      <button type="button" className="article-actions__button">Bình luận</button>
      <button 
        type="button" 
        className={`article-actions__button${isSaved ? ' is-accent' : ''}`}
        onClick={handleSaveClick}
      >
        {isSaved ? 'Đã lưu' : 'Lưu bài'}
      </button>
      <button type="button" className="article-actions__button">Chia sẻ</button>
    </div>
  )
}

export default ArticleActions
