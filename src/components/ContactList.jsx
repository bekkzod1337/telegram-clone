import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Badge } from '@mui/material';

const contacts = [
  { id: 1, name: "Bekzod", status: "online" },
  { id: 2, name: "Akmal", status: "offline" },
];

export default function ContactList() {
  return (
    <List>
      {contacts.map(contact => (
        <ListItem key={contact.id} component="button" sx={{ cursor: 'pointer' }}>
          <ListItemAvatar>
            <Badge
              color={contact.status === 'online' ? 'success' : 'default'}
              variant="dot"
              overlap="circular"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <Avatar>{contact.name[0]}</Avatar>
            </Badge>
          </ListItemAvatar>
          <ListItemText
            primary={contact.name}
            secondary={contact.status === 'online' ? 'Online' : 'Offline'}
            sx={{ textTransform: 'capitalize' }}
          />
        </ListItem>
      ))}
    </List>
  );
}
