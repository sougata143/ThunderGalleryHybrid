import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/auth';
import { router } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';

export function Auth() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await authService.signInWithGoogle();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Google sign in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      await authService.signInWithApple();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Apple sign in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setIsLoading(true);
      await authService.signInAsGuest();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Guest sign in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        onPress={handleGoogleSignIn}
        disabled={isLoading}
        style={styles.button}
      >
        Sign in with Google
      </Button>

      {Platform.OS === 'ios' && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          style={styles.appleButton}
          onPress={handleAppleSignIn}
        />
      )}

      <Button
        onPress={handleGuestSignIn}
        disabled={isLoading}
        style={styles.button}
        variant="secondary"
      >
        Continue as Guest
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    width: '100%',
    marginVertical: 8,
  },
  appleButton: {
    width: '100%',
    height: 44,
    marginVertical: 8,
  },
});
