import React from 'react';
import { Text, TextStyle, TextProps, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

type TextType = 
  | 'default'
  | 'defaultSemiBold'
  | 'title'
  | 'subtitle'
  | 'caption'
  | 'link'
  | 'error'
  | 'success';

interface ThemedTextProps extends Omit<TextProps, 'style'> {
  children: React.ReactNode;
  type?: TextType;
  style?: TextStyle | TextStyle[];
  color?: string;
}

export default function ThemedText({ children, type = 'default', style, color, ...props }: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const defaultColor = color || Colors[colorScheme].text;

  return (
    <Text
      style={[
        styles.base,
        type === 'defaultSemiBold' && styles.defaultSemiBold,
        type === 'title' && styles.title,
        type === 'subtitle' && styles.subtitle,
        type === 'caption' && styles.caption,
        type === 'link' && [styles.link, { color: Colors[colorScheme].tint }],
        type === 'error' && [styles.error, { color: Colors[colorScheme].error }],
        type === 'success' && [styles.success, { color: Colors[colorScheme].success }],
        { color: defaultColor },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontWeight: '600',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    lineHeight: 41,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 30,
  },
  caption: {
    fontSize: 14,
    lineHeight: 21,
    opacity: 0.8,
  },
  link: {
    textDecorationLine: 'underline',
  },
  error: {
    fontWeight: '500',
  },
  success: {
    fontWeight: '500',
  },
});
