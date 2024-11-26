import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import ImageWithLoader from './ui/ImageWithLoader';
import IconSymbol from './ui/IconSymbol';
import EditorHome from './editor/EditorHome';
import { Photo } from '@/store/slices/gallerySlice';

interface FullScreenImageProps {
  photo: Photo | null;
  visible: boolean;
  onClose: () => void;
  onRetry?: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FullScreenImage: React.FC<FullScreenImageProps> = ({
  photo,
  visible,
  onClose,
  onRetry,
}) => {
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);

  const handleRetry = useCallback(() => {
    setLoadError(false);
    setIsLoading(true);
    onRetry?.();
  }, [onRetry]);

  const handleEditPress = useCallback(() => {
    setShowEditor(true);
  }, []);

  const handleEditorClose = useCallback(() => {
    setShowEditor(false);
  }, []);

  if (!photo) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <StatusBar hidden />
        <SafeAreaView style={styles.safeArea}>
          <BlurView intensity={100} style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol name="create" size={24} color="#fff" />
            </TouchableOpacity>
          </BlurView>
        </SafeAreaView>

        <View style={styles.imageContainer}>
          <ImageWithLoader
            uri={photo.uri}
            thumbnailUri={photo.thumbnailUri}
            style={styles.image}
            resizeMode="contain"
            showRetry={loadError}
            onRetry={handleRetry}
            resizeMethod="scale"
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => setLoadError(true)}
            {...Platform.select({
              ios: {
                loading: isLoading,
              },
              android: {
                progressiveRenderingEnabled: true,
              },
            })}
          />
        </View>

        {showEditor && (
          <View style={styles.editorContainer}>
            <EditorHome
              photo={photo}
              onClose={handleEditorClose}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 8,
  },
  editButton: {
    padding: 8,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  editorContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
});

export default FullScreenImage;
