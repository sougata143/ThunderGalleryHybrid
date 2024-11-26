import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import IconSymbol from '@/components/ui/IconSymbol';
import { RootState } from '@/store';
import { addAlbum } from '@/store/slices/gallerySlice';
import { v4 as uuidv4 } from 'uuid';

export default function AlbumsScreen() {
  const dispatch = useDispatch();
  const albums = useSelector((state: RootState) => state.gallery.albums);
  const photos = useSelector((state: RootState) => state.gallery.photos);

  const createNewAlbum = () => {
    Alert.prompt(
      'New Album',
      'Enter album name:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Create',
          onPress: (name?: string) => {
            if (name) {
              dispatch(
                addAlbum({
                  id: uuidv4(),
                  name,
                  photoIds: [],
                  type: 'manual',
                  timestamp: Date.now(),
                })
              );
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const renderAlbum = ({ item: albumId }: { item: string }) => {
    const album = albums[albumId];
    const coverPhotoId = album.photoIds[0];
    const coverPhoto = coverPhotoId ? photos[coverPhotoId] : null;

    return (
      <TouchableOpacity
        style={styles.albumContainer}
        onPress={() => router.push(`/album/${albumId}`)}
      >
        <View style={styles.albumCover}>
          {coverPhoto ? (
            <Image source={{ uri: coverPhoto.uri }} style={styles.albumCoverImage} />
          ) : (
            <View style={styles.emptyAlbumCover}>
              <IconSymbol name="photo" size={40} color="#999" />
            </View>
          )}
        </View>
        <View style={styles.albumInfo}>
          <Text style={styles.albumName}>{album.name}</Text>
          <Text style={styles.photoCount}>
            {album.photoIds.length} {album.photoIds.length === 1 ? 'photo' : 'photos'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(albums)}
        renderItem={renderAlbum}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity style={styles.fab} onPress={createNewAlbum}>
        <IconSymbol name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
  },
  albumContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  albumCover: {
    width: 80,
    height: 80,
  },
  albumCoverImage: {
    width: '100%',
    height: '100%',
  },
  emptyAlbumCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  albumName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  photoCount: {
    fontSize: 14,
    color: '#666',
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
