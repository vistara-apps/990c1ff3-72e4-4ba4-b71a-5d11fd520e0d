'use client';

import { useState } from 'react';
import { Plus, Receipt, Users, DollarSign } from 'lucide-react';
import { Button } from './ui/Button';
import { ExpenseCard } from './ExpenseCard';
import { BalanceView } from './BalanceView';
import { formatCurrency, getTotalExpenses, calculateBalances } from '../lib/utils';
import type { Trip, Expense, User } from '../lib/types';

interface TripDashboardProps {
  trip: Trip;
  expenses: Expense[];
  currentUser: User;
  onAddExpense: () => void;
  onBackToTrips: () => void;
}

type TabType = 'expenses' | 'balances';

export function TripDashboard({ 
  trip, 
  expenses, 
  currentUser, 
  onAddExpense, 
  onBackToTrips 
}: TripDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('expenses');
  
  const totalExpenses = getTotalExpenses(expenses);
  const balances = calculateBalances(expenses, trip.members);
  const userBalance = balances.find(b => b.userId === currentUser.userId);

  return (
    <div className="space-y-6">
      {/* Trip Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">{trip.name}</h2>
            <p className="text-sm text-text-secondary">
              {trip.startDate} - {trip.endDate}
            </p>
          </div>
          <button
            onClick={onBackToTrips}
            className="text-sm text-primary hover:underline"
          >
            Back to trips
          </button>
        </div>

        {/* Trip Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <p className="text-lg font-semibold text-text-primary">
              {formatCurrency(totalExpenses)}
            </p>
            <p className="text-xs text-text-secondary">Total spent</p>
          </div>
          
          <div className="text-center">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Receipt className="w-5 h-5 text-accent" />
            </div>
            <p className="text-lg font-semibold text-text-primary">
              {expenses.length}
            </p>
            <p className="text-xs text-text-secondary">Expenses</p>
          </div>
          
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-lg font-semibold text-text-primary">
              {trip.members.length}
            </p>
            <p className="text-xs text-text-secondary">Members</p>
          </div>
        </div>

        {/* User Balance Summary */}
        {userBalance && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Your balance:</span>
              <span className={`font-semibold ${
                userBalance.net > 0 
                  ? 'text-accent' 
                  : userBalance.net < 0 
                    ? 'text-red-500' 
                    : 'text-text-primary'
              }`}>
                {userBalance.net > 0 && '+'}
                {formatCurrency(userBalance.net)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'expenses'
              ? 'bg-white text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Expenses
        </button>
        <button
          onClick={() => setActiveTab('balances')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'balances'
              ? 'bg-white text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Balances
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'expenses' ? (
          <>
            {expenses.length > 0 ? (
              <div className="space-y-3">
                {expenses.map(expense => (
                  <ExpenseCard
                    key={expense.expenseId}
                    expense={expense}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-text-secondary">No expenses yet</p>
                <p className="text-sm text-text-secondary">
                  Add your first expense to get started
                </p>
              </div>
            )}
          </>
        ) : (
          <BalanceView
            balances={balances}
            currentUser={currentUser}
          />
        )}
      </div>

      {/* Add Expense Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          variant="primary"
          onClick={onAddExpense}
          className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
