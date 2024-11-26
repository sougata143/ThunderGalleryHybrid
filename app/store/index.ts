import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import logger from '@/utils/logger';
import { createLogger } from 'redux-logger';
import galleryReducer from './slices/gallerySlice';
import aiReducer from './slices/aiSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    gallery: galleryReducer,
    ai: aiReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(createLogger()),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
