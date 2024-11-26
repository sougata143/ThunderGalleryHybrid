import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl, ActivityIndicator, Platform, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import IconSymbol from '@/components/ui/IconSymbol';
import { RootState } from '@/store';
import { cloudStorage } from '@/services/cloudStorage';
import { setSelectedPhotos, loadLocalPhotos, addPhoto } from '@/store/slices/gallerySlice';
import { Photo } from '../store/slices/gallerySlice';
import ThemedView from '@/components/ThemedView';
import { AppDispatch } from '@/store';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

export default function GalleryScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const photos = useSelector((state: RootState) => state.gallery.photos);
  const selectedPhotos = useSelector((state: RootState) => state.gallery.selectedPhotos);
  const loading = useSelector((state: RootState) => state.gallery.loading);
  const [refreshing, setRefreshing] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const { promptAsync } = useGoogleAuth();

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        await dispatch(loadLocalPhotos()).unwrap();
      } catch (error) {
        console.error('Failed to load local photos:', error);
      }
    };
    loadPhotos();
  }, [dispatch]);

  const pickImage = async () => {
    try {
      // Check if user is signed in to a cloud service
      if (Platform.OS === 'ios') {
        await cloudStorage.signInWithApple();
      } else {
        await cloudStorage.signInWithGoogle(promptAsync);
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        try {
          const photoMetadata = await cloudStorage.uploadPhoto(result.assets[0].uri);
          const newPhoto: Photo = {
            id: Date.now().toString(),
            uri: photoMetadata.url,
          };
          dispatch(addPhoto(newPhoto));
        } catch (error) {
          console.error('Error uploading photo:', error);
          Alert.alert('Error', 'Failed to upload photo to cloud storage');
        }
      }
    } catch (error) {
      console.error('Error picking or uploading image:', error);
      Alert.alert('Error', 'Please make sure you are signed in to your cloud storage account');
    }
  };

  const handlePhotoPress = (photoId: string) => {
    if (selectionMode) {
      const newSelection = selectedPhotos.includes(photoId)
        ? selectedPhotos.filter(id => id !== photoId)
        : [...selectedPhotos, photoId];
      
      dispatch(setSelectedPhotos(newSelection));
    } else {
      // Navigate to photo details or perform single tap action
      router.push(`/photo/${photoId}`);
    }
  };

  const handleLongPress = (photoId: string) => {
    setSelectionMode(true);
    dispatch(setSelectedPhotos([photoId]));
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(loadLocalPhotos()).unwrap();
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  const photoArray = Object.values(photos).filter((photo): photo is Photo => 
    typeof photo === 'object' && 
    photo !== null && 
    'id' in photo && 
    'uri' in photo
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={photoArray}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePhotoPress(item.id)}
            onLongPress={() => handleLongPress(item.id)}
            style={[
              styles.photoContainer,
              selectedPhotos.includes(item.id) && styles.selectedPhoto,
            ]}
          >
            <Image source={{ uri: item.uri }} style={styles.photo} />
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity style={styles.fab} onPress={pickImage}>
        <IconSymbol name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    flex: 1,
    margin: 1,
    aspectRatio: 1,
  },
  photo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  selectedPhoto: {
    opacity: 0.7,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
