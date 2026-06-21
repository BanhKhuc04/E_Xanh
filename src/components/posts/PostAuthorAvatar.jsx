import UserAvatar from '../common/UserAvatar'

function PostAuthorAvatar({
  src,
  name,
  size = 'md',
  className = '',
}) {
  const sizeMap = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
  }

  return <UserAvatar src={src} name={name} size={sizeMap[size] || 'md'} withFrame={false} className={className} />
}

export default PostAuthorAvatar
