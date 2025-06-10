// src/lib/useAbly.js
import { useEffect, useState } from 'react';
import Ably from 'ably';

export default function useAbly(channelName = 'chat') {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!channelName) return;

    const ably = new Ably.Realtime({ key: import.meta.env.VITE_ABLY_CLIENT_API_KEY });

    const channel = ably.channels.get(channelName);

    channel.subscribe('message', (msg) => {
      setMessages((prev) => [...prev, msg.data]);
    });

    ably.connection.on('closed', () => {
      console.warn('Ably connection closed');
    });

    ably.connection.on('failed', () => {
      console.error('Ably connection failed');
    });

    return () => {
      channel.unsubscribe();
      ably.close();
    };
  }, [channelName]);

  return messages;
}
