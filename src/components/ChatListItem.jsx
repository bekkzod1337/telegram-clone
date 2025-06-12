import UserAvatar from './UserAvatar';

export default function ChatListItem({ name, photoURL, lastMessage, onClick }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-700"
      onClick={onClick}
    >
      <UserAvatar name={name} photoURL={photoURL} /> {/* <-- MUHIM */}
      <div className="overflow-hidden">
        <div className="text-sm font-medium text-gray-100 truncate">{name}</div>
        <div className="text-xs text-gray-400 truncate">{lastMessage}</div>
      </div>
    </div>
  );
}
