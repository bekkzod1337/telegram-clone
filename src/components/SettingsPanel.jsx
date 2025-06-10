import { useState } from 'react';
import { Switch, Typography, List, ListItem, ListItemText, Divider, Select, MenuItem } from '@mui/material';

export default function SettingsPanel({ onDarkModeChange }) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('uz');

  const handleDarkModeToggle = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      if (onDarkModeChange) onDarkModeChange(newValue);
      return newValue;
    });
  };

  return (
    <List>
      <ListItem>
        <ListItemText primary="Qorong'u rejim" />
        <Switch
          checked={darkMode}
          onChange={handleDarkModeToggle}
          inputProps={{ 'aria-label': 'Qorong’u rejimni yoqish/o‘chirish' }}
        />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary="Til" />
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          size="small"
          sx={{ minWidth: 100 }}
          aria-label="Tilni tanlash"
        >
          <MenuItem value="uz">O'zbek</MenuItem>
          <MenuItem value="ru">Ruscha</MenuItem>
          <MenuItem value="en">Inglizcha</MenuItem>
        </Select>
      </ListItem>
    </List>
  );
}
