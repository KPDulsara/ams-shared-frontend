import type { BadgeProps } from '@/components/ui/Badge';
import type { AccountStatus } from '../types/user.types';

export interface AccountStatusInfo {
  label: string;
  description: string;
  badgeVariant: NonNullable<BadgeProps['variant']>;
}

// Single source of truth for account status presentation.
// Rename or add statuses here when the backend contract is confirmed.
export const ACCOUNT_STATUS_CONFIG: Record<AccountStatus, AccountStatusInfo> = {
  ACTIVE: {
    label: 'Active',
    description: 'Can sign in and use the portal.',
    badgeVariant: 'success',
  },
  INACTIVE: {
    label: 'Inactive',
    description: 'Not yet activated or deactivated by an administrator.',
    badgeVariant: 'neutral',
  },
  SUSPENDED: {
    label: 'Suspended',
    description: 'Temporarily blocked by an administrator.',
    badgeVariant: 'warning',
  },
  LOCKED: {
    label: 'Locked',
    description: 'Locked after repeated failed sign-in attempts.',
    badgeVariant: 'danger',
  },
};

export const ACCOUNT_STATUSES = Object.keys(ACCOUNT_STATUS_CONFIG) as AccountStatus[];

export const DEFAULT_ACCOUNT_STATUS: AccountStatus = 'ACTIVE';
