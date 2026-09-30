import React from 'react';
import { Check, Eye, X, Home, Building } from 'lucide-react';
import { Table, type Column } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/date';
import type { RegistrationRequest } from '../types/registration.types';
import { RegistrationStatusBadge } from './RegistrationStatusBadge';

export interface RegistrationTableProps {
  requests: RegistrationRequest[];
  isLoading: boolean;
  emptyText: string;
  onView: (request: RegistrationRequest) => void;
  onApprove: (request: RegistrationRequest) => void;
  onReject: (request: RegistrationRequest) => void;
}

export const RegistrationTable: React.FC<RegistrationTableProps> = ({
  requests,
  isLoading,
  emptyText,
  onView,
  onApprove,
  onReject,
}) => {
  const columns: Column<RegistrationRequest>[] = [
    {
      key: 'applicant',
      header: 'Applicant',
      render: (req) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem', minWidth: '180px' }}>
          <span style={{ fontWeight: 600 }}>{`${req.firstName} ${req.lastName}`}</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{req.email}</span>
          {req.phone && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{req.phone}</span>
          )}
        </div>
      ),
    },
    {
      key: 'requestedRole',
      header: 'Requested Role',
      render: (req) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          {req.requestedRole === 'OWNER' ? (
            <Badge variant="brand" size="sm">
              <Building size={12} style={{ marginRight: '4px' }} /> Property Owner
            </Badge>
          ) : (
            <Badge variant="info" size="sm">
              <Home size={12} style={{ marginRight: '4px' }} /> Tenant / Resident
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (req) => <RegistrationStatusBadge status={req.status} />,
    },
    {
      key: 'createdAt',
      header: 'Submitted Date',
      render: (req) => <span style={{ whiteSpace: 'nowrap' }}>{formatDate(req.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      render: (req) => (
        <div style={{ display: 'inline-flex', gap: '0.375rem', alignItems: 'center' }}>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Eye size={14} />}
            onClick={() => onView(req)}
            aria-label={`View details for ${req.firstName} ${req.lastName}`}
          >
            Details
          </Button>

          {req.status === 'PENDING' && (
            <>
              <Button
                size="sm"
                variant="danger"
                leftIcon={<X size={14} />}
                onClick={() => onReject(req)}
                aria-label={`Reject ${req.firstName} ${req.lastName}`}
              >
                Reject
              </Button>
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Check size={14} />}
                onClick={() => onApprove(req)}
                aria-label={`Approve ${req.firstName} ${req.lastName}`}
              >
                Approve
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={requests}
      keyExtractor={(req) => req.id}
      isLoading={isLoading}
      emptyText={emptyText}
    />
  );
};
