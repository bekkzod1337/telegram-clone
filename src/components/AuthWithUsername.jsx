import React, { useEffect, useState } from 'react'
import debounce from 'lodash/debounce'
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  db,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from './firebase'

// Username validatsiya: faqat harf, raqam, pastki chiziq (_)
// Boshida raqam bo'lmasin, __ ikki marta ketmasin, boshida/oxirida chiziq bo'lmasin
const isValidUsername = (username) => {
  const regex = /^(?!.*__)(?!.*_$)(?!^_)(?!^[0-9])[a-zA-Z0-9_]+$/
  return regex.test(username)
}

export default function AuthWithUsername({ onLogin }) {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  // Username mavjudligini tekshiruvchi funksiyani debounce bilan kechiktiramiz
  const checkUsername = async (name) => {
    if (!isValidUsername(name)) {
      setUsernameAvailable(false)
      return
    }

    const q = query(collection(db, 'usernames'), where('username', '==', name))
    const docsSnap = await getDocs(q)
    setUsernameAvailable(docsSnap.empty)
  }

  const checkUsernameDebounced = debounce(checkUsername, 500)

  const handleUsernameChange = (e) => {
    const val = e.target.value.trim().toLowerCase()
    setUsername(val)

    if (!isValidUsername(val)) {
      setUsernameAvailable(false)
      return
    }

    checkUsernameDebounced(val)
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSaveUsername = async () => {
    if (!usernameAvailable || !isValidUsername(username)) {
      setError('Yaroqli va band bo‘lmagan username kiriting.')
      return
    }

    setLoading(true)
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        username,
      })
      await setDoc(doc(db, 'usernames', username), {
        uid: user.uid,
        username,
      })
      onLogin(user, username)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <div className="p-4">
        <button
          onClick={handleGoogleLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Google bilan kirish
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    )
  }

  return (
    <div className="p-4">
      <p>Salom, {user.displayName}! Iltimos username tanlang:</p>
      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Username"
        className="border p-2 rounded w-full mt-2"
      />
      {username && !isValidUsername(username) && (
        <p className="text-red-600">Faqat harf, raqam va "_" ruxsat etiladi. Boshi/oxiri noto‘g‘ri.</p>
      )}
      {usernameAvailable === false && isValidUsername(username) && (
        <p className="text-red-600">Bu username band</p>
      )}
      {usernameAvailable === true && (
        <p className="text-green-600">Username bo‘sh</p>
      )}

      <button
        onClick={handleSaveUsername}
        disabled={!usernameAvailable || !isValidUsername(username) || loading}
        className="mt-3 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        Saqlash
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <button
        onClick={() => signOut(auth)}
        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
      >
        Chiqish
      </button>
    </div>
  )
}
