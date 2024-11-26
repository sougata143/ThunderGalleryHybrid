# ThunderGallery 

A personal photo gallery app built with React Native and Expo.

## Features

- Google Sign-In
- Apple Sign-In (iOS only)
- Guest Mode
- Photo Management
- AI-powered Photo Analysis

## Setup Instructions

### Prerequisites

- Node.js
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

Start the development server:
```bash
npm start
```

### Running on iOS
```bash
npm run ios
```

### Running on Android
```bash
npm run android
```

## Authentication Flow

The app supports three authentication methods:

1. **Google Sign-In**: Uses `expo-auth-session` for OAuth 2.0 authentication
2. **Apple Sign-In**: Available only on iOS devices using `expo-apple-authentication`
3. **Guest Mode**: Allows users to use the app without authentication

User sessions are persisted using `@react-native-async-storage/async-storage`.

## Project Structure

- `/app`: Main application code
  - `/components`: Reusable React components
  - `/services`: Service layer (auth, storage, etc.)
  - `/utils`: Utility functions
  - `/(tabs)`: Tab-based navigation screens
- `/assets`: Static assets (images, fonts)
- `/android`: Android-specific configuration
- `/ios`: iOS-specific configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
