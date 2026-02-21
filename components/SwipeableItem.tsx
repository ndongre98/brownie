import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BaseItem, ItemConfig } from './Item';

type SwipeableItemProps<T extends BaseItem> = {
  item: T;
  config: ItemConfig;
  getPointsValue: (item: T) => number | undefined;
  onComplete: () => void;
  onReset: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function SwipeableItem<T extends BaseItem>({
  item,
  config,
  getPointsValue,
  onComplete,
  onReset,
  onEdit,
  onDelete,
}: SwipeableItemProps<T>) {
  const translateX = useSharedValue(0);
  const SWIPE_THRESHOLD = 100;

  const canComplete =
    item.maxFrequency === undefined || item.completionsToday < item.maxFrequency;

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      // Only allow swiping right (positive translation) if we can complete
      if (e.translationX > 0 && canComplete) {
        translateX.value = e.translationX;
      }
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD && canComplete) {
        // Swiped far enough - complete
        translateX.value = withSpring(0);
        runOnJS(onComplete)();
      } else {
        // Not far enough or can't complete - spring back
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const progress = Math.min(translateX.value / SWIPE_THRESHOLD, 1);
    return {
      transform: [{ translateX: translateX.value }],
      backgroundColor: `rgba(76, 175, 80, ${progress * 0.2})`, // Green background as you swipe
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    const opacity = Math.min(translateX.value / SWIPE_THRESHOLD, 1);
    return {
      opacity,
      transform: [{ scale: opacity }],
    };
  });

  const pointsValue = getPointsValue(item);
  const isMaxReached =
    item.maxFrequency !== undefined && item.completionsToday >= item.maxFrequency;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.itemContainer, animatedStyle]}>
        <Animated.View style={[styles.checkmarkContainer, checkmarkStyle]}>
          <IconSymbol name="checkmark.circle.fill" size={32} color="#4CAF50" />
        </Animated.View>
        <ThemedView
          style={[
            styles.item,
            item.completionsToday > 0 && styles.itemCompleted,
            isMaxReached && styles.itemMaxReached,
          ]}>
          <ThemedText
            style={[
              styles.itemName,
              item.completionsToday > 0 && styles.itemNameCompleted,
              isMaxReached && styles.itemNameMaxReached,
            ]}>
            {item.text}
          </ThemedText>
          <View style={styles.itemDetails}>
            <ThemedText
              style={[
                styles.detailText,
                isMaxReached && styles.detailTextMaxReached,
              ]}>
              {config.pointsLabel}: {typeof pointsValue === 'number' ? pointsValue : '—'}
            </ThemedText>
            <ThemedText
              style={[
                styles.detailText,
                isMaxReached && styles.detailTextMaxReached,
              ]}>
              Max Frequency: {item.maxFrequency ? `${item.maxFrequency}/day` : 'Unlimited'}
            </ThemedText>
            <ThemedText
              style={[
                styles.completionCount,
                isMaxReached && styles.completionCountMax,
              ]}>
              Completed today: {item.completionsToday}
              {item.maxFrequency !== undefined &&
                ` / ${item.maxFrequency} (${
                  item.maxFrequency - item.completionsToday
                } remaining)`}
            </ThemedText>
          </View>
          <View style={styles.itemActions}>
            {item.completionsToday > 0 && (
              <TouchableOpacity
                onPress={onReset}
                style={[styles.actionButton, styles.resetButton]}
                accessibilityRole="button"
                accessibilityLabel="Reset completion count">
                <ThemedText style={styles.resetButtonText}>{config.resetLabel}</ThemedText>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onEdit}
              style={[styles.actionButton, styles.editButton]}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${config.itemType}`}>
              <ThemedText style={styles.editButtonText}>{config.editLabel}</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDelete}
              style={[styles.actionButton, styles.deleteButton]}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${config.itemType}`}>
              <ThemedText style={styles.deleteButtonText}>{config.deleteLabel}</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  checkmarkContainer: {
    position: 'absolute',
    left: 16,
    top: '50%',
    marginTop: -16,
    zIndex: 1,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemCompleted: {
    backgroundColor: '#f5f5f5',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  itemMaxReached: {
    backgroundColor: '#f5f5f5',
  },
  itemName: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemNameCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  itemNameMaxReached: {
    opacity: 0.5,
  },
  itemDetails: {
    gap: 4,
    marginBottom: 12,
  },
  detailText: {
    color: '#000',
    fontSize: 14,
    opacity: 0.7,
  },
  detailTextMaxReached: {
    opacity: 0.5,
  },
  completionCount: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  completionCountMax: {
    color: '#4CAF50',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    opacity: 1,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
    opacity: 1,
  },
  editButton: {
    backgroundColor: '#4A90E2',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  resetButton: {
    backgroundColor: '#9E9E9E',
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
