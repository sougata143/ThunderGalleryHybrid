import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface TextProps extends RNTextProps {
  type?: 'default' | 'secondary' | 'header' | 'caption';
}

export default function Text({ style, type = 'default', ...props }: TextProps) {
  const colorScheme = useColorScheme();
  const defaultColor = Colors[colorScheme].text;

  return (
    <RNText
      style={[
        styles.default,
        type === 'secondary' && styles.secondary,
        type === 'header' && styles.header,
        type === 'caption' && styles.caption,
        { color: defaultColor },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
  },
  secondary: {
    fontSize: 14,
    opacity: 0.7,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 12,
    opacity: 0.5,
  },
});
