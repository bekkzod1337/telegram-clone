import { useState } from 'react'
import {
  TextField,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import UploadFileIcon from '@mui/icons-material/UploadFile'

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('')
  const [mediaFile, setMediaFile] = useState(null)

  const [messages, setMessages] = useState([])

  const onSend = async (text, file) => {
    try {
      if (file) {
        const fileRef = ref(storage, `media/${Date.now()}_${file.name}`)
        await uploadBytes(fileRef, file)
        const url = await getDownloadURL(fileRef)

        await addDoc(collection(db, 'messages'), {
          senderId: currentUser.uid,
          mediaUrl: url,
          mediaType: file.type,
          createdAt: serverTimestamp(),
        })
      } else if (text) {
        await addDoc(collection(db, 'messages'), {
          senderId: currentUser.uid,
          text,
          createdAt: serverTimestamp(),
        })
      }
    } catch (error) {
      console.error('Xatolik:', error)
    }
  }


  const handleSend = () => {
    if (!text.trim() && !mediaFile) return
    onSend(text.trim(), mediaFile)
    setText('')
    setMediaFile(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setMediaFile(file)
    } else {
      alert('Faqat rasm yoki video yuklashingiz mumkin.')
    }
  }

  return (
    <div className="p-4 border-t border-gray-300 flex items-center gap-2 bg-white">
      <TextField
        variant="outlined"
        placeholder="Xabar yozing..."
        aria-label="Xabar yozish maydoni"
        multiline
        maxRows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        fullWidth
        size="small"
        sx={{
          '& .MuiInputBase-root': {
            maxHeight: 120,
            overflowY: 'auto',
          },
        }}
      />

      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="media-upload"
      />
      <label htmlFor="media-upload">
        <Tooltip title="Rasm yoki video yuklash" arrow>
          <IconButton component="span" color={mediaFile ? 'success' : 'default'}>
            <UploadFileIcon />
          </IconButton>
        </Tooltip>
      </label>

      <Tooltip title={(text.trim() || mediaFile) ? "Yuborish" : "Xabar yoki media kiriting"} arrow>
        <span>
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!text.trim() && !mediaFile}
            aria-label="Xabar yuborish"
          >
            <SendIcon />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  )
}
