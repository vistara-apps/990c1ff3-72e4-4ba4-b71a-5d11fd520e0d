'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FrameHeader } from '@/components/layout/FrameHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function NewTripPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    memberFarcasterIds: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would create the trip via API
      // For now, just redirect back to dashboard
      router.push('/');
    } catch (error) {
      console.error('Error creating trip:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-bg">
      <FrameHeader title="Create New Trip" />

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
              Trip Name *
            </label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Europe Adventure 2024"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-text-primary mb-2">
                Start Date
              </label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-text-primary mb-2">
                End Date
              </label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="members" className="block text-sm font-medium text-text-primary mb-2">
              Trip Members
            </label>
            <p className="text-xs text-text-secondary mb-2">
              Enter Farcaster usernames separated by commas (leave empty to add members later)
            </p>
            <Input
              id="members"
              type="text"
              placeholder="e.g., alice, bob, charlie"
              value={formData.memberFarcasterIds}
              onChange={(e) => handleInputChange('memberFarcasterIds', e.target.value)}
            />
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
              disabled={isSubmitting || !formData.name.trim()}
              className="flex-1"
            >
              {isSubmitting ? 'Creating...' : 'Create Trip'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

