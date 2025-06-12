import React, { useEffect, useState } from 'react'
import {
  auth,
  provider,
  db,
  realtimeDb,
  storage
} from './firebase'
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
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage'
import {
  ref as rtdbRef,
  onDisconnect,
  onValue,
  set
} from 'firebase/database'

import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import DeleteChatModal from './components/DeleteChatModal'
import NotificationToast from './components/NotificationToast'

export default function App() {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [userStatusMap, setUserStatusMap] = useState({})
  const [activeChatUser, setActiveChatUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [pinnedMessages, setPinnedMessages] = useState([])
  const [chatToDelete, setChatToDelete] = useState(null)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' })

  const [selectedUser, setSelectedUser] = useState(null);

const handleOpenChatById = (userId) => {
  const userToOpen = users.find(u => u.uid === userId) // ✅ 'users' to‘g‘ri nom
  if (userToOpen) {
    setActiveChatUser(userToOpen) // yoki setSelectedUser, agar kerak bo‘lsa
  }
}



  const saveUserToRealtimeDb = (user) => {
    set(rtdbRef(realtimeDb, 'users/' + user.uid), {
      email: user.email,
      photoURL: user.photoURL || null,
      lastMessage: null
    })
  }

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
            createdAt: serverTimestamp()
          })
        }

        saveUserToRealtimeDb(currentUser)

        const statusRef = rtdbRef(realtimeDb, `usersStatus/${currentUser.uid}`)
        await set(statusRef, { isOnline: true })
console.log('🟢 Status set to online:', currentUser.uid)

        onDisconnect(statusRef).set({ isOnline: false })

        loadUsers(currentUser.uid)
        listenToUserStatuses()
      } else {
        setUser(null)
        setUsers([])
        setUserStatusMap({})
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

  const listenToUserStatuses = () => {
    const statusRef = rtdbRef(realtimeDb, 'usersStatus')
    onValue(statusRef, (snapshot) => {
      const data = snapshot.val() || {}
      setUserStatusMap(data)
    })
  }

  const getChatId = (uid1, uid2) => {
    return uid1 > uid2 ? uid1 + '_' + uid2 : uid2 + '_' + uid1
  }

  const handleSendMessage = async (text, audioFile = null) => {
    if ((!text.trim() && !audioFile) || !activeChatUser) return

    const chatId = getChatId(user.uid, activeChatUser.uid)
    let audioUrl = null

    if (audioFile) {
      const audioRef = storageRef(storage, `voiceMessages/${Date.now()}_${audioFile.name}`)
      const snapshot = await uploadBytes(audioRef, audioFile)
      audioUrl = await getDownloadURL(snapshot.ref)
    }

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: text || '',
        audioUrl: audioUrl || null,
        senderId: user.uid,
        createdAt: serverTimestamp()
      })
      setNotification({ open: true, message: 'Xabar yuborildi', severity: 'success' })
    } catch (e) {
      alert('Xabar yuborishda xatolik: ' + e.message)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      alert('Kirishda xatolik: ' + error.message)
    }
  }

  const handleLogout = async () => {
    const statusRef = rtdbRef(realtimeDb, `usersStatus/${user.uid}`)
    await set(statusRef, { isOnline: false })
    await signOut(auth)
    setUser(null)
    setUsers([])
    setUserStatusMap({})
    setActiveChatUser(null)
  }

  useEffect(() => {
    if (!activeChatUser) {
      setMessages([])
      setPinnedMessages([])
      return
    }

    const chatId = getChatId(user.uid, activeChatUser.uid)

    const qMessages = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt'))
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      const msgs = []
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() })
      })
      setMessages(msgs)
    })

    const qPinned = query(collection(db, 'chats', chatId, 'pinnedMessages'), orderBy('createdAt'))
    const unsubscribePinned = onSnapshot(qPinned, (snapshot) => {
      const pins = []
      snapshot.forEach((doc) => pins.push({ id: doc.id, ...doc.data() }))
      setPinnedMessages(pins)
    })

    return () => {
      unsubscribeMessages()
      unsubscribePinned()
    }
  }, [activeChatUser, user])

  useEffect(() => {
    if (!user) return

    const handleBeforeUnload = async () => {
      const statusRef = rtdbRef(realtimeDb, `usersStatus/${user.uid}`)
      await set(statusRef, { isOnline: false })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [user])

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
        userStatusMap={userStatusMap}
        onLogout={handleLogout}
      />

      <div className="flex flex-col flex-1">
        {activeChatUser ? (
          <ChatWindow
  user={activeChatUser}
  messages={messages}
  onSend={handleSendMessage}
  currentUserUid={user.uid}
  onOpenChatById={handleOpenChatById}
/>


        ) : (
          <div className="flex-1 flex items-center bg-gray-800 justify-center text-gray-500">
            Chat tanlanmagan
          </div>
        )}
      </div>

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
