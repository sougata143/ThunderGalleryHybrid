import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import IconSymbol from '@/components/ui/IconSymbol';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import ImageWithLoader from '@/components/ui/ImageWithLoader';
import { RootState, AppDispatch } from '@/store';
import { loadLocalPhotos, resetGallery, deletePhotos, clearSelection, togglePhotoSelection } from '@/store/slices/gallerySlice';
import { Photo } from '@/store/slices/gallerySlice';
import FullScreenImage from '@/components/FullScreenImage';
import { mediaLibrary } from '@/services/mediaLibrary';

type ViewMode = 'grid' | 'list' | 'details';

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const photos = useSelector((state: RootState) => state.gallery.photos);
  const loading = useSelector((state: RootState) => state.gallery.loading);
  const hasNextPage = useSelector((state: RootState) => state.gallery.hasNextPage);
  const selectedPhotos = useSelector((state: RootState) => state.gallery.selectedPhotos);
  const error = useSelector((state: RootState) => state.gallery.error);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert(
        'Error',
        'Failed to load photos. Please check your permissions and try again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Retry',
            onPress: () => handleRefresh()
          }
        ]
      );
    }
  }, [error]);

  const checkPermissions = async () => {
    try {
      console.log('Checking media library permissions...');
      // Force request on first app launch
      const granted = await mediaLibrary.requestPermissions(true);
      console.log('Permission status:', granted);
      setHasPermission(granted);
      
      if (granted) {
        console.log('Permissions granted, loading photos...');
        await dispatch(loadLocalPhotos()).unwrap();
      } else {
        Alert.alert(
          'Permission Required',
          'ThunderGallery needs access to your photos to display them in the app.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Settings',
              onPress: () => {
                Linking.openSettings().catch(() => {
                  Alert.alert('Unable to open settings', 'Please open settings manually to grant photo permissions.');
                });
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      setHasPermission(false);
      Alert.alert(
        'Permission Error',
        'Failed to request photo library permissions. Please check your settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Settings',
            onPress: () => {
              Linking.openSettings().catch(() => {
                Alert.alert('Unable to open settings', 'Please open settings manually to grant photo permissions.');
              });
            }
          }
        ]
      );
    }
  };

  const handleRefresh = async () => {
    if (!hasPermission) {
      await checkPermissions();
      return;
    }

    try {
      setRefreshing(true);
      await dispatch(resetGallery());
      await dispatch(loadLocalPhotos()).unwrap();
    } catch (error) {
      console.error('Error refreshing photos:', error);
      Alert.alert(
        'Error',
        'Failed to refresh photos. Please check your permissions and try again.',
        [
          { text: 'OK' },
          { 
            text: 'Retry',
            onPress: () => handleRefresh()
          }
        ]
      );
    } finally {
      setRefreshing(false);
    }
  };

  const loadPhotos = async () => {
    if (!hasPermission) {
      console.log('No permission to load photos');
      await checkPermissions();
      return;
    }
    
    try {
      console.log('Loading photos...');
      await dispatch(loadLocalPhotos()).unwrap();
    } catch (error) {
      console.error('Error loading photos:', error);
      Alert.alert(
        'Error',
        'Failed to load photos. Please check your permissions and try again.',
        [
          { text: 'OK' },
          { 
            text: 'Retry',
            onPress: () => loadPhotos()
          }
        ]
      );
    }
  };

  const handleLoadMore = async () => {
    if (hasNextPage && !loading) {
      await loadPhotos();
    }
  };

  const handlePhotoPress = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handlePhotoLongPress = (photo: Photo) => {
    dispatch(togglePhotoSelection(photo.id));
  };

  const handleDeleteSelected = async () => {
    try {
      await dispatch(deletePhotos(selectedPhotos)).unwrap();
      dispatch(clearSelection());
    } catch (error) {
      console.error('Failed to delete photos:', error);
    }
  };

  const handleCloseFullScreen = () => {
    setSelectedPhoto(null);
  };

  const handleRetryFullScreen = () => {
    if (selectedPhoto) {
      const updatedPhoto = {
        ...selectedPhoto,
        uri: `${selectedPhoto.uri}?timestamp=${Date.now()}`
      };
      setSelectedPhoto(updatedPhoto);
    }
  };

  const renderGridItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      style={[styles.gridItem, item.selected && styles.selectedItem]}
      onPress={() => handlePhotoPress(item)}
      onLongPress={() => handlePhotoLongPress(item)}
      delayLongPress={200}
    >
      <ImageWithLoader
        uri={item.uri}
        thumbnailUri={item.thumbnailUri}
        style={styles.gridImage}
        showRetry={true}
        onRetry={() => {
          // Force reload the image
          const updatedPhoto = { ...item, uri: `${item.uri}?timestamp=${Date.now()}` };
          handlePhotoPress(updatedPhoto);
        }}
      />
      {item.selected && (
        <View style={styles.selectionOverlay}>
          <IconSymbol name="checkmark-circle" size={24} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderListItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      style={[styles.listItem, item.selected && styles.selectedItem]}
      onPress={() => handlePhotoPress(item)}
      onLongPress={() => handlePhotoLongPress(item)}
      delayLongPress={200}
    >
      <ImageWithLoader
        uri={item.uri}
        thumbnailUri={item.thumbnailUri}
        style={styles.listImage}
      />
      <View style={styles.listInfo}>
        <ThemedText style={styles.listTitle}>Photo {item.id}</ThemedText>
        <ThemedText style={styles.listDate}>
          {new Date(parseInt(item.id)).toLocaleDateString()}
        </ThemedText>
      </View>
      {item.selected && (
        <View style={styles.selectionOverlay}>
          <IconSymbol name="checkmark-circle" size={24} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderDetailsItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      style={[styles.detailsItem, item.selected && styles.selectedItem]}
      onPress={() => handlePhotoPress(item)}
      onLongPress={() => handlePhotoLongPress(item)}
      delayLongPress={200}
    >
      <ImageWithLoader
        uri={item.uri}
        thumbnailUri={item.thumbnailUri}
        style={styles.detailsImage}
      />
      <View style={styles.detailsInfo}>
        <ThemedText style={styles.detailsTitle}>Photo {item.id}</ThemedText>
        <ThemedText style={styles.detailsDate}>
          {new Date(parseInt(item.id)).toLocaleDateString()}
        </ThemedText>
        <ThemedText style={styles.detailsMetadata}>
          ID: {item.id}
        </ThemedText>
      </View>
      {item.selected && (
        <View style={styles.selectionOverlay}>
          <IconSymbol name="checkmark-circle" size={24} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );

  if (hasPermission === false) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.messageText}>
          Please grant access to your photo library to use ThunderGallery
        </ThemedText>
        <TouchableOpacity
          style={styles.button}
          onPress={checkPermissions}
        >
          <ThemedText style={styles.buttonText}>
            Grant Permission
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (hasPermission === null) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

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
      <View style={styles.header}>
        <ThemedText style={styles.title}>Gallery</ThemedText>
        <View style={styles.viewOptions}>
          <TouchableOpacity
            style={[styles.viewOption, viewMode === 'grid' && styles.activeViewOption]}
            onPress={() => setViewMode('grid')}
          >
            <IconSymbol name="grid" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewOption, viewMode === 'list' && styles.activeViewOption]}
            onPress={() => setViewMode('list')}
          >
            <IconSymbol name="list" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewOption, viewMode === 'details' && styles.activeViewOption]}
            onPress={() => setViewMode('details')}
          >
            <IconSymbol name="information-circle" size={20} />
          </TouchableOpacity>
        </View>
        {selectedPhotos.length > 0 && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteSelected}
          >
            <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={photoArray}
        renderItem={
          viewMode === 'grid'
            ? renderGridItem
            : viewMode === 'list'
            ? renderListItem
            : renderDetailsItem
        }
        key={viewMode} // Force re-render when view mode changes
        numColumns={viewMode === 'grid' ? 3 : 1}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />

      <FullScreenImage
        photo={selectedPhoto}
        visible={selectedPhoto !== null}
        onClose={handleCloseFullScreen}
        onRetry={handleRetryFullScreen}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  viewOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewOption: {
    padding: 8,
    borderRadius: 8,
  },
  activeViewOption: {
    backgroundColor: '#0066ff20',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ff0000',
  },
  deleteButtonText: {
    color: '#fff',
  },
  gridItem: {
    flex: 1/3,
    aspectRatio: 1,
    padding: 1,
  },
  gridImage: {
    flex: 1,
    borderRadius: 4,
  },
  listItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  listImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  listInfo: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  listDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  detailsItem: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  detailsImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  detailsInfo: {
    marginTop: 12,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  detailsDate: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  detailsMetadata: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  selectedItem: {
    opacity: 0.8,
  },
  selectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 102, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
