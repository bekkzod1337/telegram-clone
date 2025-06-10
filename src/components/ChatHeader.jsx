import UserAvatar from './UserAvatar'

export default function ChatHeader({ name }) {
  return (
    <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
      <UserAvatar name={name} />
      <div>
        <div className="font-semibold text-gray-800">{name}</div>
        <div className="text-sm text-gray-500">online</div>
      </div>
    </div>
  )
}
