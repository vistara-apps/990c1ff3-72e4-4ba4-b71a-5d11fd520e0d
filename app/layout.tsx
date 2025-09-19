import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'TripSharer - Split travel costs effortlessly',
  description: 'Split travel costs effortlessly, track expenses transparently, and settle up with friends.',
  openGraph: {
    title: 'TripSharer',
    description: 'Split travel costs effortlessly, track expenses transparently, and settle up with friends.',
    type: 'website',
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': '/api/og',
    'fc:frame:button:1': 'Start Splitting',
    'fc:frame:post_url': '/api/frame',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-bg">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
