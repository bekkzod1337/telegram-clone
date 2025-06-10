import { useState, useEffect } from 'react';

export default function DeleteModal({ username, onClose, onConfirm }) {
  const [scope, setScope] = useState('me');

  // Escape tugmasi bosilganda modalni yopish uchun
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-[#2a3942] text-white w-full max-w-md rounded-xl shadow-2xl p-6 animate-fade-in space-y-4">
        <h2 className="text-xl font-semibold">Xabarni o‘chirish</h2>
        <p className="text-sm text-gray-300">
          Rostdan ham ushbu xabarni o‘chirmoqchimisiz?
        </p>

        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="scope"
              value="me"
              checked={scope === 'me'}
              onChange={() => setScope('me')}
              className="accent-[#00a884] scale-110"
            />
            <span className="text-sm">Faqat siz uchun</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="scope"
              value="both"
              checked={scope === 'both'}
              onChange={() => setScope('both')}
              className="accent-[#00a884] scale-110"
            />
            <span className="text-sm">
              Ham siz, ham <span className="font-semibold">{username}</span> uchun
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-600 hover:bg-gray-500 text-sm"
          >
            Bekor qilish
          </button>
          <button
            onClick={() => {
              onConfirm(scope);
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm"
          >
            O‘chirish
          </button>
        </div>
      </div>
    </div>
  );
}
