import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import NotificationToast from './NotificationToast';

export default function ChatWindow({ user, messages, onSend, currentUserUid, onOpenChatById }) {
  const [text, setText] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastSenderId, setToastSenderId] = useState(null);
  const bottomRef = useRef(null);

  const incomingSound = useRef(null);
  const outgoingSound = useRef(null);

  useEffect(() => {
    incomingSound.current = new Audio('/sounds/incoming.mp3');
    outgoingSound.current = new Audio('/sounds/outgoing.mp3');
  }, []);

  const handleSendText = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
      outgoingSound.current?.play();
    }
  };

  const showNotification = (msg, senderId) => {
    setToastMsg(msg);
    setToastSenderId(senderId);
    setToastOpen(true);
  };

  useEffect(() => {
    if (!user || !messages.length) return;

    const latest = messages[messages.length - 1];
    const isNewMessage = latest.senderId !== currentUserUid;

    if (isNewMessage) {
      showNotification(`Yangi xabar: ${latest.text}`, latest.senderId);
      incomingSound.current?.play();
    }
  }, [messages, user, currentUserUid]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-lg bg-gray-900">
        Foydalanuvchi tanlanmagan
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Toast notification */}
      <NotificationToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMsg}
        onClick={() => {
          if (toastSenderId && typeof onOpenChatById === 'function') {
            onOpenChatById(toastSenderId);
          }
        }}
      />

      {/* Chat header */}
      <ChatHeader
        name={user.displayName || user.email}
        photoURL={user.photoURL}
        userId={user.uid}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            isOwn={msg.senderId === currentUserUid}
            timestamp={
              msg.createdAt?.toDate?.()?.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }) || ''
            }
            sent={!!msg.sent}
            onRequestDelete={() => console.log('O‘chirish:', msg.id)}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Message input */}
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
