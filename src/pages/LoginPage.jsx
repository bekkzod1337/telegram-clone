import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider)
    } catch (e) {
      alert('Kirishda xatolik: ' + e.message)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <button onClick={handleGoogleLogin} className="bg-blue-600 text-white px-6 py-3 rounded">
        Google bilan kirish
      </button>
    </div>
  )
}
