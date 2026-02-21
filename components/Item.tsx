// Shared types and interfaces for todos and rewards

export type BaseItem = {
  id: string;
  text: string;
  maxFrequency?: number;
  completionsToday: number;
  lastCompletionDate: string;
};

export type TodoItem = BaseItem & {
  points?: number; // points earned
};

export type RewardItem = BaseItem & {
  cost?: number; // points cost
};

export type ItemConfig = {
  itemType: 'todo' | 'reward';
  pointsLabel: string; // "Points" or "Cost"
  addButtonLabel: string; // "Add Todo" or "Add Reward"
  screenTitle: string; // "Brownie Todos" or "Brownie Rewards"
  modalTitleAdd: string; // "Add New Todo" or "Add New Reward"
  modalTitleEdit: string; // "Edit Todo" or "Edit Reward"
  itemNameLabel: string; // "Todo Name" or "Reward Name"
  emptyMessage: string;
  resetLabel: string; // "Reset" (same for both)
  editLabel: string; // "Edit" (same for both)
  deleteLabel: string; // "Delete" (same for both)
};
