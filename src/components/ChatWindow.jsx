import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble'; // import qiling

export default function ChatWindow({ user, messages, onSend }) {
  const [text, setText] = useState('');

  const handleSendText = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleDeleteMessage = (id) => {
    console.log('Xabar o‘chirilmoqda:', id);
    // bu yerda o'chirishni Firebase yoki state orqali amalga oshiring
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <ChatHeader />

      {/* Xabarlar oynasi */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            isOwn={msg.senderId === user.uid}
            timestamp={
              msg.createdAt?.toDate?.()?.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }) || ''
            }
            sent={!!msg.sent} // optional flag
            onRequestDelete={() => handleDeleteMessage(msg.id)}
          />
        ))}
      </div>

      {/* Xabar yozish paneli */}
      <div className="flex items-center gap-3 bg-gray-800 p-4 border-t border-gray-700">
        <input
          type="text"
          placeholder="Xabar kiriting..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendText();
          }}
          className="flex-grow bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendText}
          disabled={!text.trim()}
          className={`px-5 py-2 rounded-md text-white text-sm font-semibold transition-colors ${
            text.trim()
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-900 cursor-not-allowed'
          }`}
        >
          Yuborish
        </button>
      </div>
    </div>
  );
}
