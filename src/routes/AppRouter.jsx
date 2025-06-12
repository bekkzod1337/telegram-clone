import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginPage from '../pages/LoginPage'
import ChatPage from '../pages/ChatPage'

export default function AppRouter() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={user ? <ChatPage /> : <Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}
