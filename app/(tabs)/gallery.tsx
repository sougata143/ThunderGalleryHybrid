import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import IconSymbol from '@/components/ui/IconSymbol';
import { RootState } from '@/store';
import { uploadPhoto } from '@/services/storage';
import { setSelectedPhotos } from '@/store/slices/gallerySlice';
import ThemedView from '@/components/ThemedView';

export default function GalleryScreen() {
  const dispatch = useDispatch();
  const photos = useSelector((state: RootState) => state.gallery.photos);
  const selectedPhotos = useSelector((state: RootState) => state.gallery.selectedPhotos);
  const [refreshing, setRefreshing] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      try {
        await uploadPhoto(result.assets[0].uri);
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    }
  };

  const handlePhotoPress = (photoId: string) => {
    if (selectionMode) {
      const newSelection = selectedPhotos.includes(photoId)
        ? selectedPhotos.filter(id => id !== photoId)
        : [...selectedPhotos, photoId];
      dispatch(setSelectedPhotos(newSelection));
    } else {
      router.push(`/photo/${photoId}`);
    }
  };

  const handleLongPress = (photoId: string) => {
    setSelectionMode(true);
    dispatch(setSelectedPhotos([photoId]));
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Implement refresh logic here
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => handlePhotoPress(item)}
      onLongPress={() => handleLongPress(item)}
      style={styles.photoContainer}
    >
      <Image source={{ uri: item }} style={styles.photo} />
      {selectionMode && (
        <View style={styles.selectionOverlay}>
          <IconSymbol
            name={selectedPhotos.includes(item) ? 'check-circle' : 'circle'}
            size={24}
            color={selectedPhotos.includes(item) ? '#4CAF50' : '#ffffff'}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        numColumns={3}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity style={styles.fab} onPress={pickImage}>
        <IconSymbol name="plus" size={24} color="#ffffff" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photoContainer: {
    flex: 1/3,
    aspectRatio: 1,
    padding: 1,
  },
  photo: {
    flex: 1,
    borderRadius: 4,
  },
  selectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
