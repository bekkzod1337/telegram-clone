import React, { useState, useEffect, useRef } from 'react'
import { db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default function UserSearch({ onSelectUser }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Debounce uchun timeoutRef
  const debounceTimeout = useRef(null)

  useEffect(() => {
    // Bo'sh qidiruvda natijalarni tozalash
    if (!searchTerm.trim()) {
      setResults([])
      setLoading(false)
      setError(null)
      return
    }

    // Debounce: qidiruvni 300ms kutib bajarish
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)

    debounceTimeout.current = setTimeout(async () => {
      setLoading(true)
      setError(null)

      try {
        const q = query(
          collection(db, 'usernames'),
          where('username', '>=', searchTerm),
          where('username', '<=', searchTerm + '\uf8ff')
        )
        const querySnapshot = await getDocs(q)

        const usersFound = []
        querySnapshot.forEach((doc) => {
          usersFound.push(doc.data())
        })

        setResults(usersFound)
      } catch (err) {
        setError('Qidiruvda xatolik yuz berdi')
      } finally {
        setLoading(false)
      }
    }, 300)

    // Cleanup timeout
    return () => clearTimeout(debounceTimeout.current)
  }, [searchTerm])

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Username qidirish..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        autoComplete="off"
        aria-label="Username qidiruv maydoni"
      />

      {loading && <div className="mt-2 text-sm text-gray-500">Qidirilmoqda...</div>}
      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}

      <ul className="mt-2 max-h-40 overflow-y-auto border rounded bg-white shadow-sm">
        {results.length === 0 && !loading && (
          <li className="p-2 text-gray-400 text-sm select-none">Hech qanday natija topilmadi</li>
        )}
        {results.map((user) => (
          <li
            key={user.uid}
            onClick={() => onSelectUser(user)}
            className="cursor-pointer hover:bg-blue-100 p-2 rounded transition"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelectUser(user)
            }}
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  )
}
