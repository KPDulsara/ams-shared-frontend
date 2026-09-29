export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  OWNER: 'OWNER',
  TENANT: 'TENANT',
  STAFF: 'STAFF',
  APARTMENT_MANAGER: 'APARTMENT_MANAGER',
  FINANCE_OFFICER: 'FINANCE_OFFICER',
  RESIDENT: 'RESIDENT',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Export UserRole alias for ProtectedRoute and navigation compatibility
export type UserRole = Role;