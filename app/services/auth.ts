import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import firebase from '@/config/firebase';
import logger from '@/utils/logger';

const auth = {
  signIn: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(firebase.auth, email, password);
      logger.info('User signed in successfully', { userId: userCredential.user.uid });
      return userCredential.user;
    } catch (error) {
      logger.error('Sign in failed', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebase.auth, email, password);
      logger.info('User created successfully', { userId: userCredential.user.uid });
      return userCredential.user;
    } catch (error) {
      logger.error('Sign up failed', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(firebase.auth);
      logger.info('User signed out successfully');
    } catch (error) {
      logger.error('Sign out failed', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  },

  getCurrentUser: () => {
    return firebase.auth.currentUser;
  }
};

export default auth;
