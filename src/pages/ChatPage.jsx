import React, { useEffect, useState } from 'react'
import {
  getDocs, collection, query, orderBy,
  addDoc, serverTimestamp, doc, deleteDoc, onSnapshot
} from 'firebase/firestore'
import {
  ref as rtdbRef, set, onValue
} from 'firebase/database'
import {
  ref as storageRef, uploadBytes, getDownloadURL
} from 'firebase/storage'

import { db, realtimeDb, storage } from '../firebase'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import DeleteChatModal from '../components/DeleteChatModal'
import NotificationToast from '../components/NotificationToast'
import { useAuth } from '../context/AuthContext'

export default function ChatPage() {
  const { user, logout } = useAuth()
  const [users, setUsers] = useState([])
  const [userStatusMap, setUserStatusMap] = useState({})
  const [activeChatUser, setActiveChatUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [pinnedMessages, setPinnedMessages] = useState([])
  const [chatToDelete, setChatToDelete] = useState(null)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' })

  const getChatId = (uid1, uid2) => uid1 > uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`

  useEffect(() => {
    const loadUsers = async () => {
      const q = query(collection(db, 'users'), orderBy('email'))
      const snap = await getDocs(q)
      const filtered = []
      snap.forEach(doc => {
        if (doc.id !== user.uid) filtered.push({ uid: doc.id, ...doc.data() })
      })
      setUsers(filtered)
    }

    const listenToUserStatuses = () => {
      const ref = rtdbRef(realtimeDb, 'usersStatus')
      onValue(ref, snapshot => {
        setUserStatusMap(snapshot.val() || {})
      })
    }

    loadUsers()
    listenToUserStatuses()
  }, [user.uid])

  const handleSendMessage = async (text, audioFile = null) => {
    if ((!text.trim() && !audioFile) || !activeChatUser) return
    const chatId = getChatId(user.uid, activeChatUser.uid)
    let audioUrl = null

    if (audioFile) {
      const audioPath = `voiceMessages/${Date.now()}_${audioFile.name}`
      const snap = await uploadBytes(storageRef(storage, audioPath), audioFile)
      audioUrl = await getDownloadURL(snap.ref)
    }

    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text: text || '',
      audioUrl,
      senderId: user.uid,
      createdAt: serverTimestamp()
    })

    setNotification({ open: true, message: 'Xabar yuborildi', severity: 'success' })
  }

  const handleDeleteChat = async () => {
    const chatId = getChatId(user.uid, chatToDelete)
    const messagesRef = collection(db, 'chats', chatId, 'messages')
    const snap = await getDocs(messagesRef)

    await Promise.all(snap.docs.map(doc => deleteDoc(doc.ref)))

    if (activeChatUser?.uid === chatToDelete) setActiveChatUser(null)
    setChatToDelete(null)
    setNotification({ open: true, message: 'Chat o‘chirildi', severity: 'warning' })
  }

  useEffect(() => {
    if (!activeChatUser) return setMessages([]), setPinnedMessages([])

    const chatId = getChatId(user.uid, activeChatUser.uid)

    const unsubMsgs = onSnapshot(
      query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt')),
      snap => setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    )

    const unsubPins = onSnapshot(
      query(collection(db, 'chats', chatId, 'pinnedMessages'), orderBy('createdAt')),
      snap => setPinnedMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    )

    return () => {
      unsubMsgs()
      unsubPins()
    }
  }, [activeChatUser, user.uid])

  return (
    <div className="flex h-screen">
      <Sidebar
        users={users}
        activeUser={activeChatUser}
        onSelect={setActiveChatUser}
        onDeleteChat={setChatToDelete}
        currentUserUid={user.uid}
        userStatusMap={userStatusMap}
        onLogout={logout}
      />
      <div className="flex flex-col flex-1">
        {activeChatUser ? (
          <ChatWindow
            user={activeChatUser}
            messages={messages}
            onSend={handleSendMessage}
            currentUserUid={user.uid}
          />
        ) : (
          <div className="flex-1 flex items-center bg-gray-800 justify-center text-gray-500">
            Chat tanlanmagan
          </div>
        )}
      </div>

      {chatToDelete && (
        <DeleteChatModal
          username={users.find(u => u.uid === chatToDelete)?.email}
          onClose={() => setChatToDelete(null)}
          onConfirm={handleDeleteChat}
        />
      )}

      <NotificationToast
        open={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
        message={notification.message}
        severity={notification.severity}
      />
    </div>
  )
}
