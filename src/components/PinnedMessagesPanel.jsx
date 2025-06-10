export default function PinnedMessagesPanel({ pinnedMessages }) {
  if (pinnedMessages.length === 0) return null

  return (
    <div className="bg-yellow-100 p-2 border-b border-yellow-400">
      <div className="font-semibold mb-1">Pinlangan xabarlar:</div>
      <ul className="list-disc pl-5 text-sm">
        {pinnedMessages.map((msg) => (
          <li key={msg.id}>{msg.text}</li>
        ))}
      </ul>
    </div>
  )
}
