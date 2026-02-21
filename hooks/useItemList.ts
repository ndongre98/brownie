import { useState } from 'react';
import { Keyboard } from 'react-native';
import { BaseItem } from '@/components/Item';

export function useItemList<T extends BaseItem>() {
  const [items, setItems] = useState<T[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [frequencyInput, setFrequencyInput] = useState('');
  const [pointsInput, setPointsInput] = useState('');

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const openAddModal = () => {
    setNameInput('');
    setFrequencyInput('');
    setPointsInput('');
    setEditingItemId(null);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setNameInput('');
    setFrequencyInput('');
    setPointsInput('');
    setEditingItemId(null);
    setModalVisible(false);
    Keyboard.dismiss();
  };

  const handleComplete = (id: string) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        const today = getTodayDate();
        const isNewDay = item.lastCompletionDate !== today;

        // Reset count if it's a new day
        let completionsToday = isNewDay ? 0 : item.completionsToday;

        // Check maxFrequency
        if (item.maxFrequency !== undefined) {
          if (completionsToday >= item.maxFrequency) {
            // Already at max, can't complete more
            return item;
          }
        }
        // Can complete: increment count
        completionsToday += 1;

        return {
          ...item,
          completionsToday,
          lastCompletionDate: today,
        };
      })
    );
  };

  const handleResetCount = (id: string) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const today = getTodayDate();
        return {
          ...item,
          completionsToday: 0,
          lastCompletionDate: today,
        };
      })
    );
  };

  const handleDelete = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return {
    items,
    setItems,
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
    handleComplete,
    handleResetCount,
    handleDelete,
  };
}
