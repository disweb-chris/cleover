import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyABM7C5IfYkyNTXihyk7flWDKau39wrYCY',
  authDomain: 'cleover-01.firebaseapp.com',
  projectId: 'cleover-01',
  storageBucket: 'cleover-01.firebasestorage.app',
  messagingSenderId: '177488778989',
  appId: '1:177488778989:web:061273ed4d27a559379ee4',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
