import { useState } from 'react';

export default function UserAvatar({ name = '', photoURL }) {
  const [imageError, setImageError] = useState(false);

  const initials = name
    ? name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  const title = name || 'Foydalanuvchi';

  return photoURL && !imageError ? (
    <img
      src={photoURL}
      alt={title}
      onError={() => setImageError(true)} // Fallback agar rasm yuklanmasa
      className="w-10 h-10 rounded-full object-cover"
      title={title}
    />
  ) : (
    <div
      className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold select-none"
      title={title}
    >
      {initials}
    </div>
  );
}
