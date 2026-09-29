import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/roles';
import { DashboardPage } from '@/features/dashboard';
import { FacilitiesPage, ReservationsPage } from '@/features/facilities';
import { VisitorsPage } from '@/features/visitors';
import { AnnouncementsPage } from '@/features/announcements';
import { ChangePasswordPage, EditProfilePage, EmailChangePage, ProfilePage } from '@/features/auth';
import { CreateUserPage, EditUserPage, UserDetailPage, UsersPage } from '@/features/users';
import {
  MyRelationshipsPage,
  RelationshipRequestPage,
  RelationshipReviewPage,
  ResidentsPage,
} from '@/features/residents';
import { ProtectedRoute } from './ProtectedRoute';

export interface RouteItem {
  path: string;
  element: React.ReactNode;
  title: string;
}

const adminOnly = (element: React.ReactNode) => (
  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>{element}</ProtectedRoute>
);

export const routesConfig: RouteItem[] = [
  {
    path: ROUTES.DASHBOARD,
    element: <DashboardPage />,
    title: 'Dashboard',
  },
  {
    path: ROUTES.FACILITIES,
    element: <FacilitiesPage />,
    title: 'Facilities Directory',
  },
  {
    path: ROUTES.RESERVATIONS,
    element: <ReservationsPage />,
    title: 'Reservations & Approvals',
  },
  {
    path: ROUTES.VISITORS,
    element: <VisitorsPage />,
    title: 'Visitor Management',
  },
  {
    path: ROUTES.ANNOUNCEMENTS,
    element: <AnnouncementsPage />,
    title: 'Announcements',
  },

  // Group 1 — Identity, Access, Residents & User Relationships
  { path: ROUTES.PROFILE, element: <ProfilePage />, title: 'My Profile' },
  { path: ROUTES.PROFILE_EDIT, element: <EditProfilePage />, title: 'Edit Profile' },
  { path: ROUTES.PROFILE_EMAIL_CHANGE, element: <EmailChangePage />, title: 'Change Email' },
  { path: ROUTES.PROFILE_CHANGE_PASSWORD, element: <ChangePasswordPage />, title: 'Change Password' },
  { path: ROUTES.RESIDENTS, element: <ResidentsPage />, title: 'Residents Directory' },
  { path: ROUTES.RELATIONSHIPS, element: <MyRelationshipsPage />, title: 'My Relationships' },
  { path: ROUTES.RELATIONSHIP_REQUEST, element: <RelationshipRequestPage />, title: 'Request Relationship' },
  { path: ROUTES.USERS, element: adminOnly(<UsersPage />), title: 'User Accounts' },
  { path: ROUTES.USER_CREATE, element: adminOnly(<CreateUserPage />), title: 'Create User' },
  { path: ROUTES.USER_DETAIL, element: adminOnly(<UserDetailPage />), title: 'User Details' },
  { path: ROUTES.USER_EDIT, element: adminOnly(<EditUserPage />), title: 'Edit User' },
  { path: ROUTES.RELATIONSHIP_REVIEW, element: adminOnly(<RelationshipReviewPage />), title: 'Relationship Requests' },
];
