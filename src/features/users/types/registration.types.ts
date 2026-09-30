export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type RegistrationRole = 'OWNER' | 'TENANT';

export interface RegistrationRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  requestedRole: RegistrationRole;
  status: RegistrationStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface RegistrationListFilters {
  search: string;
  status: RegistrationStatus | 'ALL';
  requestedRole: RegistrationRole | 'ALL';
}
