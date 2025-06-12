import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db, realtimeDb } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { ref as rtdbRef, set, onDisconnect } from 'firebase/database'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        const userRef = doc(db, 'users', currentUser.uid)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL || '',
            createdAt: serverTimestamp(),
          })
        }

        const statusRef = rtdbRef(realtimeDb, `usersStatus/${currentUser.uid}`)
        await set(statusRef, { isOnline: true })
        onDisconnect(statusRef).set({ isOnline: false })
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    const statusRef = rtdbRef(realtimeDb, `usersStatus/${user.uid}`)
    await set(statusRef, { isOnline: false })
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
