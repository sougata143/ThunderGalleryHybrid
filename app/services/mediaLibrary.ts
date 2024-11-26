import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';

export interface Asset extends MediaLibrary.Asset {
  selected?: boolean;
}

class MediaLibraryService {
  private static instance: MediaLibraryService;

  private constructor() {}

  public static getInstance(): MediaLibraryService {
    if (!MediaLibraryService.instance) {
      MediaLibraryService.instance = new MediaLibraryService();
    }
    return MediaLibraryService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await MediaLibrary.getPermissionsAsync();
      
      if (existingStatus === 'granted') {
        return true;
      }

      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting media library permissions:', error);
      return false;
    }
  }

  async loadLocalPhotos(
    after?: string,
    limit: number = 20
  ): Promise<{ assets: Asset[]; hasNextPage: boolean; endCursor: string }> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Media library permission not granted');
      }

      const { assets, endCursor, hasNextPage } = await MediaLibrary.getAssetsAsync({
        first: limit,
        after,
        mediaType: ['photo'],
        sortBy: [MediaLibrary.SortBy.creationTime],
      });

      // Add selected property to each asset
      const assetsWithSelection = assets.map(asset => ({
        ...asset,
        selected: false,
      }));

      return {
        assets: assetsWithSelection,
        hasNextPage: hasNextPage || false,
        endCursor: endCursor || '',
      };
    } catch (error) {
      console.error('Error loading local photos:', error);
      throw error;
    }
  }

  async getAssetInfo(assetId: string): Promise<MediaLibrary.Asset | null> {
    try {
      const asset = await MediaLibrary.getAssetInfoAsync(assetId);
      return asset;
    } catch (error) {
      console.error('Error getting asset info:', error);
      return null;
    }
  }

  async deleteAssets(assetIds: string[]): Promise<boolean> {
    try {
      await MediaLibrary.deleteAssetsAsync(assetIds);
      return true;
    } catch (error) {
      console.error('Error deleting assets:', error);
      return false;
    }
  }

  async createAlbum(albumName: string, assetIds: string[]): Promise<MediaLibrary.Album | null> {
    try {
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
      const albums = await MediaLibrary.getAlbumsAsync();
      return albums;
    } catch (error) {
      console.error('Error getting albums:', error);
      return [];
    }
  }
}

export const mediaLibrary = MediaLibraryService.getInstance();
