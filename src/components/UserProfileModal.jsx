export default function UserProfileModal({ name, isOnline, onClose }) {
  const handleBackdropClick = (e) => {
    // faqat tashqi fon bosilganda yopish
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-gray-800 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          aria-label="Yopish"
        >
          ×
        </button>
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold">
            {name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-xl font-semibold">{name}</div>
          <div className={`text-sm ${isOnline ? 'text-green-500' : 'text-gray-500'}`}>
            {isOnline ? 'online' : 'offline'}
          </div>
        </div>
      </div>
    </div>
  );
}
