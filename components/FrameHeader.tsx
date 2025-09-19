'use client';

import { ArrowLeft, Settings } from 'lucide-react';
import type { User } from '../lib/types';

interface FrameHeaderProps {
  title: string;
  user: User;
  onBack?: () => void;
  showSettings?: boolean;
}

export function FrameHeader({ title, user, onBack, showSettings = false }: FrameHeaderProps) {
  return (
    <header className="flex items-center justify-between py-4 mb-6">
      <div className="flex items-center space-x-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-text-primary">
              {user.displayName}
            </p>
            <p className="text-xs text-text-secondary">
              FID: {user.farcasterId}
            </p>
          </div>
        </div>
        
        {showSettings && (
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}
