// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCcxb6gJxS2Q47SkJQ4fM0yqO1eeDyNMzc",
  authDomain: "telegram-clone-b6b68.firebaseapp.com",
  projectId: "telegram-clone-b6b68",
  storageBucket: "telegram-clone-b6b68.appspot.com", // Bu yerda `.app` emas `.appspot.com` bo'lishi kerak
  messagingSenderId: "634641069343",
  appId: "1:634641069343:web:4a8a8ebf8a9c90ddee2c2a",
  measurementId: "G-C7JCHMY3HD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { app, db, auth, provider, analytics };
