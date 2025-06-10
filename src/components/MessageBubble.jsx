import { useState } from 'react'
import { CheckCheck, Clock } from 'lucide-react'
import EditMessageModal from './EditMessageModal'

export default function MessageBubble({
  id,
  text,
  isOwn,
  selected,
  onToggleSelect,
  onEdit,
  onRequestDelete,
  username,
  timestamp = '12:45',
  sent = true,
}) {
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  return (
    <>
      <div
        className={`relative group w-full flex ${isOwn ? 'justify-end' : 'justify-start'} px-4`}
        onContextMenu={(e) => {
          e.preventDefault()
          setShowMenu(true)
        }}
      >
        {selected && (
          <input
            type="checkbox"
            checked={true}
            onChange={onToggleSelect}
            className="absolute -left-4 top-3 scale-125 accent-[#00a884]"
          />
        )}

        <div
          className={`relative rounded-xl py-2 px-3 text-sm break-words max-w-[80%] ${
            isOwn ? 'bg-[#005c4b] text-white' : 'bg-[#202c33] text-white'
          }`}
        >
          <p>{text}</p>

          <div className="flex items-center justify-end gap-1 text-xs text-gray-300 mt-1">
            <span>{timestamp}</span>
            {isOwn &&
              (sent ? (
                <CheckCheck size={14} className="text-blue-400" />
              ) : (
                <Clock size={14} className="text-gray-400 animate-pulse" />
              ))}
          </div>

          {showMenu && (
            <div
              className={`absolute z-50 top-full mt-1 ${
                isOwn ? 'right-0' : 'left-0'
              } w-36 bg-[#2a3942] text-sm rounded-md shadow-xl`}
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={() => {
                  setIsEditing(true)
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 hover:bg-[#3b4a54] text-left"
              >
                ✏️ Tahrirlash
              </button>
              <button
                onClick={() => {
                  onRequestDelete?.()
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 hover:bg-[#3b4a54] text-left"
              >
                🗑️ O‘chirish
              </button>
              <button
                onClick={() => {
                  onToggleSelect?.()
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 hover:bg-[#3b4a54] text-left"
              >
                ✅ Tanlash
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <EditMessageModal
          initialText={text}
          onSave={(newText) => {
            onEdit?.(newText)
            setIsEditing(false)
          }}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  )
}
