import { ReactNode } from 'react';

interface FrameHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function FrameHeader({ title, subtitle, children }: FrameHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-text-secondary/10">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
        {subtitle && (
          <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}

