// Firebase Config for Mobile App
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyAi7SRfKCj6K9qeNSs0b44NYK6KNnZs3j8",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "horeca-dd6df.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "horeca-dd6df",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "horeca-dd6df.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "437742488411",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:437742488411:web:a250abe4b7138d619ba87e",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-X1JH7ESZ96"
};
