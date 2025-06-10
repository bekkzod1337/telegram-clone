import React from 'react'

export default function Sidebar({ users, activeUser, onSelect, onDeleteChat, currentUserUid }) {
  return (
    <div className="w-64 border-r overflow-auto">
      <h2 className="p-4 font-bold text-lg border-b">Foydalanuvchilar</h2>
      {users.length === 0 && <div className="p-4">Hech kim yo‘q</div>}
      <ul>
        {users.map((u) => (
          <li
            key={u.uid}
            className={`flex justify-between items-center p-3 cursor-pointer hover:bg-gray-100 ${
              activeUser?.uid === u.uid ? 'bg-gray-200' : ''
            }`}
            onClick={() => onSelect(u)}
          >
            <span>{u.username}</span>
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
