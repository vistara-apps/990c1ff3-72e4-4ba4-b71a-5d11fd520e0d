'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FrameHeader } from '@/components/layout/FrameHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileUpload } from '@/components/ui/FileUpload';
import { Category } from '@/types';

// Mock categories - in real app this would come from API
const mockCategories: Category[] = [
  { categoryId: '1', name: 'Food' },
  { categoryId: '2', name: 'Accommodation' },
  { categoryId: '3', name: 'Transport' },
  { categoryId: '4', name: 'Entertainment' },
  { categoryId: '5', name: 'Other' },
];

export default function AddExpensePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    categoryId: '',
    splitAmongUserIds: '',
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories] = useState<Category[]>(mockCategories);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would create the expense via API
      // For now, just redirect back to dashboard
      router.push('/');
    } catch (error) {
      console.error('Error creating expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (file: File) => {
    setReceiptFile(file);
  };

  const isFormValid = formData.description.trim() &&
                     formData.amount &&
                     formData.categoryId &&
                     formData.splitAmongUserIds.trim();

  return (
    <div className="min-h-screen bg-bg">
      <FrameHeader title="Add Expense" />

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
              Description *
            </label>
            <Input
              id="description"
              type="text"
              placeholder="e.g., Dinner at Italian Restaurant"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-text-primary mb-2">
              Amount *
            </label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              variant="currency"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-2">
              Category *
            </label>
            <select
              id="category"
              value={formData.categoryId}
              onChange={(e) => handleInputChange('categoryId', e.target.value)}
              className="flex h-10 w-full rounded-md border border-text-secondary/20 bg-surface px-3 py-2 text-sm ring-offset-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="splitAmong" className="block text-sm font-medium text-text-primary mb-2">
              Split Among *
            </label>
            <p className="text-xs text-text-secondary mb-2">
              Enter Farcaster usernames separated by commas (who should split this expense)
            </p>
            <Input
              id="splitAmong"
              type="text"
              placeholder="e.g., alice, bob, charlie"
              value={formData.splitAmongUserIds}
              onChange={(e) => handleInputChange('splitAmongUserIds', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Receipt Image (Optional)
            </label>
            <FileUpload onFileSelect={handleFileSelect} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !isFormValid}
              className="flex-1"
            >
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
