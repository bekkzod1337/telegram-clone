import React, { useState } from 'react';
import SearchBar from './SearchBar';
import ChatListItem from './ChatListItem';

export default function Sidebar({
  users,
  activeUser,
  onSelect,
  onDeleteChat,
  currentUserUid,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const theme = {
    bg: 'bg-gray-900',
    border: 'border-gray-700',
    headerBg: 'bg-gray-800',
    textPrimary: 'text-gray-100',
    textSecondary: 'text-gray-400',
    hoverBg: 'hover:bg-blue-900',
    activeBg: 'bg-blue-800',
    activeText: 'text-blue-300',
    deleteBtn: 'text-red-500 hover:text-red-400 focus:ring-red-600',
  };

  return (
    <div className={`${theme.bg} ${theme.border} border-r overflow-auto max-h-screen w-64`}>
      <h2
        className={`p-4 font-semibold text-xl ${theme.border} border-b ${theme.headerBg} sticky top-0 z-10 ${theme.textPrimary}`}
      >
        Foydalanuvchilar
      </h2>

      <div className={`px-4 py-3 ${theme.headerBg} sticky top-[48px] z-10 border-b ${theme.border}`}>
        <SearchBar onSearch={setSearchTerm} darkMode={true} />
      </div>

      {filteredUsers.length === 0 ? (
        <div className={`p-4 ${theme.textSecondary} text-center italic select-none`}>
          Topilmadi
        </div>
      ) : (
        <ul>
          {filteredUsers.map((u) => (
            <li
              key={u.uid}
              className={`relative group transition-colors ${
                activeUser?.uid === u.uid ? `${theme.activeBg}` : ''
              }`}
            >
              <ChatListItem
                name={u.email}
                lastMessage={u.lastMessage?.text || 'Yangi suhbat'}
                onClick={() => onSelect(u)}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(u.uid);
                }}
                className={`absolute top-1/2 -translate-y-1/2 right-4 z-10 text-sm rounded focus:outline-none focus:ring-2 ${theme.deleteBtn}`}
                title={`O'chirish: ${u.email}`}
              >
                &#x2715;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
