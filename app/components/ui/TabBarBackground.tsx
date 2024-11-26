import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  
  if (Platform.OS === 'ios') {
    return (
      <BlurView 
        tint={colorScheme}
        intensity={70}
        style={StyleSheet.absoluteFill}
      />
    );
  }

  // On Android, we use a semi-transparent background instead of blur
  return (
    <BlurView
      tint={colorScheme}
      intensity={100}
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)' }
      ]}
    />
  );
}
