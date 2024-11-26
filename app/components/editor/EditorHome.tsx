import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import IconSymbol from '../ui/IconSymbol';
import ThemedText from '../ThemedText';
import ThemedView from '../ThemedView';
import { Photo } from '@/store/slices/gallerySlice';
import AIToolsView from './AIToolsView';
import AdjustmentsView from './AdjustmentsView';
import FilterView from './FilterView';
import ImageCropView from './ImageCropView';
import { EditingTool } from './types';

interface EditorHomeProps {
  photo: Photo;
  onClose: () => void;
}

const EDITING_TOOLS: EditingTool[] = [
  // Basic editing tools
  { id: 'crop', label: 'Crop', icon: 'crop' },
  { id: 'rotate', label: 'Rotate', icon: 'refresh' },
  { id: 'adjust', label: 'Adjust', icon: 'contrast' },
  { id: 'filter', label: 'Filters', icon: 'color-filter' },
  
  // AI tools
  { id: 'ai', label: 'AI Tools', icon: 'flash' },
];

export default function EditorHome({ photo, onClose }: EditorHomeProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [editedUri, setEditedUri] = useState<string>(photo.uri);
  const router = useRouter();

  const handleToolPress = (toolId: string) => {
    setSelectedTool(toolId);
  };

  const renderToolContent = () => {
    switch (selectedTool) {
      case 'crop':
        return (
          <ImageCropView
            uri={editedUri}
            onComplete={(uri) => {
              setEditedUri(uri);
              setSelectedTool(null);
            }}
          />
        );
      case 'filter':
        return (
          <FilterView
            uri={editedUri}
            onComplete={(uri) => {
              setEditedUri(uri);
              setSelectedTool(null);
            }}
          />
        );
      case 'adjust':
        return (
          <AdjustmentsView
            uri={editedUri}
            onAdjustmentsChange={(adjustments) => {
              // Handle adjustments
            }}
            adjustments={{ brightness: 0, contrast: 0, saturation: 0 }}
          />
        );
      case 'ai':
        return (
          <AIToolsView
            uri={editedUri}
            onComplete={(uri) => {
              setEditedUri(uri);
              setSelectedTool(null);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <IconSymbol name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            // Handle save
            onClose();
          }}
        >
          <ThemedText style={styles.saveButtonText}>Save</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: editedUri }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.toolsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {EDITING_TOOLS.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={[
                styles.toolButton,
                selectedTool === tool.id && styles.selectedTool,
              ]}
              onPress={() => handleToolPress(tool.id)}
            >
              <IconSymbol
                name={tool.icon}
                size={24}
                color={selectedTool === tool.id ? '#007AFF' : '#fff'}
              />
              <ThemedText style={styles.toolText}>{tool.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.editingContent}>{renderToolContent()}</View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  closeButton: {
    padding: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  toolsContainer: {
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  toolButton: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  selectedTool: {
    opacity: 0.8,
  },
  toolText: {
    marginTop: 4,
    fontSize: 12,
    color: '#fff',
  },
  editingContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
});
