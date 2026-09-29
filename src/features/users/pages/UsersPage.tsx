import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ErrorMessage } from '@/components/feedback/ErrorMessage';
import { ROUTES, buildUserDetailPath, buildUserEditPath } from '@/constants/routes';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { userApi } from '../api/userApi';
import { SYSTEM_ROLES, getRoleLabel } from '../constants/systemRoles';
import { ACCOUNT_STATUSES, ACCOUNT_STATUS_CONFIG } from '../constants/accountStatus';
import { filterUsers } from '../utils/userFormat';
import { UsersTable } from '../components/UsersTable';
import type { AccountStatus, SystemRole, UserListFilters } from '../types/user.types';

const ROLE_FILTER_OPTIONS = [
  { value: 'ALL', label: 'All roles' },
  ...SYSTEM_ROLES.map((role) => ({ value: role, label: getRoleLabel(role) })),
];

const STATUS_FILTER_OPTIONS = [
  { value: 'ALL', label: 'All statuses' },
  ...ACCOUNT_STATUSES.map((status) => ({ value: status, label: ACCOUNT_STATUS_CONFIG[status].label })),
];

export const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: users, loading, error, reload } = useAsyncResource(() => userApi.getUsers(), []);
  const [filters, setFilters] = useState<UserListFilters>({ search: '', role: 'ALL', status: 'ALL' });

  const filteredUsers = useMemo(() => filterUsers(users ?? [], filters), [users, filters]);
  const hasActiveFilters = filters.search !== '' || filters.role !== 'ALL' || filters.status !== 'ALL';

  return (
    <PageContainer
      title="User Accounts"
      subtitle="Administer AMS user accounts, account status and role assignments."
      actions={
        <Button variant="primary" leftIcon={<UserPlus size={16} />} onClick={() => navigate(ROUTES.USER_CREATE)}>
          Create User
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Card padding="md">
          <div
            role="search"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}
          >
            <Input
              label="Search"
              placeholder="Name or email"
              leftIcon={<Search size={16} />}
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
            <Select
              label="Role"
              options={ROLE_FILTER_OPTIONS}
              value={filters.role}
              onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value as SystemRole | 'ALL' }))}
            />
            <Select
              label="Account Status"
              options={STATUS_FILTER_OPTIONS}
              value={filters.status}
              searchable={false}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as AccountStatus | 'ALL' }))}
            />
          </div>
        </Card>

        {error ? (
          <ErrorMessage title="Could not load users" message={error} onRetry={reload} />
        ) : (
          <>
            {!loading && (
              <div
                aria-live="polite"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-muted)',
                }}
              >
                <span>
                  Showing {filteredUsers.length} of {users?.length ?? 0} users
                </span>
                {hasActiveFilters && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setFilters({ search: '', role: 'ALL', status: 'ALL' })}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
            <UsersTable
              users={filteredUsers}
              isLoading={loading}
              emptyText={hasActiveFilters ? 'No users match the selected filters.' : 'No user accounts have been created yet.'}
              onView={(user) => navigate(buildUserDetailPath(user.id))}
              onEdit={(user) => navigate(buildUserEditPath(user.id))}
            />
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default UsersPage;
