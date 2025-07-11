import { useState } from 'react';
import MessageStatusIndicator from './MessageStatusIndicator';

export default function MessageBubble({
  text,
  isOwn,
  timestamp,
  sent = true,
  onRequestDelete,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const isSent = !!timestamp;

  const handleToggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  return (
    <div
      className={`relative w-full flex ${isOwn ? 'justify-end' : 'justify-start'} px-4`}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
      onClick={handleToggleMenu} // mobil uchun
    >
      <div
        className={`relative rounded-xl py-2 px-3 text-sm break-words max-w-[80%] whitespace-pre-wrap ${
          isOwn ? 'bg-[#005c4b] text-white' : 'bg-[#202c33] text-white'
        }`}
      >
        <p>{text}</p>

        {/* Vaqt va yuborilgan status */}
        <div className="flex items-center justify-end gap-1 text-xs text-gray-300 mt-1 select-none">
          <span>{timestamp || ''}</span>
          {isOwn && <MessageStatusIndicator sent={isSent} />}
        </div>

        {/* O'chirish tugmasi faqat o'z xabari uchun */}
        {isOwn && showMenu && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // boshqa eventlarni to'xtatish
              onRequestDelete();
              setShowMenu(false);
            }}
            className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow hover:bg-red-700 transition"
          >
            O'chirish
          </button>
        )}
      </div>
    </div>
  );
}
