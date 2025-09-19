export interface User {
  userId: string;
  farcasterId: number;
  displayName: string;
  walletAddress: string;
}

export interface Trip {
  tripId: string;
  name: string;
  startDate: string;
  endDate: string;
  members: string[]; // User IDs
}

export interface Category {
  categoryId: string;
  name: string;
}

export interface Expense {
  expenseId: string;
  tripId: string;
  description: string;
  amount: number;
  paidByUserId: string;
  categoryId: string;
  timestamp: Date;
  receiptImageUrl?: string;
  splitAmongUserIds: string[];
}

export interface Balance {
  userId: string;
  owes: number;
  owed: number;
  net: number;
}

export interface Settlement {
  fromUserId: string;
  toUserId: string;
  amount: number;
}

export const EXPENSE_CATEGORIES: Category[] = [
  { categoryId: 'food', name: 'Food & Dining' },
  { categoryId: 'accommodation', name: 'Accommodation' },
  { categoryId: 'transport', name: 'Transportation' },
  { categoryId: 'entertainment', name: 'Entertainment' },
  { categoryId: 'shopping', name: 'Shopping' },
  { categoryId: 'other', name: 'Other' },
];
