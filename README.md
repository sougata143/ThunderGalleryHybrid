# ThunderGallery

A powerful mobile photo gallery app built with React Native and Expo, featuring AI-powered photo editing capabilities.

## Features

- **Modern Photo Gallery**
  - Grid, list, and details view modes
  - Smooth image loading with thumbnails
  - Full-screen image viewing
  - Multi-select and batch delete

- **AI-Powered Photo Editing**
  - Object Removal (using Replicate's LaMa)
  - Style Transfer (using Replicate's SDXL)
  - Face Detection (using Cloudinary AI)
  - Background Replacement (using Replicate's rembg)
  - Auto Enhancement (using Cloudinary)

- **Image Adjustments**
  - Brightness
  - Contrast
  - Saturation
  - More coming soon...

- **Advanced Features**
  - Robust permission handling
  - Efficient image caching
  - Error handling and retry mechanisms
  - Smooth animations and transitions

## Tech Stack

- React Native / Expo
- TypeScript
- Redux Toolkit for state management
- React Native Reanimated for animations
- Expo MediaLibrary for photo access
- Replicate AI and Cloudinary for AI features

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file with:
   ```
   REPLICATE_API_KEY=your_replicate_api_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. Run the development server:
   ```bash
   npx expo start
   ```

## Project Structure

```
app/
├── (tabs)/              # Tab navigation screens
├── components/          # Reusable components
│   ├── editor/         # Photo editing components
│   └── ui/             # UI components
├── services/           # API and service integrations
├── store/              # Redux store and slices
└── utils/              # Utility functions
```

## Recent Updates

- Fixed image loading issues in full-screen view
- Improved error handling and retry mechanisms
- Added robust permission management
- Enhanced image loading performance
- Implemented AI-powered editing features

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
