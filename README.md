# ThunderGallery 📸

ThunderGallery is a powerful, AI-enhanced photo gallery application built with React Native and Expo. It offers advanced features like object removal, face detection, and style transfer, all powered by on-device machine learning.

## ✨ Features

- 🖼️ **Smart Photo Management**
  - Organize photos into albums
  - Advanced search capabilities
  - Secure cloud storage with Firebase

- 🤖 **AI-Powered Features**
  - Object removal from photos
  - Face detection and recognition
  - Artistic style transfer
  - On-device ML processing for privacy

- 🎨 **Modern UI/UX**
  - Dark/Light theme support
  - Smooth animations
  - Intuitive gesture controls
  - Responsive design

## 🛠️ Technology Stack

- **Frontend Framework**
  - React Native
  - Expo (SDK 52)
  - TypeScript
  - Redux Toolkit for state management

- **AI/ML**
  - TensorFlow.js
  - AWS Rekognition
  - Custom ML models

- **Backend & Storage**
  - Firebase Authentication
  - Firebase Cloud Storage
  - AsyncStorage for local data

- **Development Tools**
  - Expo Router for navigation
  - ESLint & Prettier
  - Jest for testing

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sougata143/ThunderGalleryHybrid.git
   cd ThunderGallery
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase and AWS credentials

4. Download ML models:
   ```bash
   ./scripts/download_models.sh
   ```

5. Start the development server:
   ```bash
   npx expo start
   ```

## 📱 Usage Guide

### Basic Navigation
- Browse photos in the Gallery tab
- Organize photos in the Albums tab
- Access AI features in the AI tab
- Configure settings in the Settings tab

### AI Features
1. **Object Removal**
   - Select a photo
   - Tap "Remove Object"
   - Draw around the object
   - Confirm removal

2. **Style Transfer**
   - Choose a photo
   - Select an artistic style
   - Apply and save

3. **Face Detection**
   - Open any photo
   - Tap "Detect Faces"
   - View detected faces

## 🏗️ Building for Production

### iOS
1. Install development certificates:
   ```bash
   npx expo prebuild --platform ios
   ```

2. Build for iOS:
   ```bash
   eas build --platform ios
   ```

### Android
1. Configure Android credentials:
   ```bash
   npx expo prebuild --platform android
   ```

2. Build for Android:
   ```bash
   eas build --platform android
   ```

### Web
1. Build for web:
   ```bash
   npx expo export:web
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Sougata Roy - *Initial work* - [sougata143](https://github.com/sougata143)

## 🙏 Acknowledgments

- TensorFlow.js team for the ML models
- Expo team for the amazing framework
- Firebase team for the backend services
