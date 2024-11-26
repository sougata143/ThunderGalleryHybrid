import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logger } from '../../utils/logger';

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      if (action.payload) {
        logger.info('User logged in', {
          tag: 'Auth',
          data: {
            userId: action.payload.id,
            email: action.payload.email,
            displayName: action.payload.displayName
          }
        });
      } else {
        logger.info('User cleared', { tag: 'Auth' });
      }
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      logger.debug('Auth loading state changed', {
        tag: 'Auth',
        data: { loading: action.payload }
      });
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        logger.error('Auth error occurred', {
          tag: 'Auth',
          data: { error: action.payload }
        });
      } else {
        logger.debug('Auth error cleared', { tag: 'Auth' });
      }
      state.error = action.payload;
    },
    clearUser: (state) => {
      logger.info('User logged out', {
        tag: 'Auth',
        data: { previousUserId: state.user?.id }
      });
      state.user = null;
      state.error = null;
    },
  },
});

export const {
  setUser,
  setLoading,
  setError,
  clearUser,
} = authSlice.actions;

export default authSlice.reducer;
