// components/EmptyChatPlaceholder.jsx
import { Box, Typography } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

export default function EmptyChatPlaceholder() {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.secondary',
        p: 2,
      }}
    >
      <ChatBubbleOutlineIcon sx={{ fontSize: 64, mb: 2 }} />
      <Typography variant="h6" align="center">
        Suhbat tanlang yoki yangi boshlang
      </Typography>
    </Box>
  );
}
  