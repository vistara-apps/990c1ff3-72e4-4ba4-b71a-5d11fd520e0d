'use client';

import { useState } from 'react';
import { X, DollarSign, Tag, Upload, Users } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { FileUpload } from './ui/FileUpload';
import { EXPENSE_CATEGORIES } from '../lib/types';
import type { Trip, User, Expense } from '../lib/types';

interface AddExpenseModalProps {
  trip: Trip;
  currentUser: User;
  onClose: () => void;
  onSubmit: (expense: Omit<Expense, 'expenseId' | 'timestamp'>) => void;
}

export function AddExpenseModal({ trip, currentUser, onClose, onSubmit }: AddExpenseModalProps) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    categoryId: 'food',
    paidByUserId: currentUser.userId,
    splitAmongUserIds: trip.members,
    receiptImageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.amount || parseFloat(formData.amount) <= 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      onSubmit({
        tripId: trip.tripId,
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId,
        paidByUserId: formData.paidByUserId,
        splitAmongUserIds: formData.splitAmongUserIds,
        receiptImageUrl: formData.receiptImageUrl || undefined,
      });
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleReceiptUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      receiptImageUrl: url,
    }));
  };

  const toggleMemberInSplit = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      splitAmongUserIds: prev.splitAmongUserIds.includes(userId)
        ? prev.splitAmongUserIds.filter(id => id !== userId)
        : [...prev.splitAmongUserIds, userId],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-text-primary">Add Expense</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description
            </label>
            <Input
              type="text"
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="e.g., Dinner at restaurant"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Amount
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange('amount')}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={handleChange('categoryId')}
              className="input-field"
            >
              {EXPENSE_CATEGORIES.map(category => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Who paid?
            </label>
            <select
              value={formData.paidByUserId}
              onChange={handleChange('paidByUserId')}
              className="input-field"
            >
              {trip.members.map(memberId => (
                <option key={memberId} value={memberId}>
                  {memberId === currentUser.userId ? 'You' : `User ${memberId}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Split among
            </label>
            <div className="space-y-2">
              {trip.members.map(memberId => (
                <label key={memberId} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.splitAmongUserIds.includes(memberId)}
                    onChange={() => toggleMemberInSplit(memberId)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">
                    {memberId === currentUser.userId ? 'You' : `User ${memberId}`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              <Upload className="w-4 h-4 inline mr-1" />
              Receipt (Optional)
            </label>
            <FileUpload
              variant="receipt"
              onUpload={handleReceiptUpload}
              currentUrl={formData.receiptImageUrl}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={
                isSubmitting || 
                !formData.description.trim() || 
                !formData.amount || 
                parseFloat(formData.amount) <= 0 ||
                formData.splitAmongUserIds.length === 0
              }
            >
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
