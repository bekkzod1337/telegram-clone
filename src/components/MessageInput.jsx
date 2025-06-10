import { useState } from 'react'
import { TextField, IconButton } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text)
    setText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="p-4 border-t border-gray-300 flex items-center gap-2 bg-white">
      <TextField
        variant="outlined"
        placeholder="Xabar yozing..."
        multiline
        maxRows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        fullWidth
        size="small"
      />
      <IconButton color="primary" onClick={handleSend}>
        <SendIcon />
      </IconButton>
    </div>
  )
}
