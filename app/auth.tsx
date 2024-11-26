import { View, StyleSheet } from 'react-native';
import { Auth } from '@/components/Auth';
import { Text } from '@/components/ui/Text';

export default function AuthScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="display">ThunderGallery</Text>
        <Text variant="body" style={styles.subtitle}>
          Your personal photo gallery
        </Text>
      </View>
      <Auth />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginTop: 100,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
});
