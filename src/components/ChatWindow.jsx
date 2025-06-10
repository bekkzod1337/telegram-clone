import React, { useState } from 'react'

export default function ChatWindow({ user, messages, onSend }) {
  const [newMsg, setNewMsg] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newMsg.trim() === '') return
    onSend(newMsg.trim())
    setNewMsg('')
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="p-4 border-b font-semibold">{user.username} bilan chat</div>
      <div className="flex-1 p-4 overflow-auto space-y-2 bg-gray-50">
        {messages.length === 0 && <p className="text-gray-400">Xabarlar mavjud emas</p>}
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white p-2 rounded shadow-sm max-w-xs">
            <p>{msg.text}</p>
            <small className="text-gray-400 text-xs">{msg.createdAt?.toDate?.()?.toLocaleString() || ''}</small>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t flex space-x-2"
      >
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Xabar kiriting..."
          className="flex-1 border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded"
        >
          Yuborish
        </button>
      </form>
    </div>
  )
}
