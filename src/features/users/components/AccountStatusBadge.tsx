import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { ACCOUNT_STATUS_CONFIG } from '../constants/accountStatus';
import type { AccountStatus } from '../types/user.types';

export const AccountStatusBadge: React.FC<{ status: AccountStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'sm',
}) => {
  const config = ACCOUNT_STATUS_CONFIG[status];
  return (
    <Badge variant={config.badgeVariant} size={size} dot>
      {config.label}
    </Badge>
  );
};
