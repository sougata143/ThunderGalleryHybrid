import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Image,
  View,
  ActivityIndicator,
  ImageProps,
  ImageStyle,
  StyleProp,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import ThemedText from '../ThemedText';
import IconSymbol from './IconSymbol';

interface ImageWithLoaderProps extends Omit<ImageProps, 'source'> {
  uri: string;
  style?: StyleProp<ImageStyle>;
  thumbnailUri?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
  uri,
  style,
  thumbnailUri,
  showRetry = false,
  onRetry,
  onLoadStart: externalLoadStart,
  onLoad: externalLoad,
  onLoadEnd: externalLoadEnd,
  onError: externalError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1.05);

  useEffect(() => {
    // Reset state when URI changes
    setIsLoading(true);
    setError(false);
    opacity.value = 0;
    scale.value = 1.05;
  }, [uri]);

  const handleLoadStart = () => {
    setIsLoading(true);
    setError(false);
    opacity.value = 0;
    scale.value = 1.05;
    externalLoadStart?.();
  };

  const handleLoadSuccess = () => {
    setIsLoading(false);
    setError(false);
    opacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withDelay(100, withTiming(1, { duration: 200 }))
    );
    scale.value = withTiming(1, { duration: 300 });
    externalLoad?.();
    externalLoadEnd?.();
  };

  const handleLoadError = () => {
    setIsLoading(false);
    setError(true);
    externalError?.();
    externalLoadEnd?.();
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(false);
    opacity.value = 0;
    scale.value = 1.05;
    onRetry?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.container, style]}>
      {thumbnailUri && (
        <Image
          source={{ uri: thumbnailUri }}
          style={[StyleSheet.absoluteFill, styles.thumbnail]}
          blurRadius={Platform.OS === 'ios' ? 10 : 5}
        />
      )}
      
      <Animated.Image
        source={{ uri }}
        style={[StyleSheet.absoluteFill, animatedStyle]}
        onLoadStart={handleLoadStart}
        onLoad={handleLoadSuccess}
        onError={handleLoadError}
        {...props}
      />

      {isLoading && (
        <BlurView intensity={50} style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </BlurView>
      )}

      {error && (
        <BlurView intensity={50} style={styles.errorContainer}>
          <IconSymbol name="alert-circle" size={32} color="#ff4444" />
          <ThemedText style={styles.errorText}>Failed to load image</ThemedText>
          {showRetry && (
            <IconSymbol
              name="refresh"
              size={24}
              color="#ffffff"
              style={styles.retryIcon}
              onPress={handleRetry}
            />
          )}
        </BlurView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  thumbnail: {
    opacity: 0.3,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 8,
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
  retryIcon: {
    marginTop: 12,
    padding: 8,
  },
});

export default ImageWithLoader;
