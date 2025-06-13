// components/ChatListSkeleton.jsx
import React from 'react';

export default function ChatListSkeleton() {
  return (
    <ul className="space-y-3 px-4 py-2">
      {[...Array(8)].map((_, i) => (
        <li
          key={i}
          className="flex items-center gap-3 animate-pulse bg-gray-800 p-3 rounded-md"
        >
          <div className="w-10 h-10 bg-gray-700 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="w-1/2 h-4 bg-gray-700 rounded" />
            <div className="w-1/3 h-3 bg-gray-700 rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}
