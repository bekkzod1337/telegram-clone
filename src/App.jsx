import React, { useEffect, useState } from 'react'
import { auth, provider, db } from './firebase'
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  getDocs,
  addDoc,
  orderBy,
  serverTimestamp,
  onSnapshot,
  deleteDoc
} from 'firebase/firestore'

import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import DeleteChatModal from './components/DeleteChatModal'
import NotificationToast from './components/NotificationToast'

export default function App() {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [activeChatUser, setActiveChatUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [chatToDelete, setChatToDelete] = useState(null)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', currentUser.uid), {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL || '',
            createdAt: serverTimestamp(),
          })
        }
        loadUsers(currentUser.uid)
      } else {
        setUser(null)
        setUsers([])
        setActiveChatUser(null)
      }
    })
    return unsubscribe
  }, [])

  const loadUsers = async (currentUid) => {
    const q = query(collection(db, 'users'), orderBy('email'))
    const querySnapshot = await getDocs(q)
    const allUsers = []
    querySnapshot.forEach((doc) => {
      if (doc.id !== currentUid) {
        allUsers.push({ uid: doc.id, ...doc.data() })
      }
    })
    setUsers(allUsers)
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      alert('Kirishda xatolik: ' + error.message)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    setUser(null)
    setUsers([])
    setActiveChatUser(null)
  }

  const getChatId = (uid1, uid2) => {
    return uid1 > uid2 ? uid1 + '_' + uid2 : uid2 + '_' + uid1
  }

  useEffect(() => {
    if (!activeChatUser) {
      setMessages([])
      return
    }

    const chatId = getChatId(user.uid, activeChatUser.uid)
    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = []
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() })
      })
      setMessages(msgs)
    })

    return () => unsubscribe()
  }, [activeChatUser, user])

  const handleSendMessage = async (text) => {
    if (!text.trim() || !activeChatUser) return
    const chatId = getChatId(user.uid, activeChatUser.uid)
    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text,
        senderId: user.uid,
        createdAt: serverTimestamp(),
      })
      setNotification({ open: true, message: 'Xabar yuborildi', severity: 'success' })
    } catch (e) {
      alert('Xabar yuborishda xatolik: ' + e.message)
    }
  }

  const handleDeleteChat = (uidToDelete) => {
    setChatToDelete(uidToDelete)
  }

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return
    const chatId = getChatId(user.uid, chatToDelete)
    try {
      const msgsRef = collection(db, 'chats', chatId, 'messages')
      const msgsSnapshot = await getDocs(msgsRef)
      const batch = []
      msgsSnapshot.forEach((docSnap) => {
        batch.push(deleteDoc(doc(db, 'chats', chatId, 'messages', docSnap.id)))
      })
      await Promise.all(batch)
      setChatToDelete(null)
      if (activeChatUser?.uid === chatToDelete) setActiveChatUser(null)
      setNotification({ open: true, message: 'Chat o‘chirildi', severity: 'warning' })
    } catch (e) {
      alert('Chat o‘chirishda xatolik: ' + e.message)
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <button onClick={handleGoogleLogin} className="bg-blue-600 text-white px-6 py-3 rounded">
          Google bilan kirish
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        users={users}
        activeUser={activeChatUser}
        onSelect={setActiveChatUser}
        onDeleteChat={handleDeleteChat}
        currentUserUid={user.uid}
      />
      {activeChatUser ? (
        <ChatWindow
          user={activeChatUser}
          messages={messages}
          onSend={handleSendMessage}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Chat tanlanmagan
        </div>
      )}
      {chatToDelete !== null && (
        <DeleteChatModal
          username={users.find((u) => u.uid === chatToDelete)?.email}
          onClose={() => setChatToDelete(null)}
          onConfirm={confirmDeleteChat}
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
