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
import IconSymbol from './ui/IconSymbol';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';
import { Photo } from '@/store/slices/gallerySlice';

interface PhotoEditorProps {
  photo: Photo;
  onClose: () => void;
}

interface EditingTool {
  id: string;
  name: string;
  icon: string;
  category: 'basic' | 'ai';
}

const EDITING_TOOLS: EditingTool[] = [
  // Basic editing tools
  { id: 'crop', name: 'Crop', icon: 'crop', category: 'basic' },
  { id: 'rotate', name: 'Rotate', icon: 'refresh', category: 'basic' },
  { id: 'adjust', name: 'Adjust', icon: 'contrast', category: 'basic' },
  { id: 'filter', name: 'Filters', icon: 'color-filter', category: 'basic' },
  
  // AI tools
  { id: 'object-removal', name: 'Remove Object', icon: 'magnet', category: 'ai' },
  { id: 'face-detection', name: 'Face Detection', icon: 'happy', category: 'ai' },
  { id: 'style-transfer', name: 'Style Transfer', icon: 'brush', category: 'ai' },
  { id: 'auto-enhance', name: 'Auto Enhance', icon: 'sparkles', category: 'ai' },
];

export default function PhotoEditor({ photo, onClose }: PhotoEditorProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const router = useRouter();

  const handleToolPress = (toolId: string) => {
    if (toolId.startsWith('ai-')) {
      router.push(`/ai/${toolId.replace('ai-', '')}`);
    } else {
      setSelectedTool(toolId);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <IconSymbol name="close" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <IconSymbol name="save" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: photo.uri }} style={styles.image} resizeMode="contain" />
      </View>

      <ScrollView horizontal style={styles.toolsContainer}>
        {EDITING_TOOLS.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={[
              styles.toolButton,
              selectedTool === tool.id && styles.selectedTool,
            ]}
            onPress={() => handleToolPress(tool.id)}
          >
            <IconSymbol name={tool.icon} size={24} />
            <ThemedText style={styles.toolText}>{tool.name}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    padding: 16,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
  },
  toolsContainer: {
    padding: 16,
  },
  toolButton: {
    alignItems: 'center',
    marginRight: 20,
    padding: 8,
    borderRadius: 8,
  },
  selectedTool: {
    backgroundColor: '#0066ff20',
  },
  toolText: {
    fontSize: 12,
    marginTop: 4,
  },
});
