const path = require('path');
require('dotenv').config();

module.exports = {
  expo: {
    name: 'ThunderGallery',
    slug: 'thunder-gallery',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.thundergallery.app',
      infoPlist: {
        NSPhotoLibraryUsageDescription:
          'Allow ThunderGallery to access your photos to display and edit them.',
        NSPhotoLibraryAddUsageDescription:
          'Allow ThunderGallery to save edited photos to your photo library.',
        NSCameraUsageDescription: 'Allow ThunderGallery to access your camera to take new photos.',
      },
      usesAppleSignIn: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#000000',
      },
      package: 'com.thundergallery.app',
      permissions: [
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.ACCESS_MEDIA_LOCATION',
        'android.permission.CAMERA',
        'android.permission.INTERNET',
      ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-apple-authentication',
      'expo-image-picker',
      'expo-media-library'
    ],
    extra: {
      // AI Service Configuration
      replicateApiKey: process.env.REPLICATE_API_KEY,
      cloudinaryConfig: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
      },
      // AI Model Configuration
      aiModels: {
        objectRemoval: 'replicate/lama:aff48af9c68d40a2906ee82549c92e0609607bf6515c4c9275848f09b6674bb5',
        styleTransfer: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
        backgroundRemoval: 'cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003'
      },
      eas: {
        projectId: 'your-project-id',
      },
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    runtimeVersion: {
      policy: 'sdkVersion'
    },
  },
};
