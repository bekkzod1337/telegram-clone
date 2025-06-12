import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import UserAvatar from './UserAvatar';
import UserProfileModal from './UserProfileModal';

export default function ChatHeader({ name, userId, photoURL }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
  if (!userId) return;

  const db = getDatabase();
  const statusRef = ref(db, `/usersStatus/${userId}`);

  const unsubscribe = onValue(statusRef, (snapshot) => {
    const data = snapshot.val();
    setIsOnline(data?.isOnline ?? false);
  });

  return () => unsubscribe();
}, [userId]);




  return (
    <>
      <div
        className="bg-gray-800 border-b border-gray-200 flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-700"
        onClick={() => setIsModalOpen(true)}
      >
        <UserAvatar name={name} photoURL={photoURL} />
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
          photoURL={photoURL}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
