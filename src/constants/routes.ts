export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  RESIDENTS: '/residents',
  OWNERS: '/owners',
  STAFF: '/staff',
  USERS: '/admin/users',
  NOT_FOUND: '*',

  CHARGES: '/charges',
  INVOICES: '/invoices',
  PAYMENTS: '/payments',
  RECEIPTS: '/receipts',
  UTILITIES: '/utilities',
  FINANCE_DASHBOARD: '/finance-dashboard',
} as const;

export type RouteKey = keyof typeof ROUTES;
