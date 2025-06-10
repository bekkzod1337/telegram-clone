import { useState, useEffect } from 'react';

export default function DeleteChatModal({ onConfirm, onClose, username }) {
  const [deleteForOther, setDeleteForOther] = useState(false);

  // Escape tugmasi bosilganda modalni yopish uchun event qo‘shamiz
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#111b21] text-white p-6 rounded-xl shadow-xl w-[320px] animate-scale-in space-y-4">
        <h2 className="text-xl font-semibold text-center">Chatni o‘chirish</h2>
        <p className="text-sm text-gray-300 text-center">
          Rostdan ham bu chatni o‘chirmoqchimisiz?
        </p>

        <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-white">
          <input
            type="checkbox"
            className="accent-[#00a884] w-4 h-4"
            checked={deleteForOther}
            onChange={(e) => setDeleteForOther(e.target.checked)}
          />
          <span>
            <span className="font-medium">{username}</span> uchun ham o‘chirish
          </span>
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full border border-gray-500 hover:bg-[#2a3942] transition"
          >
            Bekor qilish
          </button>
          <button
            onClick={() => onConfirm(deleteForOther)}
            className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 transition font-medium"
          >
            O‘chirish
          </button>
        </div>
      </div>
    </div>
  );
}
