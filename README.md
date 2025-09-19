# TripSharer - Base Mini App

Split travel costs effortlessly, track expenses transparently, and settle up with friends.

## Features

- **Real-time Expense Entry**: Quickly add expenses and assign amounts to trip members
- **Shared Trip Ledger**: Central, transparent view of all trip expenses
- **Automated Settlement Suggestions**: Smart calculations for who owes whom
- **Receipt Archiving**: Upload photos of receipts for verification

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base Network integration via MiniKit
- **Styling**: Tailwind CSS with custom design system
- **Identity**: Farcaster integration for social primitives
- **Components**: OnchainKit for Web3 functionality

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Add your OnchainKit API key from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main application page
│   ├── providers.tsx      # MiniKit and OnchainKit providers
│   └── globals.css        # Global styles and Tailwind
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── FrameHeader.tsx   # App header component
│   ├── TripDashboard.tsx # Main trip management interface
│   └── ...               # Other feature components
├── lib/                  # Utilities and types
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## Key Components

### Data Models

- **Trip**: Core trip entity with members and dates
- **User**: Farcaster-integrated user with wallet
- **Expense**: Individual expense with splitting logic
- **Category**: Expense categorization system

### Core Features

1. **Trip Management**: Create and manage group trips
2. **Expense Tracking**: Add expenses with automatic splitting
3. **Balance Calculation**: Real-time balance and settlement calculations
4. **Receipt Storage**: Upload and attach receipt images

## Base Mini App Integration

This app is built as a Base Mini App with:

- **MiniKit Provider**: Handles Base network and wallet connections
- **Farcaster Identity**: Social login and user identification
- **Frame Actions**: In-app interactions optimized for Base App
- **OnchainKit Components**: Web3-native UI components

## Development

### Adding New Features

1. Define types in `lib/types.ts`
2. Create components in `components/`
3. Add utility functions in `lib/utils.ts`
4. Update the main page logic in `app/page.tsx`

### Styling Guidelines

- Use the custom design system defined in `tailwind.config.js`
- Follow mobile-first responsive design
- Maintain consistency with Base App design patterns

## Deployment

The app is optimized for deployment on Vercel or similar platforms that support Next.js 15.

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to your preferred platform
3. Update the manifest.json with your production URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
