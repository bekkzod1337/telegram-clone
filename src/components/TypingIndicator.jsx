export default function TypingIndicator({ isTyping, username }) {
  if (!isTyping) return null
  return <div>{username} yozmoqda...</div>
}
