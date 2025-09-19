export interface User {
  userId: string;
  farcasterId: string;
  displayName: string;
  walletAddress: string;
}

export interface Category {
  categoryId: string;
  name: string;
}

export interface Trip {
  tripId: string;
  name: string;
  startDate?: string;
  endDate?: string;
  members: string[]; // User IDs
  createdAt: string;
  createdBy: string; // User ID
}

export interface Expense {
  expenseId: string;
  tripId: string;
  description: string;
  amount: number;
  paidByUserId: string;
  categoryId: string;
  timestamp: string;
  receiptImageUrl?: string;
  splitAmongUserIds: string[]; // User IDs
}

export interface ExpenseWithDetails extends Expense {
  paidBy: User;
  category: Category;
  splitAmong: User[];
}

export interface TripWithDetails {
  tripId: string;
  name: string;
  startDate?: string;
  endDate?: string;
  members: User[];
  createdAt: string;
  createdBy: string;
  expenses: ExpenseWithDetails[];
  totalExpenses: number;
  balances: Balance[];
}

export interface Balance {
  userId: string;
  user: User;
  owes: number; // positive means they owe money
  owed: number; // positive means money is owed to them
  net: number; // positive means they are owed money, negative means they owe money
}

export interface SettlementSuggestion {
  fromUserId: string;
  toUserId: string;
  amount: number;
  fromUser: User;
  toUser: User;
}
