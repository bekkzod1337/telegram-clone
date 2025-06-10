import React, { useEffect, useState } from 'react'
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  db,
  setDoc,
  doc,
  getDoc,
} from './firebase'

export default function AuthWithEmail({ onLogin }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // boshida true, holatni aniqlash uchun
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)

        const userDoc = doc(db, 'users', currentUser.uid)
        const userSnap = await getDoc(userDoc)

        if (!userSnap.exists()) {
          await setDoc(userDoc, {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
          })
        }

        if (typeof onLogin === 'function') {
          onLogin(currentUser)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [onLogin])

  const handleGoogleLogin = async () => {
    try {
      setError('')
      setLoading(true)
      await signInWithPopup(auth, provider)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut(auth)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (loading) {
    return <p className="p-4">Yuklanmoqda...</p>
  }

  if (!user) {
    return (
      <div className="p-4">
        <button
          onClick={handleGoogleLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          Google bilan kirish
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    )
  }

  return (
    <div className="p-4">
      <p>Salom, {user.displayName}!</p>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
        disabled={loading}
      >
        Chiqish
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  )
}
