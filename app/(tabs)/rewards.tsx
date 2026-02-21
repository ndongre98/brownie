import { FlatList, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { ReactElement } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ItemConfig, RewardItem } from '@/components/Item';
import { SwipeableItem } from '@/components/SwipeableItem';
import { ItemModal } from '@/components/ItemModal';
import { useItemList } from '@/hooks/useItemList';
import { usePoints } from '@/contexts/PointsContext';

const rewardConfig: ItemConfig = {
  itemType: 'reward',
  pointsLabel: 'Cost',
  addButtonLabel: 'Add Reward',
  screenTitle: 'Brownie Rewards',
  modalTitleAdd: 'Add New Reward',
  modalTitleEdit: 'Edit Reward',
  itemNameLabel: 'Reward Name',
  emptyMessage: 'No rewards yet. Tap "Add Reward" to get started.',
  resetLabel: 'Reset',
  editLabel: 'Edit',
  deleteLabel: 'Delete',
};

export default function RewardsScreen() {
  const {
    items: rewards,
    setItems: setRewards,
    modalVisible,
    editingItemId,
    nameInput,
    frequencyInput,
    pointsInput,
    setNameInput,
    setFrequencyInput,
    setPointsInput,
    setEditingItemId,
    setModalVisible,
    openAddModal,
    handleCancel,
    handleComplete: baseHandleComplete,
    handleResetCount,
    handleDelete,
  } = useItemList<RewardItem>();

  const { points, logActivity } = usePoints();

  const handleComplete = (id: string) => {
    const reward = rewards.find((r) => r.id === id);
    if (reward) {
      // Check if reward has a cost and if user has enough points
      if (reward.cost && reward.cost > 0) {
        if (points < reward.cost) {
          Alert.alert(
            'Insufficient Points',
            `You need ${reward.cost} points to redeem this reward. You currently have ${points} points.`
          );
          return;
        }
        logActivity('reward_redeemed', reward.text, -reward.cost);
      }
      baseHandleComplete(id);
    }
  };

  const handleAddReward = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;

    const parsedFrequency = Number.parseInt(frequencyInput, 10);
    const maxFrequency =
      Number.isNaN(parsedFrequency) || parsedFrequency <= 0 ? undefined : parsedFrequency;

    const parsedCost = Number.parseInt(pointsInput, 10);
    const cost = Number.isNaN(parsedCost) || parsedCost < 0 ? undefined : parsedCost;

    if (editingItemId) {
      // Update existing reward
      setRewards((current) =>
        current.map((reward): RewardItem => {
          if (reward.id === editingItemId) {
            return {
              id: reward.id,
              text: trimmed,
              maxFrequency,
              cost,
              completionsToday: reward.completionsToday,
              lastCompletionDate: reward.lastCompletionDate,
            };
          }
          return reward;
        })
      );
    } else {
      // Add new reward
      const today = new Date().toISOString().split('T')[0];
      setRewards((current) => [
        {
          id: Date.now().toString(),
          text: trimmed,
          maxFrequency,
          cost,
          completionsToday: 0,
          lastCompletionDate: today,
        },
        ...current,
      ]);
    }

    // Reset form
    handleCancel();
  };

  const handleEditReward = (reward: RewardItem) => {
    setNameInput(reward.text);
    setFrequencyInput(reward.maxFrequency?.toString() || '');
    setPointsInput(reward.cost?.toString() || '');
    setEditingItemId(reward.id);
    setModalVisible(true);
  };

  const emptyHeaderImage: ReactElement = <View />;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#F4D6C8', dark: '#2B1811' }}
      headerImage={emptyHeaderImage}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">{rewardConfig.screenTitle}</ThemedText>
        <TouchableOpacity
          onPress={openAddModal}
          style={styles.addButton}
          accessibilityRole="button"
          accessibilityLabel="Add new reward">
          <ThemedText type="defaultSemiBold" style={styles.addButtonText}>
            {rewardConfig.addButtonLabel}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <FlatList
        style={styles.list}
        data={rewards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={rewards.length === 0 && styles.emptyListContainer}
        renderItem={({ item }) => (
          <SwipeableItem
            item={item}
            config={rewardConfig}
            getPointsValue={(item) => item.cost}
            onComplete={() => handleComplete(item.id)}
            onReset={() => handleResetCount(item.id)}
            onEdit={() => handleEditReward(item)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          <ThemedText type="default" style={styles.emptyText}>
            {rewardConfig.emptyMessage}
          </ThemedText>
        }
      />

      <ItemModal
        visible={modalVisible}
        config={rewardConfig}
        isEditing={editingItemId !== null}
        nameValue={nameInput}
        nameOnChange={setNameInput}
        pointsValue={pointsInput}
        pointsOnChange={setPointsInput}
        frequencyValue={frequencyInput}
        frequencyOnChange={setFrequencyInput}
        onCancel={handleCancel}
        onSubmit={handleAddReward}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 12,
    marginBottom: 16,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#8B4513',
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
  },
  list: {
    backgroundColor: '#ffffff',
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
    color: '#000',
  },
});
