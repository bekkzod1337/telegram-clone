import { getDatabase, ref, onDisconnect, set } from 'firebase/database';

export function setUserOnlineStatus(user) {
  if (!user?.uid) return;

  const db = getDatabase();
  const statusRef = ref(db, `/status/${user.uid}`);

  const isOfflineForDatabase = {
    state: 'offline',
    last_changed: Date.now(),
  };

  const isOnlineForDatabase = {
    state: 'online',
    last_changed: Date.now(),
  };

  // Sahifa yopilganda avtomatik offline qilish
  onDisconnect(statusRef).set(isOfflineForDatabase).then(() => {
    // Hozir online deb yozish
    set(statusRef, isOnlineForDatabase);
  });
}
