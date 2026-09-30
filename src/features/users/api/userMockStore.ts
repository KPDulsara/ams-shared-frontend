import type { UserAccount } from '../types/user.types';

/*
 * In-memory stand-in for the Identity Access Service during the UI-only phase.
 * The api modules are the only consumers; swap their bodies for apiClient calls
 * during API/Gateway integration and delete this file.
 *
 * User ids for the seeded residents, staff and admin match the existing
 * persona ids in `constants/roles.ts` so the signed-in persona has a profile.
 */

const SEED_USERS: UserAccount[] = [
  {
    id: 'admin-001',
    firstName: 'Eleanor',
    lastName: 'Sterling',
    email: 'admin@ams-community.org',
    phone: '+1 555-0100',
    roles: ['SYSTEM_ADMINISTRATOR', 'APARTMENT_MANAGER'],
    status: 'ACTIVE',
    createdAt: '2025-01-06T09:00:00Z',
    password: 'admin123',
    mustChangePassword: false,
  },
  {
    id: 'admin-002',
    firstName: 'Eleanor',
    lastName: 'Sterling (Admin)',
    email: 'admin@ams.internal',
    phone: '+1 555-0100',
    roles: ['SYSTEM_ADMINISTRATOR', 'APARTMENT_MANAGER'],
    status: 'ACTIVE',
    createdAt: '2025-01-01T09:00:00Z',
    password: 'admin123',
    mustChangePassword: false,
  },
  {
    id: 'staff-001',
    firstName: 'David',
    lastName: 'Vance',
    email: 'security.staff@ams-community.org',
    phone: '+1 555-0111',
    roles: ['SECURITY_OFFICER'],
    status: 'ACTIVE',
    createdAt: '2025-02-10T09:00:00Z',
    password: 'staff123',
    mustChangePassword: false,
  },
  {
    id: 'resident-001',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'sarah.j@ams-community.org',
    phone: '+1 555-0192',
    roles: ['TENANT_RESIDENT'],
    status: 'ACTIVE',
    createdAt: '2025-03-02T10:15:00Z',
    password: 'resident123',
    mustChangePassword: false,
  },
  {
    id: 'resident-002',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.c@ams-community.org',
    phone: '+1 555-0144',
    roles: ['OWNER', 'TENANT_RESIDENT'],
    status: 'ACTIVE',
    createdAt: '2025-03-05T14:40:00Z',
    password: 'owner123',
    mustChangePassword: false,
  },
  {
    id: 'resident-003',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.p@ams-community.org',
    phone: '+1 555-0178',
    roles: ['TENANT_RESIDENT'],
    status: 'ACTIVE',
    createdAt: '2025-04-11T08:20:00Z',
    password: 'resident123',
    mustChangePassword: false,
  },
  {
    id: 'resident-004',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.k@ams-community.org',
    phone: '+1 555-0129',
    roles: ['OWNER'],
    status: 'ACTIVE',
    createdAt: '2025-05-19T16:05:00Z',
    password: 'owner123',
    mustChangePassword: false,
  },
  {
    id: 'resident-005',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena.r@ams-community.org',
    phone: '+1 555-0163',
    roles: ['TENANT_RESIDENT'],
    status: 'ACTIVE',
    createdAt: '2025-06-01T11:30:00Z',
    password: 'resident123',
    mustChangePassword: false,
  },
  {
    id: 'resident-006',
    firstName: 'Alexander',
    lastName: 'Wright',
    email: 'alex.w@ams-community.org',
    phone: '+1 555-0187',
    roles: ['OWNER'],
    status: 'ACTIVE',
    createdAt: '2025-06-22T13:10:00Z',
    password: 'owner123',
    mustChangePassword: false,
  },
  {
    id: 'usr-101',
    firstName: 'Grace',
    lastName: 'Okafor',
    email: 'grace.o@ams-community.org',
    phone: '+1 555-0151',
    roles: ['FINANCE_OFFICER'],
    status: 'ACTIVE',
    createdAt: '2025-07-03T09:45:00Z',
    password: 'finance123',
    mustChangePassword: false,
  },
  {
    id: 'usr-102',
    firstName: 'Tomas',
    lastName: 'Rivera',
    email: 'tomas.r@ams-community.org',
    phone: '+1 555-0170',
    roles: ['MAINTENANCE_COORDINATOR'],
    status: 'ACTIVE',
    createdAt: '2025-07-15T10:00:00Z',
    password: 'maint123',
    mustChangePassword: false,
  },
  {
    id: 'usr-103',
    firstName: 'Ken',
    lastName: 'Watanabe',
    email: 'ken.w@ams-community.org',
    phone: '+1 555-0138',
    roles: ['TECHNICIAN'],
    status: 'SUSPENDED',
    createdAt: '2025-08-08T15:25:00Z',
    password: 'tech123',
    mustChangePassword: false,
  },
  {
    id: 'usr-104',
    firstName: 'Laura',
    lastName: 'Bennett',
    email: 'laura.b@ams-community.org',
    roles: [],
    status: 'INACTIVE',
    createdAt: '2026-09-20T12:00:00Z',
    password: 'user123',
    mustChangePassword: false,
  },
  {
    id: 'usr-105',
    firstName: 'Ravi',
    lastName: 'Menon',
    email: 'ravi.m@ams-community.org',
    phone: '+1 555-0199',
    roles: ['TENANT_RESIDENT'],
    status: 'LOCKED',
    createdAt: '2025-09-30T17:50:00Z',
    password: 'user123',
    mustChangePassword: false,
  },
];

