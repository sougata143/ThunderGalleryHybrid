import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface IconSymbolProps {
  name: string;
  size?: number;
  color?: string;
  focused?: boolean;
}

export default function IconSymbol({ name, size = 24, color, focused = false }: IconSymbolProps) {
  const colorScheme = useColorScheme();
  const tintColor = color || (focused ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].tabIconDefault);

  return (
    <Ionicons
      name={name as keyof typeof Ionicons.glyphMap}
      size={size}
      style={[styles.icon, { color: tintColor }]}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: -3,
  },
});
