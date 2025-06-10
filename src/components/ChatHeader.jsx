import { useState } from 'react';
import UserAvatar from './UserAvatar';
import UserProfileModal from './UserProfileModal';

export default function ChatHeader({ name, isOnline = true }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="bg-gray-800 border-b border-gray-200 flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-700"
        onClick={() => setIsModalOpen(true)}
      >
        <UserAvatar name={name} />
        <div>
          <div className="font-semibold text-gray-100">{name}</div>
          <div className={`text-sm ${isOnline ? 'text-green-400' : 'text-gray-400'}`}>
            {isOnline ? 'online' : 'offline'}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <UserProfileModal
          name={name}
          isOnline={isOnline}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
