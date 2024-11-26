import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import  logger  from '../../utils/logger';

export interface AIProcessingTask {
  id: string;
  taskId?: string;
  type: 'object-removal' | 'face-detection' | 'style-transfer';
  photoId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
}

interface AIState {
  tasks: { [key: string]: AIProcessingTask };
  isProcessing: boolean;
  error: string | null;
  modelStatus: {
    objectDetection: boolean;
    faceDetection: boolean;
    styleTransfer: boolean;
  };
}

const initialState: AIState = {
  tasks: {},
  isProcessing: false,
  error: null,
  modelStatus: {
    objectDetection: false,
    faceDetection: false,
    styleTransfer: false,
  },
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<AIProcessingTask>) => {
      logger.debug('Adding new AI task', {
        tag: 'AI',
        data: {
          taskId: action.payload.id,
          type: action.payload.type,
          photoId: action.payload.photoId
        }
      });
      state.tasks[action.payload.id] = action.payload;
    },
    updateTaskStatus: (state, action: PayloadAction<{
      taskId: string;
      status: AIProcessingTask['status'];
      progress: number;
      result?: any;
      error?: string;
    }>) => {
      const { taskId, status, progress, result, error } = action.payload;
      if (state.tasks[taskId]) {
        logger.debug('Updating AI task status', {
          tag: 'AI',
          data: {
            taskId,
            status,
            progress,
            result: result ? 'present' : 'none',
            error
          }
        });
        
        state.tasks[taskId] = {
          ...state.tasks[taskId],
          status,
          progress,
          ...(result && { result }),
          ...(error && { error }),
        };
        
        if (error) {
          logger.error('AI task failed', {
            tag: 'AI',
            data: { taskId, error }
          });
        } else if (status === 'completed') {
          logger.info('AI task completed successfully', {
            tag: 'AI',
            data: { taskId, type: state.tasks[taskId].type }
          });
        }
      } else {
        logger.warn('Attempted to update non-existent AI task', {
          tag: 'AI',
          data: { taskId }
        });
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      delete state.tasks[action.payload];
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateModelStatus: (state, action: PayloadAction<{
      model: keyof AIState['modelStatus'];
      status: boolean;
    }>) => {
      const { model, status } = action.payload;
      logger.info('Updating AI model status', {
        tag: 'AI',
        data: { model, status }
      });
      
      state.modelStatus[model] = status;
    },
  },
});

export const {
  addTask,
  updateTaskStatus,
  removeTask,
  setProcessing,
  setError,
  updateModelStatus,
} = aiSlice.actions;

export default aiSlice.reducer;
