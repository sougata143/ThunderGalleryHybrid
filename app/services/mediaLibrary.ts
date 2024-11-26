import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERMISSION_CACHE_KEY = '@ThunderGallery:mediaPermission';

export interface Asset extends MediaLibrary.Asset {
  selected?: boolean;
}

class MediaLibraryService {
  private static instance: MediaLibraryService;
  private permissionStatus: MediaLibrary.PermissionStatus | null = null;
  private permissionGranted: boolean = false;
  private permissionLoaded: boolean = false;
  private permissionLoadPromise: Promise<void> | null = null;

  private constructor() {
    // Permission will be loaded when needed
  }

  public static getInstance(): MediaLibraryService {
    if (!MediaLibraryService.instance) {
      MediaLibraryService.instance = new MediaLibraryService();
    }
    return MediaLibraryService.instance;
  }

  private async loadCachedPermission(): Promise<void> {
    try {
      const cachedPermission = await AsyncStorage.getItem(PERMISSION_CACHE_KEY);
      if (cachedPermission) {
        const { status, granted } = JSON.parse(cachedPermission);
        this.permissionStatus = status;
        this.permissionGranted = granted;
      }
      this.permissionLoaded = true;
    } catch (error) {
      console.error('Error loading cached permission:', error);
      this.permissionLoaded = true;
      // Reset permissions on error
      this.permissionStatus = null;
      this.permissionGranted = false;
    }
  }

  private async cachePermission(status: MediaLibrary.PermissionStatus, granted: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(
        PERMISSION_CACHE_KEY,
        JSON.stringify({ status, granted })
      );
      this.permissionStatus = status;
      this.permissionGranted = granted;
      this.permissionLoaded = true;
    } catch (error) {
      console.error('Error caching permission:', error);
    }
  }

  private async ensurePermissionLoaded(): Promise<void> {
    if (this.permissionLoadPromise) {
      await this.permissionLoadPromise;
      return;
    }

    if (!this.permissionLoaded) {
      this.permissionLoadPromise = this.loadCachedPermission();
      await this.permissionLoadPromise;
      this.permissionLoadPromise = null;
    }
  }

  async requestPermissions(forceRequest: boolean = false): Promise<boolean> {
    try {
      await this.ensurePermissionLoaded();

      // Always check current permission status first
      const { status: existingStatus, granted } = await MediaLibrary.getPermissionsAsync();
      console.log('Current permission status:', { status: existingStatus, granted });
      
      // If we have permission and not forcing request, return early
      if (!forceRequest && granted && existingStatus === 'granted') {
        await this.cachePermission(existingStatus, true);
        return true;
      }

      // Request permission
      console.log('Requesting media library permission...');
      const { status, granted: newGranted } = await MediaLibrary.requestPermissionsAsync();
      console.log('Permission request result:', { status, granted: newGranted });

      const finalGranted = newGranted && status === 'granted';
      await this.cachePermission(status, finalGranted);

      if (!finalGranted) {
        throw new Error('Media library permission denied');
      }

      return finalGranted;
    } catch (error) {
      console.error('Error requesting media library permissions:', error);
      await this.cachePermission('denied', false);
      throw error;
    }
  }

  async loadLocalPhotos(
    after?: string | null,
    limit: number = 20
  ): Promise<{ assets: Asset[]; hasNextPage: boolean; endCursor: string }> {
    try {
      // Ensure we have permission
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Media library permission not granted');
      }

      // Add a small delay to ensure permission changes are propagated
      await new Promise(resolve => setTimeout(resolve, 500));

      const options: MediaLibrary.AssetsOptions = {
        first: limit,
        mediaType: ['photo'],
        sortBy: [MediaLibrary.SortBy.creationTime],
      };

      if (after) {
        options.after = after;
      }

      const result = await MediaLibrary.getAssetsAsync(options);
      
      if (!result.assets || result.assets.length === 0) {
        console.log('No photos found in media library');
        return {
          assets: [],
          hasNextPage: false,
          endCursor: '',
        };
      }

      return {
        assets: result.assets.map(asset => ({ ...asset, selected: false })),
        hasNextPage: result.hasNextPage,
        endCursor: result.endCursor,
      };
    } catch (error) {
      console.error('Error loading local photos:', error);
      throw error;
    }
  }

  async getAssetInfo(assetId: string): Promise<MediaLibrary.Asset | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Media library permission not granted');
      }

      const asset = await MediaLibrary.getAssetInfoAsync(assetId);
      return asset;
    } catch (error) {
      console.error('Error getting asset info:', error);
      return null;
    }
  }

  async deleteAssets(assetIds: string[]): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Media library permission not granted');
      }

      await MediaLibrary.deleteAssetsAsync(assetIds);
      return true;
    } catch (error) {
      console.error('Error deleting assets:', error);
      return false;
    }
  }

  async createAlbum(albumName: string, assetIds: string[]): Promise<MediaLibrary.Album | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Media library permission not granted');
      }

      const album = await MediaLibrary.createAlbumAsync(albumName, assetIds[0], false);
      if (assetIds.length > 1) {
        await MediaLibrary.addAssetsToAlbumAsync(assetIds.slice(1), album.id, false);
      }
      return album;
    } catch (error) {
      console.error('Error creating album:', error);
      return null;
    }
  }

  async getAlbums(): Promise<MediaLibrary.Album[]> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Media library permission not granted');
      }

      const albums = await MediaLibrary.getAlbumsAsync();
      return albums;
    } catch (error) {
      console.error('Error getting albums:', error);
      return [];
    }
  }
}

// Export singleton instance
export const mediaLibrary = MediaLibraryService.getInstance();

// Add default export to satisfy Expo Router
export default MediaLibraryService;
