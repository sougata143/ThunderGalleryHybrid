import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';

import HapticTab from '@/components/HapticTab';
import IconSymbol from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';

const Colors = {
  light: {
    tint: '#2196F3',
    tabIconDefault: '#ccc',
    tabIconSelected: '#2196F3',
  },
  dark: {
    tint: '#fff',
    tabIconDefault: '#ccc',
    tabIconSelected: '#fff',
  },
};

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarBackground: () => <TabBarBackground />,
        headerShown: false,
        tabBarStyle: {
          position: Platform.OS === 'ios' ? 'absolute' : 'relative',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 34 : 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol name="home-outline" color={color} focused={focused} />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol name="images-outline" color={color} focused={focused} />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI Tools',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol name="flash-outline" color={color} focused={focused} />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol name="settings-outline" color={color} focused={focused} />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
    </Tabs>
  );
}
