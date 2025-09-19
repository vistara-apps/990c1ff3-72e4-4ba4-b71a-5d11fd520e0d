'use client';

import { useState } from 'react';
import { X, Calendar, MapPin } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import type { Trip } from '../lib/types';

interface CreateTripModalProps {
  onClose: () => void;
  onSubmit: (trip: Omit<Trip, 'tripId'>) => void;
}

export function CreateTripModal({ onClose, onSubmit }: CreateTripModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.startDate || !formData.endDate) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      onSubmit({
        name: formData.name.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        members: [], // Will be populated with current user
      });
    } catch (error) {
      console.error('Error creating trip:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-text-primary">Create New Trip</h2>
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
              <MapPin className="w-4 h-4 inline mr-1" />
              Trip Name
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="e.g., Weekend in Paris"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Start Date
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={handleChange('startDate')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                End Date
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={handleChange('endDate')}
                min={formData.startDate}
                required
              />
            </div>
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
              disabled={isSubmitting || !formData.name.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create Trip'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
