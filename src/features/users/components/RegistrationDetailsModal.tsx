import React from 'react';
import { Mail, Phone, CalendarDays, User, Building, Home, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/date';
import type { RegistrationRequest } from '../types/registration.types';
import { RegistrationStatusBadge } from './RegistrationStatusBadge';
import { ProfileField, ProfileFieldList } from './ProfileField';

export interface RegistrationDetailsModalProps {
  request: RegistrationRequest | null;
  onClose: () => void;
  onApprove?: (request: RegistrationRequest) => void;
  onReject?: (request: RegistrationRequest) => void;
}

export const RegistrationDetailsModal: React.FC<RegistrationDetailsModalProps> = ({
  request,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!request) return null;

  const isPending = request.status === 'PENDING';

  return (
    <Modal
      isOpen={Boolean(request)}
      onClose={onClose}
      title="Registration Request Details"
      subtitle={`Submitted ${formatDate(request.createdAt)}`}
      maxWidth="540px"
      footer={
        isPending ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {onReject && (
              <Button variant="danger" onClick={() => onReject(request)}>
                Reject Request
              </Button>
            )}
            {onApprove && (
              <Button variant="primary" onClick={() => onApprove(request)}>
                Approve Request
              </Button>
            )}
          </div>
        ) : (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
              {request.firstName} {request.lastName}
            </h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{request.email}</span>
          </div>
          <RegistrationStatusBadge status={request.status} />
        </div>

        <ProfileFieldList>
          <ProfileField label="First Name" icon={<User size={15} />}>
            {request.firstName}
          </ProfileField>

          <ProfileField label="Last Name" icon={<User size={15} />}>
            {request.lastName}
          </ProfileField>

          <ProfileField label="Email Address" icon={<Mail size={15} />}>
            {request.email}
          </ProfileField>

          <ProfileField label="Phone Number" icon={<Phone size={15} />}>
            {request.phone || 'Not provided'}
          </ProfileField>

          <ProfileField label="Requested Role" icon={<Building size={15} />}>
            {request.requestedRole === 'OWNER' ? (
              <Badge variant="brand" size="sm">
                <Building size={12} style={{ marginRight: '4px' }} /> Property Owner
              </Badge>
            ) : (
              <Badge variant="info" size="sm">
                <Home size={12} style={{ marginRight: '4px' }} /> Tenant / Resident
              </Badge>
            )}
          </ProfileField>

          <ProfileField label="Date Submitted" icon={<CalendarDays size={15} />}>
            {formatDate(request.createdAt)}
          </ProfileField>

          {request.reviewedBy && (
            <ProfileField label="Reviewed By" icon={<CheckCircle2 size={15} />}>
              {request.reviewedBy} {request.reviewedAt ? `on ${formatDate(request.reviewedAt)}` : ''}
            </ProfileField>
          )}
        </ProfileFieldList>

        {request.status === 'REJECTED' && request.rejectionReason && (
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.375rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)', fontWeight: 700, fontSize: '0.875rem' }}>
              <ShieldAlert size={16} /> Rejection Reason
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
              {request.rejectionReason}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
