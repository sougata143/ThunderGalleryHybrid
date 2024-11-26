import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Slider,
} from 'react-native';
import ThemedText from '../ThemedText';
import { Adjustments } from './types';

interface AdjustmentsViewProps {
  uri: string;
  onAdjustmentsChange: (adjustments: Adjustments) => void;
  adjustments: Adjustments;
}

const adjustmentControls = [
  {
    id: 'brightness',
    label: 'Brightness',
    min: -1,
    max: 1,
    step: 0.1,
  },
  {
    id: 'contrast',
    label: 'Contrast',
    min: -1,
    max: 1,
    step: 0.1,
  },
  {
    id: 'saturation',
    label: 'Saturation',
    min: -1,
    max: 1,
    step: 0.1,
  },
];

const AdjustmentsView: React.FC<AdjustmentsViewProps> = ({
  onAdjustmentsChange,
  adjustments,
}) => {
  const handleAdjustmentChange = (id: keyof Adjustments, value: number) => {
    onAdjustmentsChange({
      ...adjustments,
      [id]: value,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {adjustmentControls.map((control) => (
          <View key={control.id} style={styles.controlContainer}>
            <View style={styles.labelContainer}>
              <ThemedText style={styles.label}>{control.label}</ThemedText>
              <ThemedText style={styles.value}>
                {adjustments[control.id as keyof Adjustments].toFixed(1)}
              </ThemedText>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={control.min}
              maximumValue={control.max}
              step={control.step}
              value={adjustments[control.id as keyof Adjustments]}
              onValueChange={(value) =>
                handleAdjustmentChange(control.id as keyof Adjustments, value)
              }
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#555"
              thumbTintColor="#fff"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  controlContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#fff',
  },
  value: {
    fontSize: 14,
    color: '#fff',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default AdjustmentsView;
