module.exports = {
  name: 'ThunderGallery',
  slug: 'thundergallery',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.sougata143.thundergallery',
    usesAppleSignIn: true,
    infoPlist: {
      NSPhotoLibraryUsageDescription: 'Allow ThunderGallery to access your photos to display and manage them in the app.',
      NSPhotoLibraryAddUsageDescription: 'Allow ThunderGallery to save edited photos to your photo library.',
      NSCameraUsageDescription: 'Allow ThunderGallery to access your camera to take new photos.',
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.sougata143.thundergallery',
    permissions: [
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.ACCESS_MEDIA_LOCATION',
      'android.permission.CAMERA'
    ]
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    [
      'expo-media-library',
      {
        photosPermission: 'Allow ThunderGallery to access your photos.',
        savePhotosPermission: 'Allow ThunderGallery to save photos.',
        isAccessMediaLocationEnabled: true
      }
    ]
  ],
  extra: {
    eas: {
      projectId: 'your-project-id'
    }
  }
};
