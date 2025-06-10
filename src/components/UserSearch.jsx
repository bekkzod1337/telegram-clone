import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default function UserSearch({ onSelectUser }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([])
      return
    }

    const search = async () => {
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
    }

    search()
  }, [searchTerm])

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Username qidirish..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        className="border p-2 rounded w-full"
      />
      <ul className="mt-2 max-h-40 overflow-y-auto">
        {results.map((user) => (
          <li
            key={user.uid}
            onClick={() => onSelectUser(user)}
            className="cursor-pointer hover:bg-gray-200 p-2 rounded"
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  )
}
