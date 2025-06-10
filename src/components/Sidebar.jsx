import React, { useState } from 'react'
import SearchBar from './SearchBar'

export default function Sidebar({ users, activeUser, onSelect, onDeleteChat, currentUserUid }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-64 border-r overflow-auto">
      <h2 className="p-4 font-bold text-lg border-b">Foydalanuvchilar</h2>

      {/* 🔍 Qidiruv */}
      <div className="px-3 pt-2">
        <SearchBar onSearch={setSearchTerm} />
      </div>

      {filteredUsers.length === 0 && <div className="p-4">Topilmadi</div>}
      <ul>
        {filteredUsers.map((u) => (
          <li
            key={u.uid}
            className={`flex justify-between items-center p-3 cursor-pointer hover:bg-gray-100 ${
              activeUser?.uid === u.uid ? 'bg-gray-200' : ''
            }`}
            onClick={() => onSelect(u)}
          >
            <span className="truncate">{u.email}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteChat(u.uid)
              }}
              className="text-red-600 hover:text-red-800"
            >
              &#x2715;
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
