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
  where,
  getDocs,
  addDoc,
  orderBy,
  serverTimestamp,
  onSnapshot,
  deleteDoc
} from 'firebase/firestore'

import UserSearch from './components/UserSearch'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import DeleteChatModal from './components/DeleteChatModal'
import NotificationToast from './components/NotificationToast'

export default function App() {
  const [user, setUser] = useState(null) // Google User (auth)
  const [username, setUsername] = useState('') // chosen username
  const [users, setUsers] = useState([]) // all users for sidebar
  const [activeChatUser, setActiveChatUser] = useState(null) // chatting with who
  const [messages, setMessages] = useState([]) // current chat messages
  const [chatToDelete, setChatToDelete] = useState(null)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' })

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        // Check if user has username in Firestore
        const userDoc = await getDoc(doc(db, 'usernames', currentUser.uid))
        if (userDoc.exists()) {
          setUsername(userDoc.data().username)
          loadUsers()
        } else {
          setUsername('') // no username yet
        }
      } else {
        setUser(null)
        setUsername('')
        setUsers([])
        setActiveChatUser(null)
      }
    })
    return unsubscribe
  }, [])

  // Load all usernames for sidebar
  const loadUsers = async () => {
    const q = query(collection(db, 'usernames'), orderBy('username'))
    const querySnapshot = await getDocs(q)
    const allUsers = []
    querySnapshot.forEach((doc) => {
      if (doc.id !== user.uid) {
        allUsers.push({ uid: doc.id, username: doc.data().username })
      }
    })
    setUsers(allUsers)
  }

  // Google sign in
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      alert('Kirishda xatolik: ' + error.message)
    }
  }

  // Sign out
  const handleLogout = async () => {
    await signOut(auth)
    setUsername('')
    setUser(null)
    setUsers([])
    setActiveChatUser(null)
  }

  // Save chosen username
  const handleSaveUsername = async () => {
    if (!username.trim()) return alert('Username kiriting')
    // Check if username already exists
    const q = query(collection(db, 'usernames'), where('username', '==', username))
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      alert('Bu username band, boshqasini tanlang')
      return
    }
    try {
      await setDoc(doc(db, 'usernames', user.uid), {
        username,
        createdAt: serverTimestamp(),
      })
      setNotification({ open: true, message: 'Username saqlandi', severity: 'success' })
      loadUsers()
    } catch (e) {
      alert('Xatolik yuz berdi: ' + e.message)
    }
  }

  // Select user to chat with
  useEffect(() => {
    if (!activeChatUser) {
      setMessages([])
      return
    }

    // Subscribe to messages between current user and activeChatUser
    const chatId = getChatId(user.uid, activeChatUser.uid)

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = []
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() })
      })
      setMessages(msgs)
    })

    return () => unsubscribe()
  }, [activeChatUser, user])

  // Generate consistent chatId from two uids
  const getChatId = (uid1, uid2) => {
    return uid1 > uid2 ? uid1 + '_' + uid2 : uid2 + '_' + uid1
  }

  // Send message
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

  // Delete chat
  const handleDeleteChat = (uidToDelete) => {
    setChatToDelete(uidToDelete)
  }

  // Confirm delete chat
  const confirmDeleteChat = async () => {
    if (!chatToDelete) return
    const chatId = getChatId(user.uid, chatToDelete)
    try {
      // Delete all messages in chat
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
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Google bilan kirish
        </button>
      </div>
    )
  }

  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h2 className="text-xl font-semibold">Username tanlang</h2>
        <input
          type="text"
          placeholder="Username kiriting"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleSaveUsername}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Saqlash
        </button>
        <button
          onClick={handleLogout}
          className="text-red-600 underline mt-2"
        >
          Chiqish
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
          username={users.find((u) => u.uid === chatToDelete)?.username}
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
