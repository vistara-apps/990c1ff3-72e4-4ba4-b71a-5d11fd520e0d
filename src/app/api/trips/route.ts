import { NextRequest, NextResponse } from 'next/server';
import { createTrip, getTripsByUserId } from '@/lib/data-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, startDate, endDate, members, createdBy } = body;

    if (!name || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields: name, createdBy' },
        { status: 400 }
      );
    }

    const trip = createTrip({
      name,
      startDate,
      endDate,
      members: members || [],
      createdBy,
    });

    return NextResponse.json(trip);
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter required' },
        { status: 400 }
      );
    }

    const trips = getTripsByUserId(userId);
    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

