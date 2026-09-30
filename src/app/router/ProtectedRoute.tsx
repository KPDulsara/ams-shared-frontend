import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { useAppSelector } from '@/app/store/hooks';

export interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectPath?: string;
}

/**
 * Role and authentication gate for routes.
 * 1. Checks if the user is authenticated. If not, redirects to the login portal.
 * 2. Checks if the user has the required role (if allowedRoles is specified).
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectPath = ROUTES.LOGIN,
}) => {
  const { isAuthenticated, activeRole, mustChangePassword } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (mustChangePassword) {
    return <Navigate to={ROUTES.FORCE_CHANGE_PASSWORD} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(activeRole)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
