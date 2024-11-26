const constants = {
  APP_NAME: 'ThunderGallery',
  VERSION: '1.0.0',
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/heic'],
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  THUMBNAIL_SIZE: {
    width: 200,
    height: 200
  },
  CACHE_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
  API_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  ERROR_CODES: {
    NETWORK_ERROR: 'E_NETWORK',
    AUTH_ERROR: 'E_AUTH',
    STORAGE_ERROR: 'E_STORAGE',
    VALIDATION_ERROR: 'E_VALIDATION'
  }
} as const;

export default constants;
