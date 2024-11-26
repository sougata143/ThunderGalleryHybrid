import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import IconSymbol from '@/components/ui/IconSymbol';
import { RootState } from '@/store';

interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  available: boolean;
}

const AI_FEATURES: AIFeature[] = [
  {
    id: 'object-removal',
    title: 'Object Removal',
    description: 'Remove unwanted objects from your photos',
    icon: 'wand.and.stars',
    route: '/ai/object-removal',
    available: true,
  },
  {
    id: 'face-detection',
    title: 'Face Detection',
    description: 'Detect and recognize faces in your photos',
    icon: 'face.smiling',
    route: '/ai/face-detection',
    available: true,
  },
  {
    id: 'style-transfer',
    title: 'Style Transfer',
    description: 'Apply artistic styles to your photos',
    icon: 'paintbrush.fill',
    route: '/ai/style-transfer',
    available: true,
  },
  {
    id: 'auto-enhance',
    title: 'Auto Enhance',
    description: 'Automatically enhance your photos',
    icon: 'sparkles',
    route: '/ai/auto-enhance',
    available: true,
  },
];

export default function AIScreen() {
  const modelStatus = useSelector((state: RootState) => state.ai.modelStatus);
  const isProcessing = useSelector((state: RootState) => state.ai.isProcessing);

  const renderFeature = (feature: AIFeature) => (
    <TouchableOpacity
      key={feature.id}
      style={styles.featureCard}
      onPress={() => router.push(feature.route)}
      disabled={!feature.available || isProcessing}
    >
      <View style={styles.featureIcon}>
        <IconSymbol name={feature.icon} size={32} color="#007AFF" />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </View>
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>AI Tools</Text>
      <View style={styles.featuresGrid}>
        {AI_FEATURES.map(renderFeature)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#007AFF',
  },
});
