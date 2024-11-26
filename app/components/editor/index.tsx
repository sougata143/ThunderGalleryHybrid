import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as ImageManipulator from 'expo-image-manipulator';
import { Photo } from '@/store/slices/gallerySlice';
import ThemedText from '../ThemedText';
import IconSymbol from '../ui/IconSymbol';
import ImageCropView from './ImageCropView';
import FilterView from './FilterView';
import AdjustmentsView from './AdjustmentsView';
import AIToolsView from './AIToolsView';
import { EditingTool, Filter } from './types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PhotoEditorProps {
  photo: Photo;
  visible: boolean;
  onClose: () => void;
  onSave: (editedUri: string) => void;
}

interface PhotoEditorState {
  editMode: 'crop' | 'filter' | 'adjustments' | 'ai' | null;
  cropConfig: { width: number; height: number; x: number; y: number; rotation: number };
  filter: Filter | null;
  adjustments: { brightness: number; contrast: number; saturation: number };
  processedUri: string | null;
  currentTool: EditingTool | null;
  editedUri: string;
  rotation: number;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({
  photo,
  visible,
  onClose,
  onSave,
}) => {
  const [state, setState] = useState<PhotoEditorState>({
    editMode: null,
    cropConfig: { width: 0, height: 0, x: 0, y: 0, rotation: 0 },
    filter: null,
    adjustments: { brightness: 0, contrast: 0, saturation: 0 },
    processedUri: null,
    currentTool: null,
    editedUri: photo.uri,
    rotation: 0,
  });

  const imageRef = useRef(null);

  const tools: { id: EditingTool; icon: string; label: string }[] = [
    { id: 'crop', icon: 'crop', label: 'Crop' },
    { id: 'rotate', icon: 'rotate-right', label: 'Rotate' },
    { id: 'filters', icon: 'color-filter', label: 'Filters' },
    { id: 'adjust', icon: 'options', label: 'Adjust' },
    { id: 'ai', icon: 'flash', label: 'AI Tools' },
  ];

  const handleToolSelect = (mode: PhotoEditorState['editMode']) => {
    setState(prev => ({ ...prev, editMode: mode }));
  };

  const handleFilterSelect = async (filter: Filter) => {
    setState(prev => ({ ...prev, filter }));
  };

  const handleAdjustmentsChange = (adjustments: { brightness: number; contrast: number; saturation: number }) => {
    setState(prev => ({ ...prev, adjustments }));
  };

  const handleAIProcessed = (processedUri: string) => {
    setState(prev => ({ ...prev, processedUri }));
  };

  const handleRotate = async () => {
    const newRotation = (state.rotation + 90) % 360;
    setState(prev => ({ ...prev, rotation: newRotation }));
    
    const result = await ImageManipulator.manipulateAsync(
      state.editedUri,
      [{ rotate: newRotation }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );
    
    setState(prev => ({ ...prev, editedUri: result.uri }));
  };

  const handleSave = async () => {
    try {
      let finalUri = state.editedUri;
      const actions: ImageManipulator.Action[] = [];

      // Apply crop if changed
      if (state.cropConfig.width > 0) {
        actions.push({
          crop: {
            width: state.cropConfig.width,
            height: state.cropConfig.height,
            originX: state.cropConfig.x,
            originY: state.cropConfig.y,
          },
        });
      }

      // Apply rotation if any
      if (state.rotation !== 0) {
        actions.push({ rotate: state.rotation });
      }

      // Apply filter if selected
      if (state.filter) {
        actions.push({ preset: state.filter });
      }

      // Apply adjustments if changed
      if (Object.values(state.adjustments).some(value => value !== 0)) {
        actions.push(
          { brightness: state.adjustments.brightness },
          { contrast: state.adjustments.contrast },
          { saturation: state.adjustments.saturation }
        );
      }

      // Process the image if there are any actions
      if (actions.length > 0) {
        const result = await ImageManipulator.manipulateAsync(
          state.processedUri || state.editedUri,
          actions,
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );
        finalUri = result.uri;
      }

      onSave(finalUri);
    } catch (error) {
      console.error('Error saving edited image:', error);
    }
  };

  const renderToolbar = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.toolbar}
      contentContainerStyle={styles.toolbarContent}
    >
      {tools.map((tool) => (
        <TouchableOpacity
          key={tool.id}
          style={[
            styles.toolButton,
            state.currentTool === tool.id && styles.toolButtonActive,
          ]}
          onPress={() => {
            if (tool.id === 'rotate') {
              handleRotate();
            } else {
              setState(prev => ({ ...prev, currentTool: tool.id }));
              handleToolSelect(tool.id);
            }
          }}
        >
          <IconSymbol
            name={tool.icon}
            size={24}
            color={state.currentTool === tool.id ? '#fff' : '#aaa'}
          />
          <ThemedText style={styles.toolLabel}>{tool.label}</ThemedText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderEditingView = () => {
    switch (state.editMode) {
      case 'crop':
        return (
          <ImageCropView
            uri={state.editedUri}
            onCropComplete={(config) => setState(prev => ({ ...prev, cropConfig: config }))}
            imageRef={imageRef}
          />
        );
      case 'filters':
        return (
          <FilterView
            uri={state.editedUri}
            onFilterSelect={handleFilterSelect}
            currentFilter={state.filter}
          />
        );
      case 'adjust':
        return (
          <AdjustmentsView
            uri={state.editedUri}
            onAdjustmentsChange={handleAdjustmentsChange}
            adjustments={state.adjustments}
          />
        );
      case 'ai':
        return (
          <AIToolsView
            uri={state.editedUri}
            onImageProcessed={handleAIProcessed}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <BlurView intensity={100} style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onClose}
          >
            <IconSymbol name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Edit Photo</ThemedText>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSave}
          >
            <ThemedText style={styles.saveButton}>Save</ThemedText>
          </TouchableOpacity>
        </BlurView>
      </SafeAreaView>

      <View style={styles.imageContainer}>
        <ImageCropView
          uri={state.editedUri}
          ref={imageRef}
          rotation={state.rotation}
          crop={state.cropConfig}
        />
      </View>

      <SafeAreaView style={styles.footer}>
        <BlurView intensity={100} style={styles.footerContent}>
          {renderToolbar()}
          {renderEditingView()}
        </BlurView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  saveButton: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerContent: {
    paddingVertical: 16,
  },
  toolbar: {
    flexGrow: 0,
  },
  toolbarContent: {
    paddingHorizontal: 16,
  },
  toolButton: {
    alignItems: 'center',
    marginHorizontal: 8,
    opacity: 0.7,
  },
  toolButtonActive: {
    opacity: 1,
  },
  toolLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#fff',
  },
});

export default PhotoEditor;
