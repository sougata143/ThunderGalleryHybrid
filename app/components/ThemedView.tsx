import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface ThemedViewProps extends ViewProps {
  variant?: 'default' | 'card' | 'elevated';
}

export function ThemedView({ style, variant = 'default', ...props }: ThemedViewProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme].background;

  return (
    <View
      style={[
        styles.base,
        variant === 'card' && [
          styles.card,
          {
            backgroundColor: colorScheme === 'dark' 
              ? 'rgba(255,255,255,0.1)' 
              : 'rgba(0,0,0,0.05)',
          },
        ],
        variant === 'elevated' && [
          styles.elevated,
          {
            backgroundColor,
            shadowColor: colorScheme === 'dark' ? '#000' : '#888',
          },
        ],
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    marginVertical: 8,
  },
  elevated: {
    borderRadius: 12,
    marginVertical: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ThemedView;
