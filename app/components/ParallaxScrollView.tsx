import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Animated,
  Platform,
  ViewStyle,
  StyleProp,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ParallaxScrollViewProps {
  headerHeight?: number;
  children: React.ReactNode;
  renderHeader?: () => React.ReactNode;
  renderHeaderTitle?: () => React.ReactNode;
  headerImage?: React.ReactNode;
  headerBackgroundColor?: {
    light: string;
    dark: string;
  };
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export default function ParallaxScrollView({
  headerHeight = 300,
  children,
  renderHeader,
  renderHeaderTitle,
  headerImage,
  headerBackgroundColor,
  style,
  contentContainerStyle,
  onScroll: onScrollProp,
}: ParallaxScrollViewProps) {
  const colorScheme = useColorScheme();
  const scrollY = new Animated.Value(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: onScrollProp,
    }
  );

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight / 2],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [headerHeight - 100, headerHeight],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const titleTranslate = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, 60],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            backgroundColor: headerBackgroundColor?.[colorScheme],
            transform: [{ translateY: headerTranslate }],
          },
        ]}
      >
        {headerImage}
        {renderHeader?.()}
      </Animated.View>

      {renderHeaderTitle && (
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: headerOpacity,
              transform: [{ translateY: titleTranslate }],
            },
          ]}
        >
          <BlurView
            tint={colorScheme}
            intensity={80}
            style={StyleSheet.absoluteFill}
          />
          {renderHeaderTitle()}
        </Animated.View>
      )}

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingTop: headerHeight },
          contentContainerStyle,
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    zIndex: 2,
  },
});
