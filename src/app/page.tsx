'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FrameHeader } from '@/components/layout/FrameHeader';
import { Button } from '@/components/ui/Button';
import { ExpenseCard } from '@/components/expense/ExpenseCard';
import { MemberListItem } from '@/components/trip/MemberListItem';
import { TripWithDetails, User } from '@/types';

// Mock data for development - in production this would come from Base SDK
const mockUser: User = {
  userId: 'user_1',
  farcasterId: 'alice',
  displayName: 'Alice Johnson',
  walletAddress: '0x1234567890123456789012345678901234567890',
};

const mockTrip: TripWithDetails = {
  tripId: 'trip_1',
  name: 'Europe Adventure 2024',
  startDate: '2024-07-01',
  endDate: '2024-07-15',
  members: [mockUser],
  createdAt: '2024-06-01T00:00:00Z',
  createdBy: 'user_1',
  expenses: [],
  totalExpenses: 0,
  balances: [],
};

export default function TripDashboard() {
  const router = useRouter();
  const [trip, setTrip] = useState<TripWithDetails | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'expenses' | 'balances'>('expenses');

  useEffect(() => {
    // In a real Base Mini App, this would get user data from Base SDK
    setCurrentUser(mockUser);
    setTrip(mockTrip);
  }, []);

  if (!trip || !currentUser) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading TripSharer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <FrameHeader
        title={trip.name}
        subtitle={`${trip.members.length} members • $${trip.totalExpenses.toFixed(2)} total`}
      >
        <Button variant="primary" size="sm" onClick={() => router.push('/add-expense')}>
          Add Expense
        </Button>
      </FrameHeader>

      <div className="p-4">
        {/* Tab Navigation */}
        <div className="flex bg-surface rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'expenses'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Expenses ({trip.expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('balances')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'balances'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Balances
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'expenses' && (
          <div className="space-y-4">
            {trip.expenses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-text-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">No expenses yet</h3>
                <p className="text-text-secondary mb-4">Start by adding your first expense to the trip.</p>
                <Button variant="primary" onClick={() => router.push('/add-expense')}>Add First Expense</Button>
              </div>
            ) : (
              trip.expenses.map((expense) => (
                <ExpenseCard key={expense.expenseId} expense={expense} />
              ))
            )}
          </div>
        )}

        {activeTab === 'balances' && (
          <div className="space-y-4">
            <div className="bg-surface rounded-lg p-4 border border-text-secondary/10">
              <h3 className="font-semibold text-text-primary mb-3">Trip Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-secondary">Total Expenses</p>
                  <p className="text-lg font-bold text-text-primary">${trip.totalExpenses.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Members</p>
                  <p className="text-lg font-bold text-text-primary">{trip.members.length}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-text-primary">Member Balances</h3>
              {trip.balances.map((balance) => (
                <MemberListItem
                  key={balance.userId}
                  user={balance.user}
                  variant="balance"
                  balance={balance}
                />
              ))}
            </div>

            {trip.balances.some(b => b.net !== 0) && (
              <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                <h3 className="font-semibold text-text-primary mb-2">Settlement Suggestions</h3>
                <p className="text-sm text-text-secondary mb-3">
                  Here are the simplest ways to settle up:
                </p>
                <div className="space-y-2">
                  {/* This would be populated with actual settlement suggestions */}
                  <p className="text-sm text-text-secondary italic">
                    No settlements needed - everyone is settled up!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
