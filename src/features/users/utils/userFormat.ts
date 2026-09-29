import type { UserAccount, UserListFilters } from '../types/user.types';

type NamedUser = Pick<UserAccount, 'firstName' | 'lastName'>;

export const getFullName = (user: NamedUser): string =>
  `${user.firstName} ${user.lastName}`.trim();

export const getInitials = (user: NamedUser): string =>
  `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

export const filterUsers = (users: UserAccount[], filters: UserListFilters): UserAccount[] => {
  const term = filters.search.trim().toLowerCase();
  return users.filter((user) => {
    const matchesSearch =
      !term ||
      getFullName(user).toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term);
    const matchesRole = filters.role === 'ALL' || user.roles.includes(filters.role);
    const matchesStatus = filters.status === 'ALL' || user.status === filters.status;
    return matchesSearch && matchesRole && matchesStatus;
  });
};
