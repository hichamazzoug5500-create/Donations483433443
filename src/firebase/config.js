import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDxuoWkEP_o8T_Qdt8zZA4CiOKFsBp75_A",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "donations-bd9f2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "donations-bd9f2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "donations-bd9f2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "152610577314",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:152610577314:web:955afa07488b8b897670fb"
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId === "donations-bd9f2"
);

let app;
let auth;
let db;
let storage;
let googleProvider;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (error) {
  console.warn("Firebase initialization notice:", error.message);
}

export { app, auth, db, storage, googleProvider };
