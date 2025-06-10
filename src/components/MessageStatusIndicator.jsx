// components/MessageStatusIndicator.jsx
import { CheckCheck, Clock } from 'lucide-react';

export default function MessageStatusIndicator({ sent }) {
  return sent ? (
    <CheckCheck size={14} className="text-blue-400" />
  ) : (
    <Clock size={14} className="text-gray-400 animate-pulse" />
  );
}
          