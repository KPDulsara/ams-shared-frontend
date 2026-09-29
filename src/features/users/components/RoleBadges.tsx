import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { getRoleLabel } from '../constants/systemRoles';
import type { SystemRole } from '../types/user.types';

export interface RoleBadgesProps {
  roles: SystemRole[];
  emptyText?: string;
}

export const RoleBadges: React.FC<RoleBadgesProps> = ({ roles, emptyText = 'No roles assigned' }) => {
  if (roles.length === 0) {
    return (
      <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
        {emptyText}
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
      {roles.map((role) => (
        <Badge key={role} variant="brand" size="sm">
          {getRoleLabel(role)}
        </Badge>
      ))}
    </div>
  );
};
