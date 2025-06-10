import { TextField } from '@mui/material';

export default function SearchBar({ onSearch }) {
  return (
    <TextField
      placeholder="Qidiruv..."
      fullWidth
      onChange={(e) => onSearch(e.target.value)}
      sx={{ my: 1 }}
      variant="outlined"
      inputProps={{ 'aria-label': 'Qidiruv maydoni' }}
    />
  );
}
