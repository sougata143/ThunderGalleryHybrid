export interface EditingTool {
  id: string;
  label: string;
  icon: string;
}

export type Filter =
  | 'sepia'
  | 'black_and_white'
  | 'vintage'
  | 'chrome'
  | 'fade'
  | 'instant'
  | 'mono'
  | 'noir'
  | 'process'
  | 'tonal'
  | 'transfer'
  | 'vivid';

export interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
}

export interface CropConfig {
  width: number;
  height: number;
  x: number;
  y: number;
  rotation: number;
}

export interface AIFeature {
  id: string;
  label: string;
  icon: string;
  modelId: string;
  description: string;
}

export const AI_FEATURES: AIFeature[] = [
  {
    id: 'object-removal',
    label: 'Remove Object',
    icon: 'magnet',
    modelId: 'replicate/lama',
    description: 'Remove unwanted objects from your photos'
  },
  {
    id: 'style-transfer',
    label: 'Style Transfer',
    icon: 'brush',
    modelId: 'replicate/sdxl',
    description: 'Transform your photos into different artistic styles'
  },
  {
    id: 'face-detection',
    label: 'Face Detection',
    icon: 'happy',
    modelId: 'cloudinary/face-detection',
    description: 'Detect and analyze faces in your photos'
  },
  {
    id: 'background-removal',
    label: 'Remove Background',
    icon: 'layers',
    modelId: 'replicate/rembg',
    description: 'Remove and replace photo backgrounds'
  },
  {
    id: 'auto-enhance',
    label: 'Auto Enhance',
    icon: 'sparkles',
    modelId: 'cloudinary/auto-enhance',
    description: 'Automatically enhance photo quality'
  }
];
