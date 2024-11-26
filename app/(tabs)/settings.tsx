import React from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import IconSymbol from '@/components/ui/IconSymbol';
import { RootState } from '@/store';
import auth from '@/services/auth';
import ThemedText from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { setDarkMode, setNotificationsEnabled } from '@/store/slices/settingsSlice';

interface SettingItem {
  id: string;
  title: string;
  icon: string;
  action?: () => void;
  toggle?: boolean;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const { darkMode, notificationsEnabled } = useSelector((state: RootState) => state.settings);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      // Navigation will be handled by auth state change
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const settings: SettingItem[] = [
    {
      id: 'appearance',
      title: 'Dark Mode',
      icon: 'moon-outline',
      toggle: true,
      value: darkMode,
      onValueChange: (value) => {
        dispatch(setDarkMode(value));
      },
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline',
      toggle: true,
      value: notificationsEnabled,
      onValueChange: (value) => {
        dispatch(setNotificationsEnabled(value));
      },
    },
    {
      id: 'signout',
      title: 'Sign Out',
      icon: 'log-out-outline',
      action: handleSignOut,
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={item.action}
      disabled={item.toggle}
    >
      <IconSymbol name={item.icon} size={24} />
      <ThemedText style={styles.settingTitle}>{item.title}</ThemedText>
      {item.toggle && (
        <Switch
          value={item.value}
          onValueChange={item.onValueChange}
          style={styles.switch}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {settings.map(renderSettingItem)}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 16,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
  },
  switch: {
    marginLeft: 8,
  },
});
