import { NextRequest, NextResponse } from 'next/server';
import { createExpense } from '@/lib/data-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tripId, description, amount, paidByUserId, categoryId, receiptImageUrl, splitAmongUserIds } = body;

    if (!tripId || !description || !amount || !paidByUserId || !categoryId || !splitAmongUserIds) {
      return NextResponse.json(
        { error: 'Missing required fields: tripId, description, amount, paidByUserId, categoryId, splitAmongUserIds' },
        { status: 400 }
      );
    }

    if (!Array.isArray(splitAmongUserIds) || splitAmongUserIds.length === 0) {
      return NextResponse.json(
        { error: 'splitAmongUserIds must be a non-empty array' },
        { status: 400 }
      );
    }

    const expense = createExpense({
      tripId,
      description,
      amount: parseFloat(amount),
      paidByUserId,
      categoryId,
      receiptImageUrl,
      splitAmongUserIds,
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

