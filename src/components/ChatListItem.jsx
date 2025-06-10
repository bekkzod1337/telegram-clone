import UserAvatar from './UserAvatar';

export default function ChatListItem({ name, lastMessage, onClick }) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className="flex items-center gap-3 px-4 py-3 border-b border-gray-700 bg-gray-900 hover:bg-gray-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
    >
      <UserAvatar name={name} />
      <div className="overflow-hidden">
        <div className="font-medium text-gray-100">{name}</div>
        <div className="text-sm text-gray-400 truncate max-w-xs" title={lastMessage}>
          {lastMessage}
        </div>
      </div>
    </div>
  );
}
