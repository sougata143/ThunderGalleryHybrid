import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebase from '@/config/firebase';
import logger from '@/utils/logger';
import { store } from '../store';
import { addPhoto, updatePhoto } from '../store/slices/gallerySlice';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

const storage = {
  uploadPhoto: async (uri: string, metadata?: any): Promise<any> => {
    try {
      const filename = `photos/${store.getState().auth.user?.id}/${uuidv4()}.jpg`;
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(firebase.storage, filename);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Create photo object
      const photo = {
        id: uuidv4(),
        uri: downloadURL,
        timestamp: Date.now(),
        metadata: {
          ...metadata,
          filename,
        },
      };

      // Add to Redux store
      store.dispatch(addPhoto(photo));
      logger.info('Photo uploaded successfully', {
        tag: 'Storage',
        data: { photoId: photo.id }
      });

      return photo;
    } catch (error) {
      logger.error('Failed to upload photo', { 
        error: error instanceof Error ? error.message : String(error),
        filename: `photos/${store.getState().auth.user?.id}/${uuidv4()}.jpg`
      });
      throw error;
    }
  },

  getPhotoURL: async (filename: string): Promise<string> => {
    try {
      const storageRef = ref(firebase.storage, filename);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      logger.error('Failed to get photo URL', {
        error: error instanceof Error ? error.message : String(error),
        filename
      });
      throw error;
    }
  },

  downloadPhoto: async (photoId: string) => {
    try {
      const photo = store.getState().gallery.photos[photoId];
      if (!photo) throw new Error('Photo not found');

      const localPath = `${FileSystem.documentDirectory}photos/${photoId}.jpg`;
      
      // Ensure directory exists
      const dirPath = `${FileSystem.documentDirectory}photos`;
      const dirInfo = await FileSystem.getInfoAsync(dirPath);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
      }
      
      // Download file
      await FileSystem.downloadAsync(photo.uri, localPath);
      logger.info('Photo downloaded successfully', {
        tag: 'Storage',
        data: { photoId, localPath }
      });

      return localPath;
    } catch (error) {
      logger.error('Error downloading photo', {
        tag: 'Storage',
        data: { error, photoId }
      });
      throw error;
    }
  },

  deletePhoto: async (photoId: string) => {
    try {
      const photo = store.getState().gallery.photos[photoId];
      if (!photo) throw new Error('Photo not found');

      // Delete from storage
      await storage.deletePhotoFromStorage(photo.metadata.filename);
      logger.info('Photo deleted successfully', {
        tag: 'Storage',
        data: { photoId }
      });

      return true;
    } catch (error) {
      logger.error('Error deleting photo', {
        tag: 'Storage',
        data: { error, photoId }
      });
      throw error;
    }
  },

  deletePhotoFromStorage: async (filename: string) => {
    try {
      await storage.deletePhotoFromStorageHelper(filename);
    } catch (error) {
      logger.error('Error deleting photo from storage', {
        tag: 'Storage',
        data: { error, filename }
      });
      throw error;
    }
  },

  deletePhotoFromStorageHelper: async (filename: string) => {
    await storage.deletePhotoFromStorageHelperImpl(filename);
  },

  deletePhotoFromStorageHelperImpl: async (filename: string) => {
    const storageRef = ref(firebase.storage, filename);
    await storage.deletePhotoFromStorageHelperImpl2(storageRef);
  },

  deletePhotoFromStorageHelperImpl2: async (storageRef: any) => {
    await storage.deletePhotoFromStorageHelperImpl3(storageRef);
  },

  deletePhotoFromStorageHelperImpl3: async (storageRef: any) => {
    await storage.deletePhotoFromStorageHelperImpl4(storageRef);
  },

  deletePhotoFromStorageHelperImpl4: async (storageRef: any) => {
    await storage.deletePhotoFromStorageHelperImpl5(storageRef);
  },

  deletePhotoFromStorageHelperImpl5: async (storageRef: any) => {
    await storage.deletePhotoFromStorageHelperImpl6(storageRef);
  },

  deletePhotoFromStorageHelperImpl6: async (storageRef: any) => {
    await storage.deletePhotoFromStorageHelperImpl7(storageRef);
  },

  deletePhotoFromStorageHelperImpl7: async (storageRef: any) => {
    await storage.deletePhotoFromStorageHelperImpl8(storageRef);
  },

  deletePhotoFromStorageHelperImpl8: async (storageRef: any) => {
    await storage.deletePhotoFromStorageHelperImpl9(storageRef);
  },

  deletePhotoFromStorageHelperImpl9: async (storageRef: any) => {
    await storage.deletePhotoFromStorageHelperImpl10(storageRef);
  },

  deletePhotoFromStorageHelperImpl10: async (storageRef: any) => {
    await storage.deletePhotoFromStorageHelperImpl11(storageRef);
  },

  deletePhotoFromStorageHelperImpl11: async (storageRef: any) => {
    await storage.deletePhotoFromStorageHelperImpl12(storageRef);
  },

  deletePhotoFromStorageHelperImpl12: async (storageRef: any) => {
    await deleteObject(storageRef);
  },

  updatePhotoMetadata: async (photoId: string, metadata: any) => {
    try {
      const photo = store.getState().gallery.photos[photoId];
      if (!photo) throw new Error('Photo not found');

      // Update metadata in storage
      await storage.updatePhotoMetadataHelper(photo.metadata.filename, metadata);

      // Update in Redux store
      store.dispatch(updatePhoto({ id: photoId, updates: { metadata } }));
      logger.info('Photo metadata updated successfully', {
        tag: 'Storage',
        data: { photoId }
      });

      return true;
    } catch (error) {
      logger.error('Error updating photo metadata', {
        tag: 'Storage',
        data: { error, photoId }
      });
      throw error;
    }
  },

  updatePhotoMetadataHelper: async (filename: string, metadata: any) => {
    try {
      await storage.updatePhotoMetadataHelperImpl(filename, metadata);
    } catch (error) {
      logger.error('Error updating photo metadata', {
        tag: 'Storage',
        data: { error, filename }
      });
      throw error;
    }
  },

  updatePhotoMetadataHelperImpl: async (filename: string, metadata: any) => {
    const storageRef = ref(firebase.storage, filename);
    await storage.updatePhotoMetadataHelperImpl2(storageRef, metadata);
  },

  updatePhotoMetadataHelperImpl2: async (storageRef: any, metadata: any) => {
    await updateMetadata(storageRef, metadata);
  },
};

export default storage;
