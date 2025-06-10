import { Snackbar, Alert } from '@mui/material';

export default function NotificationToast({
  open,
  onClose,
  message,
  severity = 'info',
  autoHideDuration = 3000,
}) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return; // Foydalanuvchi tashqariga bosganida yopilmasin
    onClose();
  };

  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
