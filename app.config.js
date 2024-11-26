module.exports = {
  name: 'Thunder Gallery',
  slug: 'thunder-gallery',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.thundergallery.app',
    infoPlist: {
      NSPhotoLibraryUsageDescription: 'Allow Thunder Gallery to access your photos.',
      NSPhotoLibraryAddUsageDescription: 'Allow Thunder Gallery to save photos to your photo library.',
      NSCameraUsageDescription: 'Allow Thunder Gallery to access your camera.',
      NSLocationWhenInUseUsageDescription: 'Allow Thunder Gallery to access your location.',
      UIBackgroundModes: ['fetch', 'remote-notification'],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.thundergallery.app',
    permissions: [
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'ACCESS_MEDIA_LOCATION',
      'ACCESS_FINE_LOCATION',
    ],
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    [
      'expo-image-picker',
      {
        photosPermission: 'Allow Thunder Gallery to access your photos.',
        cameraPermission: 'Allow Thunder Gallery to access your camera.',
      },
    ],
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Allow Thunder Gallery to use your location.',
      },
    ],
    'expo-router',
  ],
  scheme: 'thunder-gallery',
  experiments: {
    tsconfigPaths: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: 'your-project-id', // Replace with your EAS project ID
    },
  },
};
