import React, { useEffect, useState } from 'react'
import { auth, provider, db } from './firebase'
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

import { storage } from './firebase';
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
  const [pinnedMessages, setPinnedMessages] = useState([])  // Qo'shildi
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



const handleSendMessage = async (text, audioFile = null) => {
  if ((!text.trim() && !audioFile) || !activeChatUser) return;

  const chatId = getChatId(user.uid, activeChatUser.uid);
  let audioUrl = null;

  if (audioFile) {
    const audioRef = ref(storage, `voiceMessages/${Date.now()}_${audioFile.name}`);
    const snapshot = await uploadBytes(audioRef, audioFile);
    audioUrl = await getDownloadURL(snapshot.ref);
  }

  try {
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text: text || '',
      audioUrl: audioUrl || null,
      senderId: user.uid,
      createdAt: serverTimestamp(),
    });
    setNotification({ open: true, message: 'Xabar yuborildi', severity: 'success' });
  } catch (e) {
    alert('Xabar yuborishda xatolik: ' + e.message);
  }
};



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

  // Xabarlarni tinglash
  useEffect(() => {
    if (!activeChatUser) {
      setMessages([])
      setPinnedMessages([])  // Faollashmaganida bo‘shqatamiz
      return
    }

    const chatId = getChatId(user.uid, activeChatUser.uid)

    // Oddiy xabarlar
    const qMessages = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt'))
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      const msgs = []
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() })
      })
      setMessages(msgs)
    })

    // Pinned messages
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


  const handleDeleteChat = (uidToDelete) => {
    setChatToDelete(uidToDelete)
  }

  const confirmDeleteChat = async (deleteForOther = false) => {
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

      // Agar deleteForOther true bo'lsa, boshqalar uchun ham o'chirish (boshqa logika kerak bo'lishi mumkin)
      // Hozircha faqat o'z chatimizni o'chiramiz

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
        onLogout={handleLogout}
      />

      <div className="flex flex-col flex-1">
        {/* Pinned messages panel */}
        

        {activeChatUser ? (
          <ChatWindow
  user={activeChatUser}
  messages={messages}
  onSend={handleSendMessage}
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
