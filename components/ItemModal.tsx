import { Keyboard, Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ItemConfig } from './Item';

type ItemModalProps = {
  visible: boolean;
  config: ItemConfig;
  isEditing: boolean;
  nameValue: string;
  nameOnChange: (text: string) => void;
  pointsValue: string;
  pointsOnChange: (text: string) => void;
  frequencyValue: string;
  frequencyOnChange: (text: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export function ItemModal({
  visible,
  config,
  isEditing,
  nameValue,
  nameOnChange,
  pointsValue,
  pointsOnChange,
  frequencyValue,
  frequencyOnChange,
  onCancel,
  onSubmit,
}: ItemModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}>
      <Pressable style={styles.modalOverlay} onPress={onCancel}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <ThemedText type="title" style={styles.modalTitle}>
            {isEditing ? config.modalTitleEdit : config.modalTitleAdd}
          </ThemedText>

          <ThemedText style={styles.label}>{config.itemNameLabel}</ThemedText>
          <TextInput
            value={nameValue}
            onChangeText={nameOnChange}
            placeholder={`Enter ${config.itemType} name...`}
            placeholderTextColor="#999"
            style={styles.modalInput}
            autoFocus
          />

          <ThemedText style={styles.label}>{config.pointsLabel} (optional)</ThemedText>
          <TextInput
            value={pointsValue}
            onChangeText={pointsOnChange}
            placeholder={`Enter ${config.pointsLabel.toLowerCase()}...`}
            placeholderTextColor="#999"
            keyboardType="number-pad"
            style={styles.modalInput}
          />

          <ThemedText style={styles.label}>Max Frequency per Day (optional)</ThemedText>
          <TextInput
            value={frequencyValue}
            onChangeText={frequencyOnChange}
            placeholder="Enter max frequency..."
            placeholderTextColor="#999"
            keyboardType="number-pad"
            style={styles.modalInput}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.modalButton, styles.cancelButton]}>
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSubmit}
              style={[styles.modalButton, styles.submitButton]}>
              <ThemedText style={styles.submitButtonText}>
                {isEditing ? 'Save' : 'Add'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    color: '#000',
    marginBottom: 20,
  },
  label: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#8B4513',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
