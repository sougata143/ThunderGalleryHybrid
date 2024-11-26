import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../../utils/logger';
import { Asset } from '@/services/mediaLibrary';
import { mediaLibrary } from '@/services/mediaLibrary';

export interface Photo {
  id: string;
  uri: string;
  thumbnailUri?: string;
  metadata?: {
    width: number;
    height: number;
    createdAt: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
  selected?: boolean;
}

export interface Album {
  id: string;
  name: string;
  photoIds: string[];
  type: 'manual' | 'auto';
  timestamp: number;
}

interface GalleryState {
  photos: { [key: string]: Photo };
  albums: { [key: string]: Album };
  selectedPhotos: string[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  endCursor: string;
}

const initialState: GalleryState = {
  photos: {},
  albums: {},
  selectedPhotos: [],
  loading: false,
  error: null,
  hasNextPage: true,
  endCursor: '',
};

export const loadLocalPhotos = createAsyncThunk(
  'gallery/loadLocalPhotos',
  async (_, { getState }) => {
    const state = getState() as { gallery: GalleryState };
    const { endCursor } = state.gallery;
    
    const result = await mediaLibrary.loadLocalPhotos(endCursor);
    return result;
  }
);

export const deletePhotos = createAsyncThunk(
  'gallery/deletePhotos',
  async (photoIds: string[]) => {
    const success = await mediaLibrary.deleteAssets(photoIds);
    if (!success) {
      throw new Error('Failed to delete photos');
    }
    return photoIds;
  }
);

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    setPhotos: (state, action: PayloadAction<{ [key: string]: Photo }>) => {
      logger.debug('Setting all photos', {
        tag: 'Gallery',
        data: { count: Object.keys(action.payload).length }
      });
      state.photos = action.payload;
      // Save to AsyncStorage
      AsyncStorage.setItem('photos', JSON.stringify(action.payload))
        .catch(error => logger.error('Failed to save photos to AsyncStorage', { 
          data: { error: error instanceof Error ? error.message : String(error) }
        }));
    },
    addPhoto: (state, action: PayloadAction<Photo>) => {
      logger.debug('Adding new photo', {
        tag: 'Gallery',
        data: { photoId: action.payload.id }
      });
      state.photos[action.payload.id] = action.payload;
      // Save to AsyncStorage
      AsyncStorage.setItem('photos', JSON.stringify(state.photos))
        .catch(error => logger.error('Failed to save photos to AsyncStorage', { 
          data: { error: error instanceof Error ? error.message : String(error) }
        }));
    },
    setAlbums: (state, action: PayloadAction<{ [key: string]: Album }>) => {
      state.albums = action.payload;
      AsyncStorage.setItem('albums', JSON.stringify(action.payload))
        .catch(error => logger.error('Failed to save albums to AsyncStorage', { 
          data: { error: error instanceof Error ? error.message : String(error) }
        }));
    },
    addAlbum: (state, action: PayloadAction<Album>) => {
      state.albums[action.payload.id] = action.payload;
      AsyncStorage.setItem('albums', JSON.stringify(state.albums))
        .catch(error => logger.error('Failed to save albums to AsyncStorage', { 
          data: { error: error instanceof Error ? error.message : String(error) }
        }));
    },
    updateAlbum: (state, action: PayloadAction<{ id: string; updates: Partial<Album> }>) => {
      if (state.albums[action.payload.id]) {
        state.albums[action.payload.id] = {
          ...state.albums[action.payload.id],
          ...action.payload.updates,
        };
        AsyncStorage.setItem('albums', JSON.stringify(state.albums))
          .catch(error => logger.error('Failed to save albums to AsyncStorage', { 
            data: { error: error instanceof Error ? error.message : String(error) }
          }));
      }
    },
    deleteAlbum: (state, action: PayloadAction<string>) => {
      delete state.albums[action.payload];
      AsyncStorage.setItem('albums', JSON.stringify(state.albums))
        .catch(error => logger.error('Failed to save albums to AsyncStorage', { 
          data: { error: error instanceof Error ? error.message : String(error) }
        }));
    },
    updatePhoto: (state, action: PayloadAction<{ id: string; updates: Partial<Photo> }>) => {
      if (state.photos[action.payload.id]) {
        state.photos[action.payload.id] = {
          ...state.photos[action.payload.id],
          ...action.payload.updates,
        };
        AsyncStorage.setItem('photos', JSON.stringify(state.photos))
          .catch(error => logger.error('Failed to save photos to AsyncStorage', { 
            data: { error: error instanceof Error ? error.message : String(error) }
          }));
      }
    },
    deletePhoto: (state, action: PayloadAction<string>) => {
      delete state.photos[action.payload];
      AsyncStorage.setItem('photos', JSON.stringify(state.photos))
        .catch(error => logger.error('Failed to save photos to AsyncStorage', { 
          data: { error: error instanceof Error ? error.message : String(error) }
        }));
    },
    togglePhotoSelection: (state, action) => {
      const photoId = action.payload;
      if (state.selectedPhotos.includes(photoId)) {
        state.selectedPhotos = state.selectedPhotos.filter(id => id !== photoId);
        if (state.photos[photoId]) {
          state.photos[photoId].selected = false;
        }
      } else {
        state.selectedPhotos.push(photoId);
        if (state.photos[photoId]) {
          state.photos[photoId].selected = true;
        }
      }
    },
    clearSelection: (state) => {
      state.selectedPhotos.forEach(id => {
        if (state.photos[id]) {
          state.photos[id].selected = false;
        }
      });
      state.selectedPhotos = [];
    },
    setSelectedPhotos: (state, action: PayloadAction<string[]>) => {
      state.selectedPhotos = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetGallery: (state) => {
      state.photos = {};
      state.albums = {};
      state.selectedPhotos = [];
      state.loading = false;
      state.error = null;
      state.hasNextPage = true;
      state.endCursor = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLocalPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadLocalPhotos.fulfilled, (state, action) => {
        state.loading = false;
        const { assets, hasNextPage, endCursor } = action.payload;
        assets.forEach(asset => {
          state.photos[asset.id] = asset;
        });
        state.hasNextPage = hasNextPage;
        state.endCursor = endCursor;
      })
      .addCase(loadLocalPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load photos';
      })
      .addCase(deletePhotos.fulfilled, (state, action) => {
        const photoIds = action.payload;
        photoIds.forEach(id => {
          delete state.photos[id];
        });
        state.selectedPhotos = state.selectedPhotos.filter(id => !photoIds.includes(id));
      });
  }
});

export const {
  setPhotos,
  addPhoto,
  setAlbums,
  addAlbum,
  updateAlbum,
  deleteAlbum,
  updatePhoto,
  deletePhoto,
  togglePhotoSelection,
  clearSelection,
  setSelectedPhotos,
  setLoading,
  setError,
  resetGallery,
} = gallerySlice.actions;

export default gallerySlice.reducer;
