import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import ThemedText from '../ThemedText';
import IconSymbol from '../ui/IconSymbol';
import { AI_FEATURES } from './types';
import {
  removeObject,
  applyStyleTransfer,
  detectFaces,
  replaceBackground,
  autoEnhance,
} from '../../services/aiService';

interface AIToolsViewProps {
  uri: string;
  onComplete: (uri: string) => void;
}

const AIToolsView: React.FC<AIToolsViewProps> = ({ uri, onComplete }) => {
  const [processing, setProcessing] = useState<string | null>(null);

  const handleAIProcess = async (featureId: string) => {
    setProcessing(featureId);

    try {
      const feature = AI_FEATURES.find(f => f.id === featureId);
      if (!feature) {
        throw new Error('Invalid feature');
      }

      let result;
      switch (featureId) {
        case 'object-removal':
          result = await removeObject(uri);
          break;
        case 'style-transfer':
          result = await applyStyleTransfer(uri);
          break;
        case 'face-detection':
          result = await detectFaces(uri);
          break;
        case 'background-removal':
          result = await replaceBackground(uri);
          break;
        case 'auto-enhance':
          result = await autoEnhance(uri);
          break;
        default:
          throw new Error('Feature not implemented');
      }

      if (result?.success && result.url) {
        onComplete(result.url);
      } else {
        throw new Error(result?.error || 'Processing failed');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to process image'
      );
    } finally {
      setProcessing(null);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {AI_FEATURES.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={[
              styles.toolButton,
              processing === feature.id && styles.toolButtonActive,
            ]}
            onPress={() => handleAIProcess(feature.id)}
            disabled={!!processing}
          >
            {processing === feature.id ? (
              <ActivityIndicator color="#007AFF" />
            ) : (
              <>
                <IconSymbol
                  name={feature.icon}
                  size={24}
                  color={processing === feature.id ? '#007AFF' : '#fff'}
                />
                <ThemedText style={styles.toolLabel}>{feature.label}</ThemedText>
                <ThemedText style={styles.toolDescription}>
                  {feature.description}
                </ThemedText>
              </>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  toolButton: {
    alignItems: 'center',
    marginRight: 24,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 120,
  },
  toolButtonActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  toolLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  toolDescription: {
    marginTop: 4,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default AIToolsView;
