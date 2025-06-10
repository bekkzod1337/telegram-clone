import { useState, useEffect } from 'react';

export default function EditMessageModal({ initialText, onSave, onClose }) {
  const [text, setText] = useState(initialText || '');

  useEffect(() => {
    setText(initialText || '');
  }, [initialText]);

  // Modal foniga bosilganda yopilishi uchun handler qo'shish mumkin
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={handleBackgroundClick}
    >
      <div className="bg-[#202c33] text-white p-6 rounded-lg w-[90%] max-w-md space-y-4 animate-fade-in">
        <h2 className="text-lg font-semibold">Xabarni tahrirlash</h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full bg-[#2a3942] text-white p-3 rounded resize-none focus:outline-none"
          placeholder="Yangi xabarni kiriting..."
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gray-500 rounded hover:bg-gray-600"
          >
            Bekor qilish
          </button>
          <button
            onClick={() => {
              if (text.trim()) onSave(text);
              onClose();
            }}
            className="px-4 py-1 bg-green-600 rounded hover:bg-green-700"
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}
