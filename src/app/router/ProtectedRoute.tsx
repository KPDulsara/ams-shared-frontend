import React from 'react';
import { Navigate } from 'react-router-dom';
import type { UserRole } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { useAppSelector } from '@/app/store/hooks';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * Role gate for a route. Uses `activeRole`, which is set both by sign-in
 * (setCredentials) and by the demo persona switcher. Frontend checks are UX only;
 * the backend must still enforce authorization.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { activeRole } = useAppSelector((state) => state.auth);

  if (allowedRoles && !allowedRoles.includes(activeRole)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};
