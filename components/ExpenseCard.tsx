'use client';

import { Receipt, User } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';
import { EXPENSE_CATEGORIES } from '../lib/types';
import type { Expense, User as UserType } from '../lib/types';

interface ExpenseCardProps {
  expense: Expense;
  currentUser: UserType;
  variant?: 'default' | 'summary';
}

export function ExpenseCard({ expense, currentUser, variant = 'default' }: ExpenseCardProps) {
  const category = EXPENSE_CATEGORIES.find(c => c.categoryId === expense.categoryId);
  const isPaidByUser = expense.paidByUserId === currentUser.userId;
  const isUserInSplit = expense.splitAmongUserIds.includes(currentUser.userId);
  const userShare = expense.amount / expense.splitAmongUserIds.length;

  if (variant === 'summary') {
    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Receipt className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-sm">{expense.description}</p>
            <p className="text-xs text-text-secondary">{category?.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-sm">{formatCurrency(expense.amount)}</p>
          {isUserInSplit && (
            <p className="text-xs text-text-secondary">
              Your share: {formatCurrency(userShare)}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Receipt className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-text-primary">{expense.description}</h4>
            <p className="text-sm text-text-secondary">{category?.name}</p>
            <p className="text-xs text-text-secondary">
              {formatDate(expense.timestamp)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-text-primary">
            {formatCurrency(expense.amount)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-text-secondary" />
          <span className="text-sm text-text-secondary">
            Paid by {isPaidByUser ? 'you' : 'someone else'}
          </span>
        </div>
        
        {isUserInSplit && (
          <div className="text-right">
            <p className="text-sm font-medium text-text-primary">
              Your share: {formatCurrency(userShare)}
            </p>
          </div>
        )}
      </div>

      {expense.receiptImageUrl && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Receipt className="w-4 h-4" />
            <span>Receipt attached</span>
          </div>
        </div>
      )}
    </div>
  );
}
