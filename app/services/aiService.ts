import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import Constants from 'expo-constants';

// Get API keys and configuration from environment variables
const REPLICATE_API_KEY = Constants.expoConfig?.extra?.replicateApiKey || '';
const CLOUDINARY_CONFIG = Constants.expoConfig?.extra?.cloudinaryConfig || {};
const AI_MODELS = Constants.expoConfig?.extra?.aiModels || {};

// Constants for API endpoints
const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/upload`;

interface AIServiceResponse {
  success: boolean;
  url?: string;
  error?: string;
}

// Helper function to convert local URI to base64
async function uriToBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to convert to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Object Removal using Replicate's LaMa model
export async function removeObject(
  imageUri: string,
  maskUri: string
): Promise<AIServiceResponse> {
  try {
    const imageBase64 = await uriToBase64(imageUri);
    const maskBase64 = await uriToBase64(maskUri);

    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: AI_MODELS.objectRemoval,
        input: {
          image: `data:image/jpeg;base64,${imageBase64}`,
          mask: `data:image/jpeg;base64,${maskBase64}`,
        },
      }),
    });

    const prediction = await response.json();
    const result = await pollReplicateCompletion(prediction.id);
    
    if (result.output) {
      const downloadedFile = await FileSystem.downloadAsync(
        result.output,
        FileSystem.cacheDirectory + 'removed-object.jpg'
      );
      return { success: true, url: downloadedFile.uri };
    }
    
    throw new Error('Failed to get output URL');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Style Transfer using Replicate's SDXL model
export async function applyStyleTransfer(
  imageUri: string,
  style: string
): Promise<AIServiceResponse> {
  try {
    const imageBase64 = await uriToBase64(imageUri);

    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: AI_MODELS.styleTransfer,
        input: {
          image: `data:image/jpeg;base64,${imageBase64}`,
          prompt: `Apply ${style} style to this image`,
          negative_prompt: "bad quality, blurry, distorted",
          num_outputs: 1,
        },
      }),
    });

    const prediction = await response.json();
    const result = await pollReplicateCompletion(prediction.id);
    
    if (result.output && result.output[0]) {
      const downloadedFile = await FileSystem.downloadAsync(
        result.output[0],
        FileSystem.cacheDirectory + 'style-transfer.jpg'
      );
      return { success: true, url: downloadedFile.uri };
    }
    
    throw new Error('Failed to get output URL');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Face Detection using Cloudinary's AI capabilities
export async function detectFaces(imageUri: string): Promise<AIServiceResponse> {
  try {
    const base64Image = await uriToBase64(imageUri);
    const cloudinaryUrl = await uploadToCloudinary(base64Image);

    // Add face detection parameters to the URL
    const detectionUrl = cloudinaryUrl.replace('/upload/', '/upload/c_crop,g_face/');

    const downloadedFile = await FileSystem.downloadAsync(
      detectionUrl,
      FileSystem.cacheDirectory + 'face-detection.jpg'
    );

    return { success: true, url: downloadedFile.uri };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Background Replacement using Replicate's rembg model
export async function replaceBackground(
  imageUri: string,
  backgroundColor: string
): Promise<AIServiceResponse> {
  try {
    const imageBase64 = await uriToBase64(imageUri);

    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: AI_MODELS.backgroundRemoval,
        input: {
          image: `data:image/jpeg;base64,${imageBase64}`,
        },
      }),
    });

    const prediction = await response.json();
    const result = await pollReplicateCompletion(prediction.id);
    
    if (result.output) {
      // Add background color to the transparent image using Cloudinary
      const uploadedUrl = await uploadToCloudinary(await uriToBase64(result.output));
      const backgroundUrl = uploadedUrl.replace('/upload/', `/upload/b_${backgroundColor.replace('#', '')}/`);
      
      const downloadedFile = await FileSystem.downloadAsync(
        backgroundUrl,
        FileSystem.cacheDirectory + 'background-replaced.jpg'
      );
      
      return { success: true, url: downloadedFile.uri };
    }
    
    throw new Error('Failed to get output URL');
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Auto Enhancement using Cloudinary's AI capabilities
export async function autoEnhance(imageUri: string): Promise<AIServiceResponse> {
  try {
    const base64Image = await uriToBase64(imageUri);
    const cloudinaryUrl = await uploadToCloudinary(base64Image);

    // Add auto-enhancement parameters
    const enhancedUrl = cloudinaryUrl.replace('/upload/', '/upload/e_auto_enhance,e_auto_brightness,e_auto_contrast,e_auto_saturation/');

    const downloadedFile = await FileSystem.downloadAsync(
      enhancedUrl,
      FileSystem.cacheDirectory + 'enhanced.jpg'
    );

    return { success: true, url: downloadedFile.uri };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Helper function to upload image to Cloudinary
async function uploadToCloudinary(base64Image: string): Promise<string> {
  const uploadPreset = 'ml_default';
  
  const formData = new FormData();
  formData.append('file', `data:image/jpeg;base64,${base64Image}`);
  formData.append('upload_preset', uploadPreset);
  formData.append('api_key', CLOUDINARY_CONFIG.apiKey);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data.secure_url;
}

// Helper function to poll Replicate API for completion
async function pollReplicateCompletion(predictionId: string, maxAttempts = 30): Promise<any> {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const response = await fetch(`${REPLICATE_API_URL}/${predictionId}`, {
      headers: {
        'Authorization': `Token ${REPLICATE_API_KEY}`,
      },
    });
    
    const prediction = await response.json();
    
    if (prediction.status === 'succeeded') {
      return prediction;
    } else if (prediction.status === 'failed') {
      throw new Error('Prediction failed');
    }
    
    attempts += 1;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error('Prediction timed out');
}
