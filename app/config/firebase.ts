import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '@/utils/logger';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

let app;
let storage;
let auth;

try {
  app = initializeApp(firebaseConfig);
  storage = getStorage(app);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

  logger.info('Firebase initialized successfully', { tag: 'Firebase' });
} catch (error) {
  logger.error('Firebase initialization failed', {
    data: { errorMessage: error instanceof Error ? error.message : String(error) },
    tag: 'Firebase'
  });
}

export { app, storage, auth };
