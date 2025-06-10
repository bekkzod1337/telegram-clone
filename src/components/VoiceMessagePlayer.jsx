import { IconButton, Slider } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useRef, useState, useEffect } from 'react';

export default function VoiceMessagePlayer({ src }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 dan 100 gacha foizda

  // Ovoz davomiyligi va hozirgi vaqtni kuzatish uchun
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const current = audio.currentTime;
      const duration = audio.duration || 1;
      setProgress((current / duration) * 100);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => setPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  const handleSliderChange = (event, newValue) => {
    const audio = audioRef.current;
    const duration = audio.duration || 1;
    audio.currentTime = (newValue / 100) * duration;
    setProgress(newValue);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
      <IconButton onClick={togglePlay}>
        {playing ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <audio ref={audioRef} src={src} hidden />
      <Slider
        size="small"
        value={progress}
        max={100}
        onChange={handleSliderChange}
        sx={{ flexGrow: 1 }}
      />
    </div>
  );
}
