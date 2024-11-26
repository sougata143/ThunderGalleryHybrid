import React from 'react';
import { StyleSheet, Text, TextProps, Platform } from 'react-native';
import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ExternalLinkProps extends Omit<TextProps, 'onPress'> {
  href: string;
  children: React.ReactNode;
}

export default function ExternalLink({ href, style, children, ...props }: ExternalLinkProps) {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme].tint;

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      WebBrowser.openBrowserAsync(href);
    }
  };

  return Platform.OS === 'web' ? (
    <Link 
      href={href} 
      target="_blank" 
      style={[styles.link, { color }, style]} 
      {...props}
    >
      {children}
    </Link>
  ) : (
    <Text 
      onPress={handlePress} 
      style={[styles.link, { color }, style]} 
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
  },
});
