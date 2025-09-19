/* eslint-disable prefer-const */
import { Trip, User, Expense, Category, TripWithDetails, ExpenseWithDetails, Balance, SettlementSuggestion } from '@/types';

// In-memory data store - replace with database in production
let users: User[] = [];
let trips: Trip[] = [];
let expenses: Expense[] = [];
let categories: Category[] = [
  { categoryId: '1', name: 'Food' },
  { categoryId: '2', name: 'Accommodation' },
  { categoryId: '3', name: 'Transport' },
  { categoryId: '4', name: 'Entertainment' },
  { categoryId: '5', name: 'Other' },
];

// User management
export const createUser = (user: Omit<User, 'userId'>): User => {
  const newUser: User = {
    ...user,
    userId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
  users.push(newUser);
  return newUser;
};

export const getUserByFarcasterId = (farcasterId: string): User | undefined => {
  return users.find(user => user.farcasterId === farcasterId);
};

export const getUserById = (userId: string): User | undefined => {
  return users.find(user => user.userId === userId);
};

// Trip management
export const createTrip = (trip: Omit<Trip, 'tripId' | 'createdAt'>): Trip => {
  const newTrip: Trip = {
    ...trip,
    tripId: `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  trips.push(newTrip);
  return newTrip;
};

export const getTripById = (tripId: string): Trip | undefined => {
  return trips.find(trip => trip.tripId === tripId);
};

export const getTripsByUserId = (userId: string): Trip[] => {
  return trips.filter(trip => trip.members.includes(userId) || trip.createdBy === userId);
};

export const getTripWithDetails = (tripId: string): TripWithDetails | undefined => {
  const trip = getTripById(tripId);
  if (!trip) return undefined;

  const tripExpenses = expenses.filter(exp => exp.tripId === tripId);
  const tripUsers = users.filter(user => trip.members.includes(user.userId) || user.userId === trip.createdBy);

  const expensesWithDetails: ExpenseWithDetails[] = tripExpenses.map(exp => ({
    ...exp,
    paidBy: users.find(u => u.userId === exp.paidByUserId)!,
    category: categories.find(c => c.categoryId === exp.categoryId)!,
    splitAmong: users.filter(u => exp.splitAmongUserIds.includes(u.userId)),
  }));

  const totalExpenses = expensesWithDetails.reduce((sum, exp) => sum + exp.amount, 0);

  const balances = calculateBalances(tripId);

  return {
    ...trip,
    members: tripUsers,
    expenses: expensesWithDetails,
    totalExpenses,
    balances,
  };
};

// Expense management
export const createExpense = (expense: Omit<Expense, 'expenseId' | 'timestamp'>): Expense => {
  const newExpense: Expense = {
    ...expense,
    expenseId: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  expenses.push(newExpense);
  return newExpense;
};

export const getExpensesByTripId = (tripId: string): Expense[] => {
  return expenses.filter(exp => exp.tripId === tripId);
};

// Balance calculation
export const calculateBalances = (tripId: string): Balance[] => {
  const trip = getTripById(tripId);
  if (!trip) return [];

  const tripUsers = users.filter(user => trip.members.includes(user.userId) || user.userId === trip.createdBy);
  const tripExpenses = expenses.filter(exp => exp.tripId === tripId);

  const balances: { [userId: string]: { owes: number; owed: number } } = {};

  // Initialize balances
  tripUsers.forEach(user => {
    balances[user.userId] = { owes: 0, owed: 0 };
  });

  // Calculate balances from expenses
  tripExpenses.forEach(expense => {
    const splitAmount = expense.amount / expense.splitAmongUserIds.length;

    // The person who paid gets credit for the full amount
    balances[expense.paidByUserId].owed += expense.amount;

    // Each person in the split owes their share
    expense.splitAmongUserIds.forEach(userId => {
      balances[userId].owes += splitAmount;
    });
  });

  // Convert to Balance objects
  return tripUsers.map(user => {
    const balance = balances[user.userId];
    return {
      userId: user.userId,
      user,
      owes: balance.owes,
      owed: balance.owed,
      net: balance.owed - balance.owes,
    };
  });
};

// Settlement suggestions
export const getSettlementSuggestions = (tripId: string): SettlementSuggestion[] => {
  const balances = calculateBalances(tripId);

  const debtors = balances.filter(b => b.net < 0).sort((a, b) => a.net - b.net); // Most negative first
  const creditors = balances.filter(b => b.net > 0).sort((a, b) => b.net - a.net); // Most positive first

  const suggestions: SettlementSuggestion[] = [];

  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(Math.abs(debtor.net), creditor.net);

    if (amount > 0.01) { // Avoid tiny amounts
      suggestions.push({
        fromUserId: debtor.userId,
        toUserId: creditor.userId,
        amount,
        fromUser: debtor.user,
        toUser: creditor.user,
      });
    }

    // Update balances
    debtor.net += amount;
    creditor.net -= amount;

    // Move to next if balance is settled
    if (Math.abs(debtor.net) < 0.01) i++;
    if (Math.abs(creditor.net) < 0.01) j++;
  }

  return suggestions;
};

// Categories
export const getCategories = (): Category[] => {
  return categories;
};
