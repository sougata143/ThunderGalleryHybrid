import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import logger from '@/utils/logger';

interface SettingsState {
  darkMode: boolean;
  notificationsEnabled: boolean;
}

const initialState: SettingsState = {
  darkMode: false,
  notificationsEnabled: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      logger.debug('Setting dark mode', {
        tag: 'Settings',
        data: { darkMode: action.payload }
      });
      state.darkMode = action.payload;
    },
    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      logger.debug('Setting notifications', {
        tag: 'Settings',
        data: { enabled: action.payload }
      });
      state.notificationsEnabled = action.payload;
    },
  },
});

export const { setDarkMode, setNotificationsEnabled } = settingsSlice.actions;
export default settingsSlice.reducer;
