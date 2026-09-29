import React from 'react';
import { useAppSelector } from '@/app/store/hooks';
import ResidentDashboard from '../components/ResidentDashboard';
import OwnerTenantDashboard from '../components/OwnerTenantDashboard';
import StaffDashboard from '../components/StaffDashboard';

export const DashboardPage: React.FC = () => {
  const { user, currentUser, activeRole } = useAppSelector((state) => state.auth);
  const effectiveUser = user || currentUser;

  // Determine dashboard strictly by user's active role:
  // 1. ADMIN / STAFF / MANAGER -> Staff Dashboard
  if (activeRole === 'ADMIN' || activeRole === 'STAFF') {
    return <StaffDashboard user={effectiveUser} />;
  }

  // 2. OWNER -> Property Owner Dashboard
  if (activeRole === 'OWNER') {
    return <OwnerTenantDashboard user={effectiveUser} />;
  }

  // 3. RESIDENT (including Tenants and general residents) -> Resident Community Portal Dashboard
  return <ResidentDashboard user={effectiveUser} />;
};

export default DashboardPage;
