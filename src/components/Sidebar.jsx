import React, { useState } from 'react';
import { Menu, Settings as SettingsIcon } from 'lucide-react';
import SearchBar from './SearchBar';
import ChatListItem from './ChatListItem';
import ChatListSkeleton from './ChatListSkeleton';

export default function Sidebar({
  users,
  activeUser,
  onSelect,
  onDeleteChat,
  currentUserUid,
  userStatusMap,
  onOpenGroupModal,
  onOpenChannelModal,
  onLogout,
  onOpenSettings,
  isLoading,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

      {/* Sidebar */}
      <div
        className={`fixed md:static z-40 top-0 left-0 h-full md:h-auto w-64 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 ${theme.bg} ${theme.border} border-r max-h-screen overflow-auto flex flex-col select-none`}
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

        {isLoading ? (
          <ChatListSkeleton />
        ) : filteredUsers.length === 0 ? (
          <div
            className={`p-4 ${theme.textSecondary} text-center italic select-none`}
          >
            Topilmadi
          </div>
        ) : (
          <ul className="flex-grow overflow-auto">
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
                      setIsOpen(false); // mobil menyuni yopish
                    }}
                    onConfirmDelete={() => onDeleteChat(u.uid)}
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

        {/* Sozlamalar tugmasi */}
        <div className="p-4 border-t border-gray-700 relative">
          <button
            onClick={() => setIsSettingsOpen((prev) => !prev)}
            className="flex items-center gap-2 text-gray-300 hover:text-white focus:outline-none"
          >
            <SettingsIcon size={20} />
            <span>Sozlamalar</span>
          </button>

          {isSettingsOpen && (
            <div className="absolute bottom-14 left-4 bg-gray-800 border border-gray-700 rounded-md shadow-lg w-48 z-50">
              <ul className="flex flex-col text-sm text-gray-200">
                <li
                  className="px-4 py-2 hover:bg-blue-900 cursor-pointer"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onOpenSettings?.();
                  }}
                >
                  ⚙️ Sozlamalar
                </li>
                <li
                  className="px-4 py-2 hover:bg-blue-900 cursor-pointer"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onOpenGroupModal?.();
                  }}
                >
                  👥 Guruh yaratish
                </li>
                <li
                  className="px-4 py-2 hover:bg-blue-900 cursor-pointer"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onOpenChannelModal?.();
                  }}
                >
                  📢 Kanal yaratish
                </li>
                <li
                  className="px-4 py-2 hover:bg-blue-900 cursor-pointer text-red-400"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onLogout?.();
                  }}
                >
                  🚪 Chiqish
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Overlay mobil menyuni yopish uchun */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
