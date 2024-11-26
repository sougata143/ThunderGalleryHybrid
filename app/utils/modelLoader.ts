import * as tf from '@tensorflow/tfjs';
import logger from './logger';
import constants from '@/config/constants';

const modelLoader = {
  loadModel: async (modelUrl: string): Promise<tf.GraphModel | null> => {
    try {
      logger.info('Loading model', { modelUrl });
      const model = await tf.loadGraphModel(modelUrl);
      logger.info('Model loaded successfully', { modelUrl });
      return model;
    } catch (error) {
      logger.error('Failed to load model', {
        error: error instanceof Error ? error.message : String(error),
        modelUrl
      });
      return null;
    }
  },

  preprocessImage: async (imageData: Uint8Array): Promise<tf.Tensor | null> => {
    try {
      // Convert image data to tensor
      const tensor = tf.node.decodeImage(imageData);
      
      // Normalize pixel values
      const normalized = tf.div(tensor, 255.0);
      
      // Add batch dimension
      const batched = normalized.expandDims(0);
      
      return batched;
    } catch (error) {
      logger.error('Failed to preprocess image', {
        error: error instanceof Error ? error.message : String(error)
      });
      return null;
    }
  },

  postprocessImage: async (tensor: tf.Tensor): Promise<Uint8Array | null> => {
    try {
      // Remove batch dimension
      const squeezed = tensor.squeeze();
      
      // Denormalize pixel values
      const denormalized = tf.mul(squeezed, 255.0);
      
      // Convert to uint8 array
      const uint8Array = new Uint8Array(await denormalized.data());
      
      return uint8Array;
    } catch (error) {
      logger.error('Failed to postprocess image', {
        error: error instanceof Error ? error.message : String(error)
      });
      return null;
    }
  }
};

export default modelLoader;
