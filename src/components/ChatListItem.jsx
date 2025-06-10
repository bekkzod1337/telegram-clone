import UserAvatar from './UserAvatar';

export default function ChatListItem({ name, lastMessage }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer">
      <UserAvatar name={name} />
      <div className="overflow-hidden">
        <div className="font-medium text-gray-900">{name}</div>
        <div className="text-sm text-gray-500 truncate w-48">{lastMessage}</div>
      </div>
    </div>
  );
}
