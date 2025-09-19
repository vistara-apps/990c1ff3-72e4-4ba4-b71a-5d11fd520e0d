import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Expense, Balance, Settlement } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function calculateBalances(expenses: Expense[], memberIds: string[]): Balance[] {
  const balances: Record<string, Balance> = {};
  
  // Initialize balances
  memberIds.forEach(userId => {
    balances[userId] = {
      userId,
      owes: 0,
      owed: 0,
      net: 0,
    };
  });

  // Calculate balances from expenses
  expenses.forEach(expense => {
    const splitAmount = expense.amount / expense.splitAmongUserIds.length;
    
    // Person who paid is owed money
    balances[expense.paidByUserId].owed += expense.amount;
    
    // Each person in the split owes their share
    expense.splitAmongUserIds.forEach(userId => {
      balances[userId].owes += splitAmount;
    });
  });

  // Calculate net balances
  Object.values(balances).forEach(balance => {
    balance.net = balance.owed - balance.owes;
  });

  return Object.values(balances);
}

export function calculateSettlements(balances: Balance[]): Settlement[] {
  const settlements: Settlement[] = [];
  const debtors = balances.filter(b => b.net < 0).sort((a, b) => a.net - b.net);
  const creditors = balances.filter(b => b.net > 0).sort((a, b) => b.net - a.net);

  let i = 0, j = 0;
  
  while (i < debtors.length && j < creditors.length) {
    const debt = Math.abs(debtors[i].net);
    const credit = creditors[j].net;
    const amount = Math.min(debt, credit);

    if (amount > 0.01) { // Avoid tiny settlements
      settlements.push({
        fromUserId: debtors[i].userId,
        toUserId: creditors[j].userId,
        amount,
      });
    }

    debtors[i].net += amount;
    creditors[j].net -= amount;

    if (Math.abs(debtors[i].net) < 0.01) i++;
    if (Math.abs(creditors[j].net) < 0.01) j++;
  }

  return settlements;
}

export function getTotalExpenses(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

export function getUserExpenses(expenses: Expense[], userId: string): Expense[] {
  return expenses.filter(expense => 
    expense.paidByUserId === userId || 
    expense.splitAmongUserIds.includes(userId)
  );
}
