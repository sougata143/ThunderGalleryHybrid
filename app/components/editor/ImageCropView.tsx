import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  Image,
} from 'react-native';
import { Crop } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ImageCropViewProps {
  uri: string;
  onCropComplete?: (crop: Crop) => void;
  rotation?: number;
  crop?: Crop;
}

export interface ImageCropViewRef {
  getCrop: () => Crop;
}

const ImageCropView = forwardRef<ImageCropViewRef, ImageCropViewProps>(
  ({ uri, onCropComplete, rotation = 0, crop = { x: 0, y: 0, width: 1, height: 1 } }, ref) => {
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [cropArea, setCropArea] = useState(crop);
    const [isDragging, setIsDragging] = useState(false);

    // Get image dimensions when loaded
    const onImageLoad = () => {
      Image.getSize(uri, (width, height) => {
        const aspectRatio = width / height;
        const screenAspectRatio = SCREEN_WIDTH / (SCREEN_WIDTH / aspectRatio);
        
        setImageSize({
          width: SCREEN_WIDTH,
          height: SCREEN_WIDTH / aspectRatio,
        });
      });
    };

    // Pan responder for crop handles
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
      },
      onPanResponderMove: (_, gestureState) => {
        const { dx, dy } = gestureState;
        
        // Calculate new crop area based on gesture
        const newCrop = {
          ...cropArea,
          x: Math.max(0, Math.min(1, cropArea.x + dx / imageSize.width)),
          y: Math.max(0, Math.min(1, cropArea.y + dy / imageSize.height)),
        };
        
        setCropArea(newCrop);
        onCropComplete?.(newCrop);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
      },
    });

    // Expose crop data to parent
    useImperativeHandle(ref, () => ({
      getCrop: () => cropArea,
    }));

    return (
      <View style={styles.container}>
        <View style={[styles.imageContainer, { transform: [{ rotate: `${rotation}deg` }] }]}>
          <Image
            source={{ uri }}
            style={[
              styles.image,
              {
                width: imageSize.width,
                height: imageSize.height,
              },
            ]}
            onLoad={onImageLoad}
            resizeMode="contain"
          />
          
          <View
            style={[
              styles.cropOverlay,
              {
                left: cropArea.x * imageSize.width,
                top: cropArea.y * imageSize.height,
                width: cropArea.width * imageSize.width,
                height: cropArea.height * imageSize.height,
              },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={[styles.cropHandle, styles.topLeftHandle]} />
            <View style={[styles.cropHandle, styles.topRightHandle]} />
            <View style={[styles.cropHandle, styles.bottomLeftHandle]} />
            <View style={[styles.cropHandle, styles.bottomRightHandle]} />
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    overflow: 'hidden',
  },
  image: {
    backgroundColor: '#000',
  },
  cropOverlay: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cropHandle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  topLeftHandle: {
    top: -10,
    left: -10,
  },
  topRightHandle: {
    top: -10,
    right: -10,
  },
  bottomLeftHandle: {
    bottom: -10,
    left: -10,
  },
  bottomRightHandle: {
    bottom: -10,
    right: -10,
  },
});

export default ImageCropView;
