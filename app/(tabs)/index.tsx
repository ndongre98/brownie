import { FlatList, StyleSheet, View } from 'react-native';
import { ReactElement } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { usePoints, ActivityLog } from '@/contexts/PointsContext';

export default function DashboardScreen() {
  const { points, activityLog } = usePoints();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderActivityItem = ({ item }: { item: ActivityLog }) => {
    const isEarned = item.points > 0;
    const iconName = item.type === 'todo_completed' ? 'checkmark.circle.fill' : 'gift.fill';
    const iconColor = isEarned ? '#4CAF50' : '#E74C3C';
    const pointsLabel = isEarned ? `Earned +${item.points} pts` : `Spent ${Math.abs(item.points)} pts`;

    return (
      <ThemedView style={styles.activityItem}>
        <View style={styles.activityIcon}>
          <IconSymbol name={iconName} size={24} color={iconColor} />
        </View>
        <View style={styles.activityContent}>
          <ThemedText style={styles.activityText}>
            {item.type === 'todo_completed' ? 'Completed' : 'Redeemed'}: {item.itemName}
          </ThemedText>
          <ThemedText style={styles.activityPointsChange}>{pointsLabel}</ThemedText>
          <ThemedText style={styles.activityTime}>{formatTime(item.timestamp)}</ThemedText>
        </View>
        <ThemedText
          style={[
            styles.activityPoints,
            isEarned ? styles.pointsEarned : styles.pointsSpent,
          ]}>
          {isEarned ? '+' : ''}
          {item.points}
        </ThemedText>
      </ThemedView>
    );
  };

  const emptyHeaderImage: ReactElement = <View />;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#F4D6C8', dark: '#2B1811' }}
      headerImage={emptyHeaderImage}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Brownie Dashboard</ThemedText>
      </ThemedView>

      {/* Points Card */}
      <ThemedView style={styles.pointsCard}>
        <ThemedText style={styles.pointsLabel}>Current Points</ThemedText>
        <ThemedText style={styles.pointsValue}>{points}</ThemedText>
      </ThemedView>

      {/* Activity Log */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Recent Activity
        </ThemedText>
        {activityLog.length === 0 ? (
          <ThemedView style={styles.emptyActivity}>
            <ThemedText style={styles.emptyActivityText}>
              No activity yet. Complete todos or redeem rewards to see activity here!
            </ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={activityLog}
            keyExtractor={(item) => item.id}
            renderItem={renderActivityItem}
            scrollEnabled={false}
            contentContainerStyle={styles.activityList}
          />
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 12,
    marginBottom: 24,
  },
  pointsCard: {
    backgroundColor: '#8B4513',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  pointsLabel: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
    marginBottom: 8,
  },
  pointsValue: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#000',
    marginBottom: 16,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activityIcon: {
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  activityPointsChange: {
    color: '#000',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
    opacity: 0.85,
  },
  activityTime: {
    color: '#000',
    fontSize: 12,
    opacity: 0.6,
  },
  activityPoints: {
    fontSize: 18,
    fontWeight: '600',
  },
  pointsEarned: {
    color: '#4CAF50',
  },
  pointsSpent: {
    color: '#E74C3C',
  },
  emptyActivity: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  emptyActivityText: {
    color: '#000',
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
