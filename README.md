# ThunderGallery 

A powerful mobile photo gallery app with AI-powered editing capabilities, built with React Native and Expo.

## Features

### Authentication
- Google Sign-In (Android & Web)
- Apple Sign-In (iOS)
- Secure token management
- Guest Mode

### Gallery Management
- Multiple view modes (Grid, List, Details)
- Pull-to-refresh functionality
- Smooth transitions and animations
- Advanced photo organization
- Cloud storage integration

### Photo Editing
- Basic editing tools:
  - Crop
  - Rotate
  - Filters
  - Adjustments
- AI-powered features:
  - Object removal
  - Face detection
  - Style transfer
  - Auto-enhance
  - Background replacement
  - Smart filters

### User Experience
- Modern, intuitive interface
- Dark/Light theme support
- Responsive design
- Haptic feedback
- Gesture controls

## Recent Updates

### Media Library Improvements (Latest)
- Enhanced permission handling system
  - Robust permission state management
  - Permission caching with AsyncStorage
  - Automatic permission retries
  - User-friendly permission prompts
- Improved error handling
  - Detailed error messages
  - Automatic retry mechanisms
  - Better user feedback
- Performance optimizations
  - Permission state caching
  - Reduced permission checks
  - Optimized photo loading

### Known Issues
- Media library permissions may require app restart on first grant
- Photo loading may take a moment after permission grant
- Some Android devices may require manual permission grant

### Troubleshooting

If you encounter permission issues:
1. Go to your device settings
2. Find ThunderGallery in the apps list
3. Grant media library permissions manually
4. Restart the app

If photos don't load:
1. Pull down to refresh the gallery
2. Check your permissions in settings
3. Try closing and reopening the app

## Tech Stack

- React Native / Expo
- TypeScript
- Redux Toolkit (State Management)
- Firebase (Authentication & Storage)
- TensorFlow.js (AI Features)
- Expo Router (Navigation)
- React Native Reanimated (Animations)

## Setup Instructions

### Prerequisites

- Node.js (v16 or later)
- Expo CLI
- Java Development Kit (JDK) for Android development
- Xcode for iOS development

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ThunderGallery.git
cd ThunderGallery
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```plaintext
# Google Sign-In Configuration
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com

# AI Service Keys
EXPO_PUBLIC_TENSORFLOW_MODEL_URL=your-model-url
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google Sign-In API
4. Configure the OAuth consent screen:
   - User Type: External
   - App Name: ThunderGallery
   - Developer contact information: Your email
   - Authorized domains: Add `expo.dev`

5. Create OAuth 2.0 Client IDs:

#### For Android
1. Application type: Android
2. Package name: `com.sougata143.thundergallery`
3. Generate SHA-1 certificate fingerprint:
```bash
# Create android/app directory if it doesn't exist
mkdir -p android/app

# Generate debug keystore
keytool -genkeypair -v -storetype PKCS12 \
  -keystore android/app/debug.keystore \
  -storepass android -alias androiddebugkey \
  -keypass android -keyalg RSA -keysize 2048 \
  -validity 10000 -dname "CN=Android Debug,O=Android,C=US"

# Get SHA-1 fingerprint
keytool -list -v -keystore android/app/debug.keystore \
  -alias androiddebugkey -storepass android -keypass android
```
4. Add the SHA-1 fingerprint to the Android OAuth client in Google Cloud Console

#### For iOS
1. Application type: iOS
2. Bundle ID: `com.sougata143.thundergallery`

#### For Web
1. Application type: Web application
2. Name: ThunderGallery Web
3. Authorized JavaScript origins:
   - https://auth.expo.io
   - https://localhost
4. Authorized redirect URIs:
   - https://auth.expo.io/@your-expo-username/thundergallery
   - https://localhost

### Apple Sign-In Setup (iOS only)

1. Configure your Apple Developer account for Sign in with Apple
2. The app.json already includes the necessary configuration:
```json
{
  "ios": {
    "usesAppleSignIn": true
  }
}
```

## Development

### Running the App

1. Start the development server:
```bash
npx expo start
```

2. Run on specific platforms:
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android

# Web
npx expo start --web
```

### Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
