import React from 'react';
import { Eye, Pencil } from 'lucide-react';
import { Table, type Column } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/date';
import { getFullName } from '../utils/userFormat';
import type { UserAccount } from '../types/user.types';
import { AccountStatusBadge } from './AccountStatusBadge';
import { RoleBadges } from './RoleBadges';

export interface UsersTableProps {
  users: UserAccount[];
  isLoading: boolean;
  emptyText: string;
  onView: (user: UserAccount) => void;
  onEdit: (user: UserAccount) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, isLoading, emptyText, onView, onEdit }) => {
  const columns: Column<UserAccount>[] = [
    {
      key: 'name',
      header: 'User',
      render: (user) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem', minWidth: '180px' }}>
          <span style={{ fontWeight: 600 }}>{getFullName(user)}</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{user.email}</span>
        </div>
      ),
    },
    {
      key: 'roles',
      header: 'Roles',
      render: (user) => (
        <div style={{ minWidth: '160px' }}>
          <RoleBadges roles={user.roles} />
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => <AccountStatusBadge status={user.status} />,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (user) => <span style={{ whiteSpace: 'nowrap' }}>{formatDate(user.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      render: (user) => (
        <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Eye size={14} />}
            onClick={() => onView(user)}
            aria-label={`View ${getFullName(user)}`}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Pencil size={14} />}
            onClick={() => onEdit(user)}
            aria-label={`Edit ${getFullName(user)}`}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={users}
      keyExtractor={(user) => user.id}
      isLoading={isLoading}
      emptyText={emptyText}
    />
  );
};
