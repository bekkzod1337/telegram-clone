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
  const [loading, setLoading] = useState(false)
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

        onLogin(currentUser)
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleGoogleLogin = async () => {
    try {
      setError('')
      await signInWithPopup(auth, provider)
    } catch (err) {
      setError(err.message)
    }
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
      <p>Salom, {user.displayName}!</p>
      <button
        onClick={() => signOut(auth)}
        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
      >
        Chiqish
      </button>
    </div>
  )
}
