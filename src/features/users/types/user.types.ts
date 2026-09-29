export type SystemRole =
  | 'SYSTEM_ADMINISTRATOR'
  | 'APARTMENT_MANAGER'
  | 'OWNER'
  | 'TENANT_RESIDENT'
  | 'FINANCE_OFFICER'
  | 'MAINTENANCE_COORDINATOR'
  | 'TECHNICIAN'
  | 'SECURITY_OFFICER';

// Status names are only referenced through ACCOUNT_STATUS_CONFIG so they can be
// renamed in one place once the backend naming is finalised.
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'LOCKED';

export interface UserAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roles: SystemRole[];
  status: AccountStatus;
  createdAt: string;
  /** Set while an email change is waiting for verification. */
  pendingEmail?: string;
}

export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roles: SystemRole[];
  status: AccountStatus;
}

export type CreateUserRequest = UserFormValues;
export type UpdateUserRequest = Omit<UserFormValues, 'roles'>;

export interface UserListFilters {
  search: string;
  role: SystemRole | 'ALL';
  status: AccountStatus | 'ALL';
}
