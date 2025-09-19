import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByFarcasterId } from '@/lib/data-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { farcasterId, displayName, walletAddress } = body;

    if (!farcasterId || !displayName || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: farcasterId, displayName, walletAddress' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = getUserByFarcasterId(farcasterId);
    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Create new user
    const user = createUser({
      farcasterId,
      displayName,
      walletAddress,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farcasterId = searchParams.get('farcasterId');

    if (!farcasterId) {
      return NextResponse.json(
        { error: 'farcasterId query parameter required' },
        { status: 400 }
      );
    }

    const user = getUserByFarcasterId(farcasterId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

