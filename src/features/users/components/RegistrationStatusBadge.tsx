import React from 'react';
import { Badge, type BadgeProps } from '@/components/ui/Badge';
import type { RegistrationStatus } from '../types/registration.types';

export interface RegistrationStatusBadgeProps {
  status: RegistrationStatus;
}

const CONFIG: Record<RegistrationStatus, { label: string; variant: BadgeProps['variant'] }> = {
  PENDING: { label: 'Pending Review', variant: 'warning' },
  APPROVED: { label: 'Approved', variant: 'success' },
  REJECTED: { label: 'Rejected', variant: 'danger' },
};

export const RegistrationStatusBadge: React.FC<RegistrationStatusBadgeProps> = ({ status }) => {
  const { label, variant } = CONFIG[status] ?? { label: status, variant: 'neutral' };
  return <Badge variant={variant}>{label}</Badge>;
};
