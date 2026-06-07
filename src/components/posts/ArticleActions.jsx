function ArticleActions() {
  const actions = ['Thích', 'Bình luận', 'Lưu bài', 'Chia sẻ']

  return (
    <div className="article-actions">
      {actions.map((action, index) => (
        <button
          key={action}
          type="button"
          className={`article-actions__button${index === 2 ? ' is-accent' : ''}`}
        >
          {action}
        </button>
      ))}
    </div>
  )
}

export default ArticleActions
