import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import ThemedText from '../ThemedText';
import { Filter } from './types';

interface FilterViewProps {
  uri: string;
  onFilterSelect: (filter: Filter) => void;
  currentFilter: Filter | null;
}

const filters: { id: Filter; label: string }[] = [
  { id: 'sepia', label: 'Sepia' },
  { id: 'black_and_white', label: 'B&W' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'chrome', label: 'Chrome' },
  { id: 'fade', label: 'Fade' },
  { id: 'instant', label: 'Instant' },
  { id: 'mono', label: 'Mono' },
  { id: 'noir', label: 'Noir' },
  { id: 'process', label: 'Process' },
  { id: 'tonal', label: 'Tonal' },
  { id: 'transfer', label: 'Transfer' },
  { id: 'vivid', label: 'Vivid' },
];

const FilterView: React.FC<FilterViewProps> = ({
  uri,
  onFilterSelect,
  currentFilter,
}) => {
  const applyFilter = async (filter: Filter) => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ preset: filter }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      return result.uri;
    } catch (error) {
      console.error('Error applying filter:', error);
      return uri;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterItem,
              currentFilter === filter.id && styles.filterItemActive,
            ]}
            onPress={() => onFilterSelect(filter.id)}
          >
            <Image
              source={{ uri }}
              style={styles.filterPreview}
              resizeMode="cover"
            />
            <ThemedText style={styles.filterLabel}>{filter.label}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  filterItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    opacity: 0.7,
  },
  filterItemActive: {
    opacity: 1,
  },
  filterPreview: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginBottom: 4,
  },
  filterLabel: {
    fontSize: 12,
    color: '#fff',
  },
});

export default FilterView;
