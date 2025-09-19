import { User, Balance } from '@/types';

interface MemberListItemProps {
  user: User;
  variant?: 'default' | 'balance';
  balance?: Balance;
}

export function MemberListItem({ user, variant = 'default', balance }: MemberListItemProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  if (variant === 'balance' && balance) {
    const isOwed = balance.net > 0;
    const isOwes = balance.net < 0;

    return (
      <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-text-secondary/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            {user.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-text-primary">{user.displayName}</p>
            <p className="text-xs text-text-secondary">@{user.farcasterId}</p>
          </div>
        </div>
        <div className="text-right">
          {isOwed && (
            <div className="text-green-600">
              <p className="font-semibold">+{formatCurrency(balance.net)}</p>
              <p className="text-xs">owed to you</p>
            </div>
          )}
          {isOwes && (
            <div className="text-red-600">
              <p className="font-semibold">-{formatCurrency(Math.abs(balance.net))}</p>
              <p className="text-xs">you owe</p>
            </div>
          )}
          {balance.net === 0 && (
            <div className="text-text-secondary">
              <p className="font-semibold">{formatCurrency(0)}</p>
              <p className="text-xs">settled</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-text-secondary/10">
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
        {user.displayName.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className="font-medium text-text-primary">{user.displayName}</p>
        <p className="text-xs text-text-secondary">@{user.farcasterId}</p>
      </div>
    </div>
  );
}

