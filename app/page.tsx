'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/minikit';
import { FrameHeader } from '../components/FrameHeader';
import { TripDashboard } from '../components/TripDashboard';
import { CreateTripModal } from '../components/CreateTripModal';
import { AddExpenseModal } from '../components/AddExpenseModal';
import { Button } from '../components/ui/Button';
import { Plus, Users } from 'lucide-react';
import type { Trip, User, Expense } from '../lib/types';

export default function HomePage() {
  const { context } = useMiniKit();
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock user data from MiniKit context
  const currentUser: User = {
    userId: context?.user?.fid?.toString() || 'user-1',
    farcasterId: context?.user?.fid || 1,
    displayName: context?.user?.displayName || 'Anonymous',
    walletAddress: context?.user?.custody || '0x...',
  };

  useEffect(() => {
    // Simulate loading initial data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCreateTrip = (tripData: Omit<Trip, 'tripId'>) => {
    const newTrip: Trip = {
      ...tripData,
      tripId: `trip-${Date.now()}`,
      members: [currentUser.userId],
    };
    
    setTrips(prev => [...prev, newTrip]);
    setCurrentTrip(newTrip);
    setShowCreateTrip(false);
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'expenseId' | 'timestamp'>) => {
    if (!currentTrip) return;

    const newExpense: Expense = {
      ...expenseData,
      expenseId: `expense-${Date.now()}`,
      timestamp: new Date(),
    };

    setExpenses(prev => [...prev, newExpense]);
    setShowAddExpense(false);
  };

  const tripExpenses = expenses.filter(expense => expense.tripId === currentTrip?.tripId);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <FrameHeader 
        title="TripSharer"
        user={currentUser}
      />

      {!currentTrip ? (
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-text-primary mb-2">
              Welcome to TripSharer
            </h2>
            <p className="text-text-secondary">
              Split travel costs effortlessly with your friends
            </p>
          </div>

          {/* Recent Trips */}
          {trips.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Trips</h3>
              <div className="space-y-2">
                {trips.map(trip => (
                  <div
                    key={trip.tripId}
                    className="card cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={() => setCurrentTrip(trip)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{trip.name}</h4>
                        <p className="text-sm text-text-secondary">
                          {trip.startDate} - {trip.endDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-text-secondary">
                          {trip.members.length} members
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create Trip Button */}
          <Button
            variant="primary"
            onClick={() => setShowCreateTrip(true)}
            className="w-full"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Trip
          </Button>
        </div>
      ) : (
        <TripDashboard
          trip={currentTrip}
          expenses={tripExpenses}
          currentUser={currentUser}
          onAddExpense={() => setShowAddExpense(true)}
          onBackToTrips={() => setCurrentTrip(null)}
        />
      )}

      {/* Modals */}
      {showCreateTrip && (
        <CreateTripModal
          onClose={() => setShowCreateTrip(false)}
          onSubmit={handleCreateTrip}
        />
      )}

      {showAddExpense && currentTrip && (
        <AddExpenseModal
          trip={currentTrip}
          currentUser={currentUser}
          onClose={() => setShowAddExpense(false)}
          onSubmit={handleAddExpense}
        />
      )}
    </div>
  );
}
