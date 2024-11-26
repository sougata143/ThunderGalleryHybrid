import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';

// Initialize WebBrowser for Google Auth
WebBrowser.maybeCompleteAuthSession();

class CloudStorageService {
  private static instance: CloudStorageService;
  private googleAccessToken: string | null = null;
  private appleCredential: AppleAuthentication.AppleAuthenticationCredential | null = null;

  private constructor() {
    this.initializeGoogleAuth();
  }

  static getInstance(): CloudStorageService {
    if (!CloudStorageService.instance) {
      CloudStorageService.instance = new CloudStorageService();
    }
    return CloudStorageService.instance;
  }

  private async initializeGoogleAuth() {
    // Restore previous session if available
    this.googleAccessToken = await AsyncStorage.getItem('googleAccessToken');
  }

  async signInWithGoogle() {
    try {
      const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: 'PASTE_YOUR_ANDROID_CLIENT_ID_HERE',
        iosClientId: 'PASTE_YOUR_IOS_CLIENT_ID_HERE',
        webClientId: 'PASTE_YOUR_WEB_CLIENT_ID_HERE',
        scopes: ['https://www.googleapis.com/auth/drive.file'],
        redirectUri: makeRedirectUri({
          scheme: 'thundergallery',
          path: 'oauth2redirect'
        })
      });

      const result = await promptAsync();
      
      if (result?.type === 'success') {
        this.googleAccessToken = result.authentication.accessToken;
        await AsyncStorage.setItem('googleAccessToken', this.googleAccessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  }

  async signInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      this.appleCredential = credential;
      return true;
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        return false;
      }
      throw error;
    }
  }

  async uploadPhoto(uri: string, mimeType: string): Promise<string> {
    if (Platform.OS === 'ios') {
      return this.uploadToICloud(uri);
    } else {
      return this.uploadToGoogleDrive(uri);
    }
  }

  private async uploadToICloud(uri: string): Promise<string> {
    if (!this.appleCredential) {
      throw new Error('Not signed in to iCloud');
    }

    // For now, we'll just copy the file to app's documents directory
    const filename = uri.split('/').pop();
    const destination = `${FileSystem.documentDirectory}${filename}`;
    
    await FileSystem.copyAsync({
      from: uri,
      to: destination
    });
    
    return destination;
  }

  private async uploadToGoogleDrive(uri: string): Promise<string> {
    if (!this.googleAccessToken) {
      throw new Error('Not signed in to Google Drive');
    }

    const filename = uri.split('/').pop();
    const fileContent = await FileSystem.readAsStringAsync(uri, { 
      encoding: FileSystem.EncodingType.Base64 
    });

    // Create file metadata
    const metadata = {
      name: filename,
      mimeType: 'image/jpeg',
    };

    // Upload to Google Drive
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.googleAccessToken}`,
        'Content-Type': 'multipart/related; boundary=foo_bar_baz'
      },
      body: this.createMultipartBody(metadata, fileContent)
    });

    if (!response.ok) {
      throw new Error('Failed to upload to Google Drive');
    }

    const result = await response.json();
    return `https://drive.google.com/uc?id=${result.id}`;
  }

  private createMultipartBody(metadata: any, base64Data: string): string {
    const boundary = 'foo_bar_baz';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const closeDelimiter = "\r\n--" + boundary + "--";

    const multipartBody = 
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: image/jpeg\r\n' +
      'Content-Transfer-Encoding: base64\r\n\r\n' +
      base64Data +
      closeDelimiter;

    return multipartBody;
  }

  async signOut() {
    this.googleAccessToken = null;
    this.appleCredential = null;
    await AsyncStorage.removeItem('googleAccessToken');
  }
}

export const cloudStorage = CloudStorageService.getInstance();