const STORAGE_KEY = 'ams_user_accounts_store_v1';

const cloneUser = (user: UserAccount): UserAccount => ({ ...user, roles: [...user.roles] });

const loadUsersFromStorage = (): UserAccount[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return SEED_USERS.map(cloneUser);
};

const saveUsersToStorage = (list: UserAccount[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
};

const MOCK_LATENCY_MS = 450;

/** Simulates network latency so loading states are visible during the UI-only phase. */
export const mockDelay = (ms: number = MOCK_LATENCY_MS): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

let users: UserAccount[] = loadUsersFromStorage();

export const userMockStore = {
  list: (): UserAccount[] => users.map(cloneUser),

  findById: (id: string): UserAccount | undefined => {
    const user = users.find((u) => u.id === id);
    return user ? cloneUser(user) : undefined;
  },

  findByEmail: (email: string): UserAccount | undefined => {
    const target = email.trim().toLowerCase();
    const user = users.find(
      (u) => u.email.toLowerCase() === target || u.pendingEmail?.toLowerCase() === target
    );
    return user ? cloneUser(user) : undefined;
  },

  isEmailTaken: (email: string, excludeUserId?: string): boolean => {
    const target = email.trim().toLowerCase();
    return users.some(
      (u) =>
        u.id !== excludeUserId &&
        (u.email.toLowerCase() === target || u.pendingEmail?.toLowerCase() === target)
    );
  },

  insert: (user: UserAccount): UserAccount => {
    users = [cloneUser(user), ...users];
    saveUsersToStorage(users);
    return cloneUser(user);
  },

  update: (id: string, patch: Partial<Omit<UserAccount, 'id'>>): UserAccount | undefined => {
    let updated: UserAccount | undefined;
    users = users.map((u) => {
      if (u.id !== id) return u;
      updated = { ...u, ...patch };
      return updated;
    });
    if (updated) saveUsersToStorage(users);
    return updated ? cloneUser(updated) : undefined;
  },

  updatePassword: (userIdOrEmail: string, newPassword: string): boolean => {
    const target = userIdOrEmail.trim().toLowerCase();
    let found = false;
    users = users.map((u) => {
      if (u.id === userIdOrEmail || u.email.toLowerCase() === target) {
        found = true;
        return {
          ...u,
          password: newPassword,
          temporaryPassword: undefined,
          mustChangePassword: false,
        };
      }
      return u;
    });
    if (found) saveUsersToStorage(users);
    return found;
  },
};
