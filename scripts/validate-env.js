const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const requiredVariables = {
  // Google Sign-In
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: 'Google Web Client ID',
  EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: 'Google Android Client ID',
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: 'Google iOS Client ID',
  
  // AI Services
  REPLICATE_API_KEY: 'Replicate API Key',
  CLOUDINARY_CLOUD_NAME: 'Cloudinary Cloud Name',
  CLOUDINARY_API_KEY: 'Cloudinary API Key',
  CLOUDINARY_API_SECRET: 'Cloudinary API Secret',
};

const missingVariables = [];
const emptyVariables = [];

// Check for missing or empty variables
Object.entries(requiredVariables).forEach(([key, name]) => {
  if (!(key in process.env)) {
    missingVariables.push(name);
  } else if (!process.env[key]) {
    emptyVariables.push(name);
  }
});

// Print results
if (missingVariables.length > 0) {
  console.error('\n❌ Missing environment variables:');
  missingVariables.forEach(name => {
    console.error(`   - ${name}`);
  });
}

if (emptyVariables.length > 0) {
  console.warn('\n⚠️  Empty environment variables:');
  emptyVariables.forEach(name => {
    console.warn(`   - ${name}`);
  });
}

if (missingVariables.length === 0 && emptyVariables.length === 0) {
  console.log('\n✅ All environment variables are properly configured!\n');
} else {
  console.log('\n📝 Please update your .env file with the missing values.\n');
  process.exit(1);
}
