import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  connectFirestoreEmulator 
} from 'firebase/firestore';
import { 
  getAuth, 
  connectAuthEmulator,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCvEfCWOAYHWwXzKUtzsAAgEy4ihuVGmyo",
  authDomain: "unm-ca-reading.firebaseapp.com",
  databaseURL: "https://unm-ca-reading-default-rtdb.firebaseio.com",
  projectId: "unm-ca-reading",
  storageBucket: "unm-ca-reading.firebasestorage.app",
  messagingSenderId: "178446111024",
  appId: "1:178446111024:web:234fef020bfbadab75f8f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

// Initialize Firestore
const db = getFirestore(app);

// Enable Firestore offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence enabled in first tab only');
    } else if (err.code === 'unimplemented') {
      console.warn('Browser doesn\'t support persistence');
    }
  });

export { app, auth, db };