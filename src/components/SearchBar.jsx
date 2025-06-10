import { TextField } from '@mui/material'

export default function SearchBar({ onSearch }) {
  return (
    <TextField
      placeholder="Email orqali qidiruv..."
      fullWidth
      onChange={(e) => onSearch(e.target.value.toLowerCase())}
      sx={{ my: 1 }}
      variant="outlined"
      inputProps={{ 'aria-label': 'Qidiruv maydoni' }}
    />
  )
}
