export default function UserAvatar({ name = '', photoURL }) {
  const initials = name
    ? name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  return photoURL ? (
    <img
      src={photoURL}
      alt={name}
      className="w-10 h-10 rounded-full object-cover"
      title={name}
    />
  ) : (
    <div
      className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold select-none"
      title={name || 'Foydalanuvchi'}
    >
      {initials}
    </div>
  );
}
