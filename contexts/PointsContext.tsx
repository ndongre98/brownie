import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

export type ActivityType = 'todo_completed' | 'reward_redeemed';

export type ActivityLog = {
  id: string;
  type: ActivityType;
  itemName: string;
  /** Point change: positive = earned from todo, negative = spent on reward */
  points: number;
  timestamp: Date;
};

type PointsContextType = {
  /** Current points: sum of all activity log point changes (todoPoints - rewardPoints) */
  points: number;
  activityLog: ActivityLog[];
  /** Record a point change; this is the only way points change. Logs activity and updates balance. */
  logActivity: (type: ActivityType, itemName: string, points: number) => void;
};

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export function PointsProvider({ children }: { children: ReactNode }) {
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);

  const points = useMemo(
    () => activityLog.reduce((sum, entry) => sum + entry.points, 0),
    [activityLog]
  );

  const logActivity = (type: ActivityType, itemName: string, pointsAmount: number) => {
    const activity: ActivityLog = {
      id: Date.now().toString(),
      type,
      itemName,
      points: pointsAmount,
      timestamp: new Date(),
    };
    setActivityLog((current) => [activity, ...current]);
  };

  return (
    <PointsContext.Provider
      value={{
        points,
        activityLog,
        logActivity,
      }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
}
