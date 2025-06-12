import { useState } from 'react';

export default function UserProfileModal({ name, isOnline, photoURL, onClose }) {
  const [imageError, setImageError] = useState(false);

  const initials = name
    ? name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-xs text-gray-800 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Yopish"
        >
          ×
        </button>

        {/* Profile content */}
        <div className="flex flex-col items-center gap-3">
          {photoURL && !imageError ? (
            <img
              src={photoURL}
              alt={`${name} profile`}
              onError={() => setImageError(true)}
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold select-none">
              {initials}
            </div>
          )}

          <div className="text-xl font-semibold text-center">{name || 'Foydalanuvchi'}</div>

          <div className={`text-sm font-medium ${isOnline ? 'text-green-500' : 'text-gray-500'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>
    </div>
  );
}
