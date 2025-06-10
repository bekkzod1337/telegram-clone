export default function UserAvatar({ name }) {
  // Foydalanuvchi ismining bosh harflarini olish
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold select-none">
      {initials}
    </div>
  );
}
