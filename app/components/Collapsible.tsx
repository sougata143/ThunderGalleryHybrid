import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Pressable, Animated, LayoutAnimation } from 'react-native';
import IconSymbol from '@/components/ui/IconSymbol';
import { Text } from './ui/Text';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  initiallyExpanded?: boolean;
  animationConfig?: LayoutAnimation.Config;
}

export default function Collapsible({
  title,
  children,
  initiallyExpanded = false,
  animationConfig = LayoutAnimation.Presets.easeInEaseOut,
}: CollapsibleProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme].text;

  const toggleExpand = useCallback(() => {
    LayoutAnimation.configureNext(animationConfig);
    setIsExpanded(!isExpanded);
  }, [isExpanded, animationConfig]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={toggleExpand}
        style={({ pressed }) => [
          styles.header,
          pressed && styles.headerPressed,
        ]}
      >
        <Text style={styles.title}>{title}</Text>
        <IconSymbol
          name={isExpanded ? 'chevron.up' : 'chevron.down'}
          size={20}
          style={[styles.icon, { color: iconColor }]}
        />
      </Pressable>
      {isExpanded && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 12,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  headerPressed: {
    opacity: 0.7,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginLeft: 8,
  },
  content: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
});
