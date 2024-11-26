import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

// Initialize WebBrowser for Google Auth
WebBrowser.maybeCompleteAuthSession();

interface PhotoMetadata {
  id: string;
  name: string;
  url: string;
  timestamp: number;
  albumId?: string;
}

class CloudStorageService {
  private static instance: CloudStorageService;
  private googleAccessToken: string | null = null;
  private appleCredential: AppleAuthentication.AppleAuthenticationCredential | null = null;

  private constructor() {
    this.initializeAuth();
  }

  static getInstance(): CloudStorageService {
    if (!CloudStorageService.instance) {
      CloudStorageService.instance = new CloudStorageService();
    }
    return CloudStorageService.instance;
  }

  private async initializeAuth() {
    this.googleAccessToken = await AsyncStorage.getItem('googleAccessToken');
  }

  async signInWithGoogle(promptAsync: () => Promise<any>) {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        this.googleAccessToken = result.authentication?.accessToken || null;
        await AsyncStorage.setItem('googleAccessToken', this.googleAccessToken || '');
      }
      return result;
    } catch (error) {
      console.error('Google sign in failed:', error);
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
    } catch (error: unknown) {
      if (error instanceof Error && error.hasOwnProperty('code') && (error as any).code === 'ERR_CANCELED') {
        return false;
      }
      throw error;
    }
  }

  async uploadPhoto(uri: string, albumId?: string): Promise<PhotoMetadata> {
    const photoId = Crypto.randomUUID();
    const filename = `${photoId}_${uri.split('/').pop()}`;
    
    if (Platform.OS === 'ios') {
      return this.uploadToICloud(uri, filename, albumId);
    } else {
      return this.uploadToGoogleDrive(uri, filename, albumId);
    }
  }

  private async uploadToICloud(uri: string, filename: string, albumId?: string): Promise<PhotoMetadata> {
    if (!this.appleCredential) {
      throw new Error('Not signed in to iCloud');
    }

    try {
      // Create app's photos directory if it doesn't exist
      const photosDir = `${FileSystem.documentDirectory}photos/`;
      const photosDirInfo = await FileSystem.getInfoAsync(photosDir);
      
      if (!photosDirInfo.exists) {
        await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });
      }

      // Copy photo to app's documents directory
      const destination = `${photosDir}${filename}`;
      await FileSystem.copyAsync({
        from: uri,
        to: destination
      });

      // Store metadata
      const metadata: PhotoMetadata = {
        id: filename.split('_')[0],
        name: filename,
        url: destination,
        timestamp: Date.now(),
        albumId
      };

      // Save metadata to AsyncStorage
      const key = `photo_${metadata.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(metadata));

      return metadata;
    } catch (error) {
      console.error('iCloud upload error:', error);
      throw new Error('Failed to save photo to iCloud');
    }
  }

  private async uploadToGoogleDrive(uri: string, filename: string, albumId?: string): Promise<PhotoMetadata> {
    if (!this.googleAccessToken) {
      throw new Error('Not signed in to Google Drive');
    }

    try {
      // Read file content
      const fileContent = await FileSystem.readAsStringAsync(uri, { 
        encoding: FileSystem.EncodingType.Base64 
      });

      // Create file metadata
      const metadata = {
        name: filename,
        mimeType: 'image/jpeg',
        appProperties: {
          albumId: albumId || 'default'
        }
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
      
      // Create metadata
      const photoMetadata: PhotoMetadata = {
        id: filename.split('_')[0],
        name: filename,
        url: `https://drive.google.com/uc?id=${result.id}`,
        timestamp: Date.now(),
        albumId
      };

      // Save metadata to AsyncStorage
      const key = `photo_${photoMetadata.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(photoMetadata));

      return photoMetadata;
    } catch (error) {
      console.error('Google Drive upload error:', error);
      throw new Error('Failed to upload to Google Drive');
    }
  }

  private createMultipartBody(metadata: any, base64Data: string): string {
    const boundary = 'foo_bar_baz';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const closeDelimiter = "\r\n--" + boundary + "--";

    return delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: image/jpeg\r\n' +
      'Content-Transfer-Encoding: base64\r\n\r\n' +
      base64Data +
      closeDelimiter;
  }

  async getPhotos(albumId?: string): Promise<PhotoMetadata[]> {
    const allKeys = await AsyncStorage.getAllKeys();
    const photoKeys = allKeys.filter(key => key.startsWith('photo_'));
    const photos: PhotoMetadata[] = [];

    for (const key of photoKeys) {
      const photoJson = await AsyncStorage.getItem(key);
      if (photoJson) {
        const photo = JSON.parse(photoJson) as PhotoMetadata;
        if (!albumId || photo.albumId === albumId) {
          photos.push(photo);
        }
      }
    }

    return photos.sort((a, b) => b.timestamp - a.timestamp);
  }

  async deletePhoto(photoId: string): Promise<void> {
    const key = `photo_${photoId}`;
    const photoJson = await AsyncStorage.getItem(key);
    
    if (!photoJson) {
      throw new Error('Photo not found');
    }

    const photo = JSON.parse(photoJson) as PhotoMetadata;

    if (Platform.OS === 'ios') {
      // Delete local file
      await FileSystem.deleteAsync(photo.url);
    } else if (this.googleAccessToken) {
      // Extract Google Drive file ID from URL
      const fileId = photo.url.split('id=')[1];
      
      // Delete from Google Drive
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.googleAccessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete photo from Google Drive');
      }
    }

    // Delete metadata from AsyncStorage
    await AsyncStorage.removeItem(key);
  }

  async signOut(): Promise<void> {
    this.googleAccessToken = null;
    this.appleCredential = null;
    await AsyncStorage.removeItem('googleAccessToken');
  }
}

export const cloudStorage = CloudStorageService.getInstance();
export default cloudStorage;
