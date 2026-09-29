export const ROUTES = {
  DASHBOARD: '/',
  FACILITIES: '/facilities',
  RESERVATIONS: '/reservations',
  VISITORS: '/visitors',
  ANNOUNCEMENTS: '/announcements',

  // Group 1 — Identity, Access, Residents & User Relationships
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  PROFILE_EMAIL_CHANGE: '/profile/email',
  PROFILE_CHANGE_PASSWORD: '/profile/change-password',
  RESIDENTS: '/residents',
  RELATIONSHIPS: '/relationships',
  RELATIONSHIP_REQUEST: '/relationships/request',
  USERS: '/admin/users',
  USER_CREATE: '/admin/users/create',
  USER_DETAIL: '/admin/users/:userId',
  USER_EDIT: '/admin/users/:userId/edit',
  RELATIONSHIP_REVIEW: '/admin/relationship-requests',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];

export const buildUserDetailPath = (userId: string): string =>
  ROUTES.USER_DETAIL.replace(':userId', encodeURIComponent(userId));

export const buildUserEditPath = (userId: string): string =>
  ROUTES.USER_EDIT.replace(':userId', encodeURIComponent(userId));
