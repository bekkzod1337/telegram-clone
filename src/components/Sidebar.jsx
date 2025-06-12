import React, { useState } from 'react';
import { Menu } from 'lucide-react'; // Menyu icon
import SearchBar from './SearchBar';
import ChatListItem from './ChatListItem';

export default function Sidebar({
  users,
  activeUser,
  onSelect,
  onDeleteChat,
  currentUserUid,
  userStatusMap,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Mobil menyu holati

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
    <>
      {/* Mobil menyu tugmasi */}
      <div className="md:hidden p-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-gray-100 text-lg font-semibold">Chat</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-200 focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar: kompyuterda doim ko‘rinadi, mobilda faqat ochilganda */}
      <div
        className={`fixed md:static z-40 top-0 left-0 h-full md:h-auto w-64 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 ${theme.bg} ${theme.border} border-r max-h-screen overflow-auto`}
      >
        <h2
          className={`p-4 font-semibold text-xl ${theme.border} border-b ${theme.headerBg} sticky top-0 z-10 ${theme.textPrimary}`}
        >
          Foydalanuvchilar
        </h2>

        <div
          className={`px-4 py-3 ${theme.headerBg} sticky top-[56px] z-10 border-b ${theme.border}`}
        >
          <SearchBar onSearch={setSearchTerm} darkMode={true} />
        </div>

        {filteredUsers.length === 0 ? (
          <div className={`p-4 ${theme.textSecondary} text-center italic select-none`}>
            Topilmadi
          </div>
        ) : (
          <ul>
            {filteredUsers.map((u) => {
              const isOnline = userStatusMap?.[u.uid]?.isOnline;
              return (
                <li
                  key={u.uid}
                  className={`relative group transition-colors ${
                    activeUser?.uid === u.uid ? `${theme.activeBg}` : ''
                  }`}
                >
                  <ChatListItem
                    name={u.email}
                    photoURL={u.photoURL}
                    lastMessage={u.lastMessage?.text || 'Yangi suhbat'}
                    onClick={() => {
                      onSelect(u);
                      setIsOpen(false); // Mobilda foydalanuvchini tanlagach menyuni yopish
                    }}
                    isOnline={isOnline}
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
              );
            })}
          </ul>
        )}
      </div>

      {/* Mobil menyuni yopinganda fonni bosganda ham yopilsin */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
