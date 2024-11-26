import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setPhotos, setAlbums } from '../store/slices/gallerySlice';
import { logger } from '../utils/logger';
import { ActivityIndicator, View } from 'react-native';

interface Props {
  children: React.ReactNode;
}

export default function StoreInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeStore = async () => {
      try {
        // Load photos from AsyncStorage
        const storedPhotos = await AsyncStorage.getItem('gallery_photos');
        if (storedPhotos) {
          dispatch(setPhotos(JSON.parse(storedPhotos)));
        }

        // Load albums from AsyncStorage
        const storedAlbums = await AsyncStorage.getItem('gallery_albums');
        if (storedAlbums) {
          dispatch(setAlbums(JSON.parse(storedAlbums)));
        }

        logger.info('Store initialized from local storage', {
          tag: 'Store',
          data: {
            photosLoaded: !!storedPhotos,
            albumsLoaded: !!storedAlbums,
          }
        });
      } catch (error) {
        logger.error('Failed to initialize store from local storage', {
          tag: 'Store',
          data: { error }
        });
      } finally {
        setIsInitialized(true);
      }
    };

    initializeStore();
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
}
