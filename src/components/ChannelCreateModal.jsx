import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material';

export default function ChannelCreateModal({ open, onClose, onCreate }) {
  const [channelName, setChannelName] = useState('');

  const handleCreate = () => {
    if (!channelName.trim()) return; // bo‘sh nomga yo‘l qo‘ymaslik
    onCreate(channelName.trim());
    setChannelName('');
    onClose();
  };

  const handleClose = () => {
    setChannelName('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Yangi Kanal</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Kanal nomi"
          fullWidth
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Bekor</Button>
        <Button onClick={handleCreate} disabled={!channelName.trim()}>
          Yaratish
        </Button>
      </DialogActions>
    </Dialog>
  );
}
