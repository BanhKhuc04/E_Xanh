import UserAvatar from '../common/UserAvatar'

function ActiveMemberAvatar({ src, name }) {
  return <UserAvatar src={src} name={name} size="md" withFrame={false} className="active-member__avatar" />
}

export default ActiveMemberAvatar
