import React, { useState, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import UserAvatar from './UserAvatar';

export default function ChatListItem({
  name,
  photoURL,
  lastMessage,
  onClick,
  onConfirmDelete,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const threshold = -120;

  const handlers = useSwipeable({
    onSwiping: ({ deltaX, dir }) => {
      if (dir === 'Left' && deltaX < 0) {
        setTranslateX(deltaX);
        setIsSwiping(true);
      }
    },
    onSwipedLeft: ({ deltaX }) => {
      if (deltaX < threshold) {
        setShowConfirm(true);
      }
      setTranslateX(0);
      setIsSwiping(false);
    },
    onSwipedRight: () => {
      setTranslateX(0);
      setIsSwiping(false);
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  const handleDelete = (confirm) => {
    setShowConfirm(false);
    if (confirm) onConfirmDelete?.();
  };

  return (
    <div {...handlers} className="relative">
      <div
        style={{ transform: `translateX(${translateX}px)` }}
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-700 transition-transform duration-200 ease-out select-none`}
        onClick={onClick}
      >
        <UserAvatar name={name} photoURL={photoURL} />
        <div className="overflow-hidden">
          <div className="text-sm font-medium text-gray-100 truncate">{name}</div>
          <div className="text-xs text-gray-400 truncate">{lastMessage}</div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 grid place-items-center">
          <div className="bg-gray-800 p-4 rounded-md shadow-lg w-64 border border-gray-700">
            <p className="text-gray-200 mb-3">Suhbatni o‘chirmoqchimisiz?</p>
            <div className="flex justify-between gap-3">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleDelete(true)}
              >
                Ha
              </button>
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                onClick={() => handleDelete(false)}
              >
                Yo‘q
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
