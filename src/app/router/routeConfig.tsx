import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';

const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const ResidentsPage = lazy(() => import('@/features/residents/pages/ResidentsPage'));
const OwnersPage = lazy(() => import('@/features/owners/pages/OwnersPage'));
const StaffPage = lazy(() => import('@/features/staff/pages/StaffPage'));
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'));

const ChargeRulesPage = lazy(() =>
  import('@/features/billing/pages/ChargeRulesPage').then((module) => ({ default: module.ChargeRulesPage }))
);
const InvoicesPage = lazy(() =>
  import('@/features/billing/pages/InvoicesPage').then((module) => ({ default: module.InvoicesPage }))
);
const PaymentsPage = lazy(() =>
  import('@/features/billing/pages/PaymentsPage').then((module) => ({ default: module.PaymentsPage }))
);
const ReceiptsPage = lazy(() =>
  import('@/features/billing/pages/ReceiptsPage').then((module) => ({ default: module.ReceiptsPage }))
);
const UtilitiesPage = lazy(() =>
  import('@/features/utilities/pages/UtilitiesPage').then((module) => ({ default: module.UtilitiesPage }))
);
const FinanceDashboardPage = lazy(() =>
  import('@/features/billing/pages/FinanceDashboardPage').then((module) => ({ default: module.FinanceDashboardPage }))
);

export const routes: RouteObject[] = [
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.HOME,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.RESIDENTS,
        element: <ResidentsPage />,
      },
      {
        path: ROUTES.OWNERS,
        element: <OwnersPage />,
      },
      {
        path: ROUTES.STAFF,
        element: <StaffPage />,
      },
      {
        path: ROUTES.USERS,
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
            <UsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.FINANCE_DASHBOARD,
        element: (
          <ProtectedRoute allowedRoles={['FINANCE_OFFICER', 'APARTMENT_MANAGER']}>
            <FinanceDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.CHARGES,
        element: (
          <ProtectedRoute allowedRoles={['FINANCE_OFFICER', 'APARTMENT_MANAGER']}>
            <ChargeRulesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.INVOICES,
        element: <InvoicesPage />,
      },
      {
        path: ROUTES.PAYMENTS,
        element: <PaymentsPage />,
      },
      {
        path: ROUTES.RECEIPTS,
        element: <ReceiptsPage />,
      },
      {
        path: ROUTES.UTILITIES,
        element: (
          <ProtectedRoute allowedRoles={['FINANCE_OFFICER', 'APARTMENT_MANAGER']}>
            <UtilitiesPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
];
