import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import logger from '@/utils/logger';

// Initialize WebBrowser for Google Auth
WebBrowser.maybeCompleteAuthSession();

export type UserType = {
  id: string;
  email?: string;
  name?: string;
  authProvider: 'google' | 'apple' | 'guest';
};

class AuthService {
  private static instance: AuthService;
  private currentUser: UserType | null = null;

  private constructor() {
    this.initializeAuth();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async initializeAuth() {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    } catch (error) {
      logger.error('Failed to initialize auth', { error });
    }
  }

  async signInWithGoogle(): Promise<UserType> {
    try {
      const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      });

      const result = await promptAsync();
      
      if (result?.type === 'success') {
        // Check if authentication exists before accessing accessToken
        if (!result.authentication) {
          throw new Error('Authentication failed: No authentication details received');
        }

        // Get user info using the access token
        const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: {
            Authorization: `Bearer ${result.authentication.accessToken}`
          }
        });

        const userInfo = await userInfoResponse.json();

        // Safely parse user info with type checking
        const newUser: UserType = {
          id: typeof userInfo.id === 'string' ? userInfo.id : '',
          email: typeof userInfo.email === 'string' ? userInfo.email : undefined,
          name: typeof userInfo.name === 'string' ? userInfo.name : undefined,
          authProvider: 'google'
        };

        // Save user to AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        
        this.currentUser = newUser;
        return newUser;
      } else {
        throw new Error('Google Sign-In was cancelled or failed');
      }
    } catch (error) {
      logger.error('Google Sign-In Error', { error });
      throw error;
    }
  }

  async signInWithApple(): Promise<UserType> {
    try {
      if (Platform.OS !== 'ios') {
        throw new Error('Apple authentication is only available on iOS devices');
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      this.currentUser = {
        id: credential.user,
        email: credential.email && typeof credential.email === 'string' ? credential.email : undefined,
        name: credential.fullName?.givenName && typeof credential.fullName.givenName === 'string'
          ? `${credential.fullName.givenName} ${credential.fullName.familyName && typeof credential.fullName.familyName === 'string' ? credential.fullName.familyName : ''}`.trim()
          : undefined,
        authProvider: 'apple'
      };

      await AsyncStorage.setItem('user', JSON.stringify(this.currentUser));
      return this.currentUser;
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        throw new Error('Apple sign in was cancelled');
      }
      logger.error('Apple sign in failed', { error });
      throw error;
    }
  }

  async signInAsGuest(): Promise<UserType> {
    try {
      const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      this.currentUser = {
        id: guestId,
        name: 'Guest User',
        authProvider: 'guest'
      };

      await AsyncStorage.setItem('user', JSON.stringify(this.currentUser));
      return this.currentUser;
    } catch (error) {
      logger.error('Guest sign in failed', { error });
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await AsyncStorage.removeItem('user');
      this.currentUser = null;
    } catch (error) {
      logger.error('Sign out failed', { error });
      throw error;
    }
  }

  getCurrentUser(): UserType | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

export const authService = new AuthService();
export default authService;
