import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../../utils/logger';

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
}

const initialState: GalleryState = {
  photos: {},
  albums: {},
  selectedPhotos: [],
  loading: false,
  error: null,
};

export const loadLocalPhotos = createAsyncThunk(
  'gallery/loadLocalPhotos',
  async (_, { dispatch }) => {
    try {
      const [photosString, albumsString] = await Promise.all([
        AsyncStorage.getItem('photos'),
        AsyncStorage.getItem('albums'),
      ]);

      const result: { photos?: { [key: string]: Photo }, albums?: { [key: string]: Album } } = {};

      if (photosString) {
        result.photos = JSON.parse(photosString);
      }

      if (albumsString) {
        result.albums = JSON.parse(albumsString);
      }

      return result;
    } catch (error) {
      logger.error('Failed to load photos from AsyncStorage', { 
        data: { error: error instanceof Error ? error.message : String(error) }
      });
      throw error;
    }
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
    setSelectedPhotos: (state, action: PayloadAction<string[]>) => {
      state.selectedPhotos = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
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
        if (action.payload.photos) {
          state.photos = action.payload.photos;
        }
        if (action.payload.albums) {
          state.albums = action.payload.albums;
        }
      })
      .addCase(loadLocalPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load photos';
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
  setSelectedPhotos,
  setLoading,
  setError,
} = gallerySlice.actions;

export default gallerySlice.reducer;
