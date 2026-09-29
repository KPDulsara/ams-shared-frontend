import { useAppSelector } from '@/app/store/hooks';
import { ROLES, type UserRole } from '@/constants/roles';

export interface CurrentAccess {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  isAdmin: boolean;
  isStaff: boolean;
}

/** Reads the signed-in user and active role from the existing auth state. */
export const useCurrentAccess = (): CurrentAccess => {
  const { currentUser, activeRole } = useAppSelector((state) => state.auth);
  return {
    userId: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    role: activeRole,
    isAdmin: activeRole === ROLES.ADMIN,
    isStaff: activeRole === ROLES.STAFF,
  };
};
