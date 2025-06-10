export default function MessageStatusIndicator({ seen }) {
  return (
    <span title={seen ? 'Ko‘rilgan' : 'Ko‘rilmagan'}>
      {seen ? '✔✔' : '✔'}
    </span>
  )
}
