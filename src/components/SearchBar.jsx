import { TextField } from '@mui/material';

export default function SearchBar({ onSearch, darkMode = false }) {
  return (
    <TextField
      placeholder="Email orqali qidiruv..."
      fullWidth
      onChange={(e) => onSearch(e.target.value.toLowerCase())}
      variant="outlined"
      inputProps={{ 'aria-label': 'Qidiruv maydoni' }}
      sx={{
        my: 1,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          backgroundColor: darkMode ? '#1f2937' : '#f5f7fa', // 🔄 fon rangi
          paddingRight: '8px',
          boxShadow: darkMode ? 'none' : '0 2px 6px rgba(0,0,0,0.1)',
          '& fieldset': {
            borderColor: darkMode ? '#374151' : '#cbd5e1',
          },
          '&:hover fieldset': {
            borderColor: '#3f51b5',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#3f51b5',
            boxShadow: '0 0 0 2px rgba(63,81,181,0.25)',
          },
        },
        '& input': {
          padding: '12px 14px',
          fontSize: '16px',
          color: darkMode ? '#f3f4f6' : '#333',
          '&::placeholder': {
            color: darkMode ? '#9ca3af' : '#999',
            opacity: 1,
            fontStyle: 'italic',
          },
        },
      }}
    />
  );
}
