import Image from 'next/image';
import { ExpenseWithDetails } from '@/types';

interface ExpenseCardProps {
  expense: ExpenseWithDetails;
  variant?: 'default' | 'summary';
}

export function ExpenseCard({ expense, variant = 'default' }: ExpenseCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (variant === 'summary') {
    return (
      <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-text-secondary/10">
        <div className="flex-1">
          <p className="font-medium text-text-primary">{expense.description}</p>
          <p className="text-sm text-text-secondary">
            {expense.paidBy.displayName} • {expense.category.name}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-text-primary">{formatCurrency(expense.amount)}</p>
          <p className="text-xs text-text-secondary">{formatDate(expense.timestamp)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-surface rounded-lg border border-text-secondary/10 shadow-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary">{expense.description}</h3>
          <p className="text-sm text-text-secondary mt-1">
            Paid by {expense.paidBy.displayName} • {expense.category.name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary">{formatCurrency(expense.amount)}</p>
          <p className="text-xs text-text-secondary">{formatDate(expense.timestamp)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-text-secondary">Split among:</span>
          <div className="flex -space-x-2">
            {expense.splitAmong.slice(0, 3).map((user) => (
              <div
                key={user.userId}
                className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs text-white font-medium border-2 border-surface"
                title={user.displayName}
              >
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            ))}
            {expense.splitAmong.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-text-secondary/20 flex items-center justify-center text-xs text-text-secondary border-2 border-surface">
                +{expense.splitAmong.length - 3}
              </div>
            )}
          </div>
        </div>
        <div className="text-text-secondary">
          {formatCurrency(expense.amount / expense.splitAmong.length)} each
        </div>
      </div>

      {expense.receiptImageUrl && (
        <div className="mt-3">
          <Image
            src={expense.receiptImageUrl}
            alt="Receipt"
            width={400}
            height={128}
            className="w-full h-32 object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
}
