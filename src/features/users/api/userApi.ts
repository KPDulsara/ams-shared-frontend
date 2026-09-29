import { normalizeEmail } from '@/utils/validation';
import { getRoleLabel } from '../constants/systemRoles';
import type {
  CreateUserRequest,
  SystemRole,
  UpdateUserRequest,
  UserAccount,
} from '../types/user.types';
import { mockDelay, userMockStore } from './userMockStore';

// Administrator user-management operations.
// Mock implementation for the UI-only phase — replace each body with an apiClient
// call during API/Gateway integration; signatures are intended to stay the same.

const requireUser = (userId: string): UserAccount => {
  const user = userMockStore.findById(userId);
  if (!user) throw new Error('This user account could not be found.');
  return user;
};

export const userApi = {
  getUsers: async (): Promise<UserAccount[]> => {
    await mockDelay();
    return userMockStore.list();
  },

  getUserById: async (userId: string): Promise<UserAccount> => {
    await mockDelay();
    return requireUser(userId);
  },

  createUser: async (payload: CreateUserRequest): Promise<UserAccount> => {
    await mockDelay();
    const email = normalizeEmail(payload.email);
    if (userMockStore.isEmailTaken(email)) {
      throw new Error('An account with this email address already exists.');
    }
    return userMockStore.insert({
      id: `usr-${Date.now()}`,
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email,
      phone: payload.phone.trim() || undefined,
      roles: payload.roles,
      status: payload.status,
      createdAt: new Date().toISOString(),
    });
  },

  updateUser: async (userId: string, payload: UpdateUserRequest): Promise<UserAccount> => {
    await mockDelay();
    requireUser(userId);
    const email = normalizeEmail(payload.email);
    if (userMockStore.isEmailTaken(email, userId)) {
      throw new Error('Another account already uses this email address.');
    }
    return userMockStore.update(userId, {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email,
      phone: payload.phone.trim() || undefined,
      status: payload.status,
    }) as UserAccount;
  },

  assignRole: async (userId: string, role: SystemRole): Promise<UserAccount> => {
    await mockDelay();
    const user = requireUser(userId);
    if (user.status === 'LOCKED') {
      throw new Error('Roles cannot be changed while the account is locked. Unlock the account first.');
    }
    if (user.roles.includes(role)) {
      throw new Error(`${getRoleLabel(role)} is already assigned to this user.`);
    }
    return userMockStore.update(userId, { roles: [...user.roles, role] }) as UserAccount;
  },

  removeRole: async (userId: string, role: SystemRole): Promise<UserAccount> => {
    await mockDelay();
    const user = requireUser(userId);
    if (user.status === 'LOCKED') {
      throw new Error('Roles cannot be changed while the account is locked. Unlock the account first.');
    }
    if (!user.roles.includes(role)) {
      throw new Error(`${getRoleLabel(role)} is not assigned to this user.`);
    }
    return userMockStore.update(userId, { roles: user.roles.filter((r) => r !== role) }) as UserAccount;
  },
};
