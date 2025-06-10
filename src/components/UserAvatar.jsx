export default function UserAvatar({ name = '' }) {
  // Ism bo'sh yoki noto'g'ri kelsa default belgini ko'rsatamiz
  const initials = name
    ? name
        .split(' ')
        .filter(Boolean) // bo'sh satrlarni olib tashlash
        .map((n) => n[0])
        .slice(0, 2) // faqat 2 harf olamiz (masalan, "John Doe" -> "JD")
        .join('')
        .toUpperCase()
    : '?'

  return (
    <div
      className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold select-none"
      title={name || 'Foydalanuvchi'}
      aria-label={`Foydalanuvchi avatar, ismi: ${name}`}
    >
      {initials}
    </div>
  )
}
