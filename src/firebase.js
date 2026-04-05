import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, getDoc, setDoc, doc, updateDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhFO_VRasjh9WflqEJCaWSTZQRe2odlB4",
  authDomain: "swasthya-saathi-ai.firebaseapp.com",
  projectId: "swasthya-saathi-ai",
  storageBucket: "swasthya-saathi-ai.firebasestorage.app",
  messagingSenderId: "663674543574",
  appId: "1:663674543574:web:a137e6fce39712cc905877",
  measurementId: "G-6TFLXG5ND3"
};

// Initialize Firebase
let app;
let db;
let auth;

try {
  // We check if values are still placeholder
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase initialized successfully");
  } else {
    console.warn("Firebase config is using placeholders. Leaderboard will fall back to local mock data.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, db, collection, getDocs, getDoc, setDoc, doc, updateDoc, onSnapshot, query, orderBy, limit };
