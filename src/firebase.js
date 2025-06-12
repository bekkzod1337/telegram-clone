// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getDatabase } from 'firebase/database'
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyCcxb6gJxS2Q47SkJQ4fM0yqO1eeDyNMzc",
  authDomain: "telegram-clone-b6b68.firebaseapp.com",
  projectId: "telegram-clone-b6b68",
  storageBucket: "telegram-clone-b6b68.appspot.com",
  messagingSenderId: "634641069343",
  appId: "1:634641069343:web:4a8a8ebf8a9c90ddee2c2a",
  measurementId: "G-C7JCHMY3HD",
  databaseURL: 'https://telegram-clone-b6b68-default-rtdb.firebaseio.com'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
export {
  app,
  auth,
  db,
  provider,
  analytics,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
};
export const realtimeDb = getDatabase(app)