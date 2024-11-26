import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Image,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import IconSymbol from '@/components/ui/IconSymbol';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { RootState, AppDispatch } from '@/store';
import { loadLocalPhotos, resetGallery, deletePhotos, clearSelection, togglePhotoSelection } from '@/store/slices/gallerySlice';
import { Photo } from '@/store/slices/gallerySlice';
import PhotoEditor from '@/components/PhotoEditor';

type ViewMode = 'grid' | 'list' | 'details';

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const photos = useSelector((state: RootState) => state.gallery.photos);
  const loading = useSelector((state: RootState) => state.gallery.loading);
  const hasNextPage = useSelector((state: RootState) => state.gallery.hasNextPage);
  const selectedPhotos = useSelector((state: RootState) => state.gallery.selectedPhotos);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      await dispatch(loadLocalPhotos()).unwrap();
    } catch (error) {
      console.error('Failed to load photos:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(resetGallery());
    await loadPhotos();
    setRefreshing(false);
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

  const renderGridItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      style={[styles.gridItem, item.selected && styles.selectedItem]}
      onPress={() => handlePhotoPress(item)}
      onLongPress={() => handlePhotoLongPress(item)}
      delayLongPress={200}
    >
      <Image source={{ uri: item.uri }} style={styles.gridImage} />
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
      <Image source={{ uri: item.uri }} style={styles.listImage} />
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
      <Image source={{ uri: item.uri }} style={styles.detailsImage} />
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

      <Modal
        visible={selectedPhoto !== null}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {selectedPhoto && (
          <PhotoEditor
            photo={selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
          />
        )}
      </Modal>
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
