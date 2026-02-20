import { useState } from 'react';
import { FlatList, Keyboard, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type TodoItem = {
  id: string;
  text: string;
  maxFrequency?: number; // optional max times per day
  points?: number; // optional reward points
};

export default function TodosScreen() {
  const [input, setInput] = useState('');
  const [frequencyInput, setFrequencyInput] = useState('');
  const [pointsInput, setPointsInput] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const handleAddTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const parsedFrequency = Number.parseInt(frequencyInput, 10);
    const maxFrequency =
      Number.isNaN(parsedFrequency) || parsedFrequency <= 0 ? undefined : parsedFrequency;

    const parsedPoints = Number.parseInt(pointsInput, 10);
    const points = Number.isNaN(parsedPoints) || parsedPoints < 0 ? undefined : parsedPoints;

    setTodos((current) => [
      {
        id: Date.now().toString(),
        text: trimmed,
        maxFrequency,
        points,
      },
      ...current,
    ]);
    setInput('');
    // Keep whatever was typed, user controls clearing/updating it
    Keyboard.dismiss();
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#F4D6C8', dark: '#2B1811' }}
      headerImage={null}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Brownie Todos</ThemedText>
        <ThemedText type="default">
          Add the things you want to bake into your day.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Add a new todo..."
          placeholderTextColor="#999"
          onSubmitEditing={handleAddTodo}
          returnKeyType="done"
          style={styles.input}
        />
        <TextInput
          value={frequencyInput}
          onChangeText={setFrequencyInput}
          placeholder="Max/day (optional)"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          style={styles.frequencyInput}
        />
        <TextInput
          value={pointsInput}
          onChangeText={setPointsInput}
          placeholder="Points"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          style={styles.pointsInput}
        />
        <TouchableOpacity
          onPress={handleAddTodo}
          accessibilityRole="button"
          accessibilityLabel="Add todo"
          style={styles.addButton}>
          <ThemedText type="defaultSemiBold" style={styles.addButtonText}>
            Add
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <FlatList
        style={styles.list}
        data={todos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={todos.length === 0 && styles.emptyListContainer}
        renderItem={({ item }) => (
          <ThemedView style={styles.todoItem}>
            <ThemedText style={styles.todoText}>{item.text}</ThemedText>
            <ThemedText type="default" style={styles.frequencyLabel}>
              {item.maxFrequency ? `Max ${item.maxFrequency} / day` : 'Unlimited'}
            </ThemedText>
            {typeof item.points === 'number' && (
              <ThemedText type="default" style={styles.pointsLabel}>
                Points: {item.points}
              </ThemedText>
            )}
          </ThemedView>
        )}
        ListEmptyComponent={
          <ThemedText type="default" style={styles.emptyText}>
            No todos yet. Start by adding your first one above.
          </ThemedText>
        }
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  frequencyInput: {
    width: 70,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    backgroundColor: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  pointsInput: {
    width: 70,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    backgroundColor: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#8B4513',
  },
  addButtonText: {
    color: '#fff',
  },
  list: {
    backgroundColor: '#ffffff',
  },
  todoItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  todoText: {
    color: '#000',
    marginBottom: 2,
  },
  frequencyLabel: {
    color: '#000',
    fontSize: 12,
    opacity: 0.7,
  },
  pointsLabel: {
    color: '#000',
    fontSize: 12,
    opacity: 0.7,
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
