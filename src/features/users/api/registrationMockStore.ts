import type { RegistrationRequest } from '../types/registration.types';
import { mockDelay, userMockStore } from './userMockStore';

export { mockDelay };

const SEED_REGISTRATIONS: RegistrationRequest[] = [
  {
    id: 'reg-101',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.v@example.com',
    phone: '+1 555-0182',
    requestedRole: 'TENANT',
    status: 'PENDING',
    createdAt: '2026-09-28T14:30:00Z',
  },
  {
    id: 'reg-102',
    firstName: 'Sophia',
    lastName: 'Martinez',
    email: 'sophia.m@example.com',
    phone: '+1 555-0194',
    requestedRole: 'OWNER',
    status: 'PENDING',
    createdAt: '2026-09-29T09:15:00Z',
  },
  {
    id: 'reg-103',
    firstName: 'Julian',
    lastName: 'Thorne',
    email: 'julian.t@example.com',
    phone: '+1 555-0133',
    requestedRole: 'TENANT',
    status: 'PENDING',
    createdAt: '2026-09-29T16:45:00Z',
  },
  {
    id: 'reg-104',
    firstName: 'Amanda',
    lastName: 'Hayes',
    email: 'amanda.h@example.com',
    phone: '+1 555-0171',
    requestedRole: 'OWNER',
    status: 'APPROVED',
    reviewedAt: '2026-09-25T14:00:00Z',
    reviewedBy: 'Eleanor Sterling',
    createdAt: '2026-09-25T11:00:00Z',
  },
  {
    id: 'reg-105',
    firstName: 'Derek',
    lastName: 'Foster',
    email: 'derek.f@example.com',
    phone: '+1 555-0112',
    requestedRole: 'TENANT',
    status: 'REJECTED',
    reviewedAt: '2026-09-24T15:30:00Z',
    reviewedBy: 'Eleanor Sterling',
    rejectionReason: 'Invalid lease documentation attached; unit occupancy could not be verified.',
    createdAt: '2026-09-24T10:00:00Z',
  },
];

const STORAGE_KEY = 'ams_registration_requests_store_v1';

const cloneRegistration = (req: RegistrationRequest): RegistrationRequest => ({ ...req });

const loadRegistrationsFromStorage = (): RegistrationRequest[] => {
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
  return SEED_REGISTRATIONS.map(cloneRegistration);
};

const saveRegistrationsToStorage = (list: RegistrationRequest[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
};

let registrations: RegistrationRequest[] = loadRegistrationsFromStorage();

export const registrationMockStore = {
  list: (): RegistrationRequest[] => registrations.map(cloneRegistration),

  findById: (id: string): RegistrationRequest | undefined => {
    const found = registrations.find((r) => r.id === id);
    return found ? cloneRegistration(found) : undefined;
  },

  insert: (req: Omit<RegistrationRequest, 'id' | 'status' | 'createdAt'>): RegistrationRequest => {
    const newRecord: RegistrationRequest = {
      ...req,
      id: `reg-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    registrations = [newRecord, ...registrations];
    saveRegistrationsToStorage(registrations);
    return cloneRegistration(newRecord);
  },

  approve: (id: string, reviewedBy: string = 'System Administrator'): RegistrationRequest => {
    const target = registrations.find((r) => r.id === id);
    if (!target) {
      throw new Error('Registration request not found.');
    }
    if (target.status !== 'PENDING') {
      throw new Error(`Registration request has already been ${target.status.toLowerCase()}.`);
    }

    const updated: RegistrationRequest = {
      ...target,
      status: 'APPROVED',
      reviewedAt: new Date().toISOString(),
      reviewedBy,
    };

    registrations = registrations.map((r) => (r.id === id ? updated : r));
    saveRegistrationsToStorage(registrations);

    // Create user account upon registration approval
    const roleToAssign = target.requestedRole === 'OWNER' ? 'OWNER' : 'TENANT_RESIDENT';
    if (!userMockStore.findByEmail(target.email)) {
      userMockStore.insert({
        id: `usr-${Date.now()}`,
        firstName: target.firstName,
        lastName: target.lastName,
        email: target.email,
        phone: target.phone,
        roles: [roleToAssign],
        status: 'ACTIVE',
        temporaryPassword: `AMS#${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        mustChangePassword: true,
        createdAt: new Date().toISOString(),
      });
    }

    return cloneRegistration(updated);
  },

  reject: (id: string, reason: string, reviewedBy: string = 'System Administrator'): RegistrationRequest => {
    const target = registrations.find((r) => r.id === id);
    if (!target) {
      throw new Error('Registration request not found.');
    }
    if (target.status !== 'PENDING') {
      throw new Error(`Registration request has already been ${target.status.toLowerCase()}.`);
    }
    if (!reason || reason.trim().length < 5) {
      throw new Error('A rejection reason of at least 5 characters is required.');
    }

    const updated: RegistrationRequest = {
      ...target,
      status: 'REJECTED',
      reviewedAt: new Date().toISOString(),
      reviewedBy,
      rejectionReason: reason.trim(),
    };

    registrations = registrations.map((r) => (r.id === id ? updated : r));
    saveRegistrationsToStorage(registrations);

    return cloneRegistration(updated);
  },
};
