import React, { useState } from 'react';
import VoiceMessagePlayer from './VoiceMessagePlayer';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../firebase'; // to‘g‘ri path’ga moslashtiring

export default function ChatWindow({ user, messages, selectedUser }) {
  const [text, setText] = useState('');
  const [audioFile, setAudioFile] = useState(null);

  const sendMessage = async (text, audioFile) => {
    try {
      let audioUrl = null;

      if (audioFile) {
        const fileName = `${Date.now()}_${audioFile.name.replace(/\s+/g, '_')}`;
        const audioRef = ref(storage, `voiceMessages/${fileName}`);
        const snapshot = await uploadBytes(audioRef, audioFile);
        audioUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'messages'), {
        senderId: user.uid,
        receiverId: selectedUser.uid,
        text: text || '',
        audioUrl: audioUrl || '',
        createdAt: serverTimestamp(),
      });

      setText('');
      setAudioFile(null);
    } catch (error) {
      console.error('Xabar yuborishda xatolik:', error);
    }
  };

  const handleSendText = () => {
    if (text.trim()) {
      sendMessage(text.trim(), null);
    }
  };

  const handleSendAudio = () => {
    if (audioFile) {
      sendMessage('', audioFile);
    }
  };

  const handleAudioInputChange = (e) => {
    if (e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4 overflow-y-auto bg-gray-900 text-gray-100">
      <div className="flex flex-col gap-3 mb-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg max-w-xs shadow-md break-words ${
              msg.senderId === user.uid
                ? 'self-end bg-blue-600 text-white'
                : 'self-start bg-gray-700 text-gray-200'
            }`}
          >
            {msg.audioUrl ? (
              <VoiceMessagePlayer src={msg.audioUrl} />
            ) : (
              <p>{msg.text}</p>
            )}
            <small className="text-gray-400 text-xs mt-1 block text-right">
              {msg.createdAt?.toDate?.()?.toLocaleString() || ''}
            </small>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg shadow-inner sticky bottom-0">
        <input
          type="text"
          placeholder="Xabar kiriting..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendText();
          }}
        />

        <label
          htmlFor="audio-upload"
          className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm select-none"
          title="Ovoz faylini yuklash"
        >
          Fayl tanlash
        </label>
        <input
          id="audio-upload"
          type="file"
          accept="audio/*"
          onChange={handleAudioInputChange}
          className="hidden"
        />

        <button
          onClick={handleSendText}
          disabled={!text.trim()}
          className={`px-5 py-2 rounded-md text-white text-sm font-semibold transition-colors ${
            text.trim()
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-900 cursor-not-allowed'
          }`}
        >
          Yuborish
        </button>

        <button
          onClick={handleSendAudio}
          disabled={!audioFile}
          className={`px-5 py-2 rounded-md text-white text-sm font-semibold transition-colors ${
            audioFile
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-green-900 cursor-not-allowed'
          }`}
        >
          Ovoz yuborish
        </button>
      </div>
    </div>
  );
}
