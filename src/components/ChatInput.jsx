import { useState } from 'react';

export default function ChatInput({ channel }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, message: { text: text.trim(), user: 'Bekzod', time: Date.now() } }),
      });
      setText('');
    } catch (error) {
      console.error('Xabar yuborishda xatolik:', error);
      alert('Xabar yuborishda muammo yuz berdi. Iltimos, qayta urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border rounded p-2 flex-1 resize-none"
        placeholder="Xabar yozing..."
        rows={2}
        disabled={loading}
      />
      <button
        onClick={sendMessage}
        className={`px-4 py-2 rounded text-white ${loading || !text.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        disabled={loading || !text.trim()}
      >
        {loading ? 'Yuborilmoqda...' : 'Yuborish'}
      </button>
    </div>
  );
}
