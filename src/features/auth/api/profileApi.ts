import { normalizeEmail } from '@/utils/validation';
import { mockDelay, userMockStore } from '@/features/users/api/userMockStore';
import type { UserAccount } from '@/features/users/types/user.types';

// Self-service account operations for the signed-in user (My Profile, email, password).
// Mock implementation for the UI-only phase. The real endpoints will identify the user
// from the session token, so `userId` will be dropped during API/Gateway integration.

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/** The signed-in user as known to the auth state. */
export interface SessionIdentity {
  userId: string;
  name: string;
  email: string;
}

/** Mock only: entering this as the current password simulates a rejected change. */
export const MOCK_INCORRECT_PASSWORD = 'Incorrect1!';

const requireProfile = (userId: string): UserAccount => {
  const user = userMockStore.findById(userId);
  if (!user) throw new Error('Your profile could not be found. Please sign in again.');
  return user;
};

export const profileApi = {
  getMyProfile: async (session: SessionIdentity): Promise<UserAccount> => {
    await mockDelay();
    const existing = userMockStore.findById(session.userId);
    if (existing) return existing;
    // Mock only: a user signed in through the login screen may not be in the seed data.
    // The real /users/me endpoint always returns the signed-in account.
    const [firstName, ...rest] = session.name.trim().split(/\s+/);
    return userMockStore.insert({
      id: session.userId,
      firstName: firstName || session.email,
      lastName: rest.join(' '),
      email: session.email,
      roles: [],
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    });
  },

  updateMyProfile: async (userId: string, payload: UpdateProfileRequest): Promise<UserAccount> => {
    await mockDelay();
    requireProfile(userId);
    return userMockStore.update(userId, {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      phone: payload.phone.trim() || undefined,
    }) as UserAccount;
  },

  requestEmailChange: async (userId: string, newEmail: string): Promise<UserAccount> => {
    await mockDelay();
    const user = requireProfile(userId);
    const email = normalizeEmail(newEmail);
    if (email === user.email.toLowerCase()) {
      throw new Error('The new email address is the same as your current email.');
    }
    if (userMockStore.isEmailTaken(email, userId)) {
      throw new Error('This email address is already used by another account.');
    }
    return userMockStore.update(userId, { pendingEmail: email }) as UserAccount;
  },

  resendEmailVerification: async (userId: string): Promise<void> => {
    await mockDelay();
    const user = requireProfile(userId);
    if (!user.pendingEmail) throw new Error('There is no pending email change to verify.');
  },

  cancelEmailChange: async (userId: string): Promise<UserAccount> => {
    await mockDelay();
    requireProfile(userId);
    return userMockStore.update(userId, { pendingEmail: undefined }) as UserAccount;
  },

  changePassword: async (_userId: string, payload: ChangePasswordRequest): Promise<void> => {
    await mockDelay(700);
    if (payload.currentPassword === MOCK_INCORRECT_PASSWORD) {
      throw new Error('Your current password is incorrect.');
    }
  },
};
