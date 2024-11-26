import React from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const colorScheme = useNativeColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationThemeProvider value={theme}>
      {children}
    </NavigationThemeProvider>
  );
}
