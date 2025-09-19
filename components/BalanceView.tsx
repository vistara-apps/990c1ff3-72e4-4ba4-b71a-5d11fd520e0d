'use client';

import { ArrowRight, CheckCircle } from 'lucide-react';
import { formatCurrency, calculateSettlements } from '../lib/utils';
import { Button } from './ui/Button';
import type { Balance, User } from '../lib/types';

interface BalanceViewProps {
  balances: Balance[];
  currentUser: User;
}

export function BalanceView({ balances, currentUser }: BalanceViewProps) {
  const settlements = calculateSettlements(balances);
  const userSettlements = settlements.filter(
    s => s.fromUserId === currentUser.userId || s.toUserId === currentUser.userId
  );

  return (
    <div className="space-y-6">
      {/* User's Balance Summary */}
      <div className="card">
        <h3 className="font-semibold text-text-primary mb-4">Your Balance</h3>
        {balances.map(balance => {
          if (balance.userId !== currentUser.userId) return null;
          
          return (
            <div key={balance.userId} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">You paid:</span>
                <span className="font-medium">{formatCurrency(balance.owed)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Your share:</span>
                <span className="font-medium">{formatCurrency(balance.owes)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="font-semibold">Net balance:</span>
                <span className={`font-semibold text-lg ${
                  balance.net > 0 
                    ? 'text-accent' 
                    : balance.net < 0 
                      ? 'text-red-500' 
                      : 'text-text-primary'
                }`}>
                  {balance.net > 0 && '+'}
                  {formatCurrency(balance.net)}
                </span>
              </div>
              {balance.net > 0 && (
                <p className="text-sm text-accent">You are owed money</p>
              )}
              {balance.net < 0 && (
                <p className="text-sm text-red-500">You owe money</p>
              )}
              {balance.net === 0 && (
                <p className="text-sm text-text-secondary">You're all settled up!</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Settlement Suggestions */}
      {settlements.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-text-primary mb-4">Settlement Suggestions</h3>
          <div className="space-y-3">
            {settlements.map((settlement, index) => {
              const isUserInvolved = 
                settlement.fromUserId === currentUser.userId || 
                settlement.toUserId === currentUser.userId;
              
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    isUserInvolved 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {settlement.fromUserId === currentUser.userId 
                            ? 'You' 
                            : `User ${settlement.fromUserId}`}
                        </span>
                        <ArrowRight className="w-4 h-4 text-text-secondary" />
                        <span className="font-medium">
                          {settlement.toUserId === currentUser.userId 
                            ? 'You' 
                            : `User ${settlement.toUserId}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold">
                        {formatCurrency(settlement.amount)}
                      </span>
                      {isUserInvolved && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement settlement marking
                            console.log('Mark as settled:', settlement);
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Settle
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Balances */}
      <div className="card">
        <h3 className="font-semibold text-text-primary mb-4">All Member Balances</h3>
        <div className="space-y-3">
          {balances.map(balance => (
            <div
              key={balance.userId}
              className={`flex justify-between items-center p-3 rounded-lg ${
                balance.userId === currentUser.userId 
                  ? 'bg-primary/5 border border-primary/20' 
                  : 'bg-gray-50'
              }`}
            >
              <div>
                <span className="font-medium">
                  {balance.userId === currentUser.userId 
                    ? 'You' 
                    : `User ${balance.userId}`}
                </span>
                {balance.userId === currentUser.userId && (
                  <span className="ml-2 text-xs text-primary">(You)</span>
                )}
              </div>
              <div className="text-right">
                <span className={`font-semibold ${
                  balance.net > 0 
                    ? 'text-accent' 
                    : balance.net < 0 
                      ? 'text-red-500' 
                      : 'text-text-primary'
                }`}>
                  {balance.net > 0 && '+'}
                  {formatCurrency(balance.net)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {settlements.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
          <p className="text-text-primary font-medium">All settled up!</p>
          <p className="text-sm text-text-secondary">
            Everyone's balances are even
          </p>
        </div>
      )}
    </div>
  );
}
