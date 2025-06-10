// components/GroupCreateModal.jsx
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material';

export default function GroupCreateModal({ open, onClose, onCreate }) {
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (open) setGroupName(''); // Modal ochilganda nomni tozalash
  }, [open]);

  const handleCreate = () => {
    if (!groupName.trim()) return; // Bo‘sh nomga ruxsat yo‘q
    if (onCreate) onCreate(groupName.trim());
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Yangi Guruh</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Guruh nomi"
          fullWidth
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCreate();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Bekor</Button>
        <Button onClick={handleCreate} disabled={!groupName.trim()}>
          Yaratish
        </Button>
      </DialogActions>
    </Dialog>
  );
}
