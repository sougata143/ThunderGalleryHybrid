import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  logger  from '../../utils/logger';

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
      AsyncStorage.setItem('gallery_photos', JSON.stringify(action.payload))
        .then(() => logger.debug('Photos saved to local storage', { tag: 'Gallery' }))
        .catch(error => logger.error('Failed to save photos to local storage', {
          tag: 'Gallery',
          data: { error }
        }));
    },
    setAlbums: (state, action: PayloadAction<{ [key: string]: Album }>) => {
      logger.debug('Setting all albums', {
        tag: 'Gallery',
        data: { count: Object.keys(action.payload).length }
      });
      state.albums = action.payload;
      AsyncStorage.setItem('gallery_albums', JSON.stringify(action.payload))
        .then(() => logger.debug('Albums saved to local storage', { tag: 'Gallery' }))
        .catch(error => logger.error('Failed to save albums to local storage', {
          tag: 'Gallery',
          data: { error }
        }));
    },
    addAlbum: (state, action: PayloadAction<Album>) => {
      logger.debug('Adding new album', {
        tag: 'Gallery',
        data: { albumId: action.payload.id, name: action.payload.name }
      });
      state.albums[action.payload.id] = action.payload;
      AsyncStorage.setItem('gallery_albums', JSON.stringify(state.albums))
        .then(() => logger.debug('Albums saved to local storage', { tag: 'Gallery' }))
        .catch(error => logger.error('Failed to save albums to local storage', {
          tag: 'Gallery',
          data: { error }
        }));
    },
    updateAlbum: (state, action: PayloadAction<{ id: string; updates: Partial<Album> }>) => {
      const { id, updates } = action.payload;
      if (state.albums[id]) {
        state.albums[id] = { ...state.albums[id], ...updates };
        AsyncStorage.setItem('gallery_albums', JSON.stringify(state.albums))
          .then(() => logger.debug('Albums updated in local storage', { tag: 'Gallery' }))
          .catch(error => logger.error('Failed to update albums in local storage', {
            tag: 'Gallery',
            data: { error }
          }));
      }
    },
    deleteAlbum: (state, action: PayloadAction<string>) => {
      logger.debug('Deleting album', {
        tag: 'Gallery',
        data: { albumId: action.payload }
      });
      delete state.albums[action.payload];
      AsyncStorage.setItem('gallery_albums', JSON.stringify(state.albums))
        .then(() => logger.debug('Albums updated in local storage after deletion', { tag: 'Gallery' }))
        .catch(error => logger.error('Failed to update albums in local storage after deletion', {
          tag: 'Gallery',
          data: { error }
        }));
    },
    updatePhoto: (state, action: PayloadAction<{ id: string; updates: Partial<Photo> }>) => {
      const { id, updates } = action.payload;
      if (state.photos[id]) {
        state.photos[id] = { ...state.photos[id], ...updates };
      }
    },
    deletePhoto: (state, action: PayloadAction<string>) => {
      delete state.photos[action.payload];
      // Remove from all albums
      Object.values(state.albums).forEach(album => {
        album.photoIds = album.photoIds.filter(id => id !== action.payload);
      });
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
});

export const {
  setPhotos,
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

// Load photos and albums from local storage on app start
export const loadLocalPhotos = () => async (dispatch: any) => {
  try {
    const [photosJson, albumsJson] = await Promise.all([
      AsyncStorage.getItem('gallery_photos'),
      AsyncStorage.getItem('gallery_albums')
    ]);
    
    if (photosJson) {
      dispatch(setPhotos(JSON.parse(photosJson)));
    }
    
    if (albumsJson) {
      const albums = JSON.parse(albumsJson);
      Object.values(albums).forEach((album: unknown) => {
        if (album && typeof album === 'object') {
          dispatch(addAlbum(album as Album));
        }
      });
    }
  } catch (error) {
    logger.error('Failed to load gallery data from local storage', {
      tag: 'Gallery',
      data: { error }
    });
  }
};

export default gallerySlice.reducer;
