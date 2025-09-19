'use client';

import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'currency';
}

export function Input({ variant = 'default', className, ...props }: InputProps) {
  const baseStyles = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200';
  
  const variants = {
    default: '',
    currency: 'text-right font-mono',
  };

  return (
    <input
      className={cn(
        baseStyles,
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
