import React from 'react';
import { StyleSheet, View } from 'react-native';
import ThemedText from './ThemedText';
import Animated, { useAnimatedStyle, withRepeat, withSpring } from 'react-native-reanimated';

export function HelloWave() {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: withRepeat(
          withSpring('10deg', {
            damping: 2,
            stiffness: 80,
          }),
          -1,
          true
        ),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.wave, animatedStyle]}>
        <ThemedText style={styles.text}>👋</ThemedText>
      </Animated.View>
      <ThemedText style={styles.welcome}>Welcome to ThunderGallery!</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wave: {
    marginBottom: 20,
  },
  text: {
    fontSize: 40,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HelloWave;
