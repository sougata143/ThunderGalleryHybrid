import galleryReducer, {
  setPhotos,
  addAlbum,
  updateAlbum,
  deleteAlbum,
  updatePhoto,
  deletePhoto,
  setSelectedPhotos,
  setLoading,
  setError,
} from '../gallerySlice';

describe('gallery slice', () => {
  const initialState = {
    photos: {},
    albums: {},
    selectedPhotos: [],
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(galleryReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setPhotos', () => {
    const photos = {
      '1': {
        id: '1',
        uri: 'test-uri',
        width: 100,
        height: 100,
        createdAt: '2024-01-01',
      },
    };
    const actual = galleryReducer(initialState, setPhotos(photos));
    expect(actual.photos).toEqual(photos);
  });

  it('should handle addAlbum', () => {
    const album = {
      id: '1',
      name: 'Test Album',
      photoIds: [],
      type: 'manual' as const,
      timestamp: Date.now(),
    };
    const actual = galleryReducer(initialState, addAlbum(album));
    expect(actual.albums['1']).toEqual(album);
  });

  it('should handle updateAlbum', () => {
    const initialStateWithAlbum = {
      ...initialState,
      albums: {
        '1': {
          id: '1',
          name: 'Test Album',
          photoIds: [],
          type: 'manual' as const,
          timestamp: Date.now(),
        },
      },
    };
    const updates = { name: 'Updated Album' };
    const actual = galleryReducer(
      initialStateWithAlbum,
      updateAlbum({ id: '1', updates })
    );
    expect(actual.albums['1'].name).toBe('Updated Album');
  });

  it('should handle deleteAlbum', () => {
    const initialStateWithAlbum = {
      ...initialState,
      albums: {
        '1': {
          id: '1',
          name: 'Test Album',
          photoIds: [],
          type: 'manual' as const,
          timestamp: Date.now(),
        },
      },
    };
    const actual = galleryReducer(initialStateWithAlbum, deleteAlbum('1'));
    expect(actual.albums['1']).toBeUndefined();
  });

  it('should handle setSelectedPhotos', () => {
    const selectedPhotos = ['1', '2', '3'];
    const actual = galleryReducer(initialState, setSelectedPhotos(selectedPhotos));
    expect(actual.selectedPhotos).toEqual(selectedPhotos);
  });

  it('should handle setLoading', () => {
    const actual = galleryReducer(initialState, setLoading(true));
    expect(actual.loading).toBe(true);
  });

  it('should handle setError', () => {
    const error = 'Test error';
    const actual = galleryReducer(initialState, setError(error));
    expect(actual.error).toBe(error);
  });
});
