import { mockDelay } from '@/features/users/api/userMockStore';
import { RELATIONSHIP_TYPE_CONFIG } from '../constants/relationships';
import type {
  ApartmentRelationship,
  RelationshipRequester,
  SubmitRelationshipRequest,
} from '../types/relationship.types';

// Apartment relationship requests and reviews.
// Mock implementation for the UI-only phase — replace each body with an apiClient
// call to the Resident Management Service during API/Gateway integration.

let relationships: ApartmentRelationship[] = [
  {
    id: 'rel-001',
    userId: 'resident-001',
    requesterName: 'Sarah Jenkins',
    requesterEmail: 'sarah.j@ams-community.org',
    unitId: 'Tower A - 402',
    relationshipType: 'TENANT',
    status: 'APPROVED',
    effectiveFrom: '2025-03-01',
    submittedAt: '2025-03-02T10:30:00Z',
    reviewedAt: '2025-03-03T09:12:00Z',
    reviewedBy: 'Eleanor Sterling',
  },
  {
    id: 'rel-002',
    userId: 'resident-002',
    requesterName: 'Michael Chen',
    requesterEmail: 'michael.c@ams-community.org',
    unitId: 'Tower B - 205',
    relationshipType: 'OWNER',
    status: 'APPROVED',
    effectiveFrom: '2024-11-15',
    submittedAt: '2025-03-05T15:00:00Z',
    reviewedAt: '2025-03-06T11:45:00Z',
    reviewedBy: 'Eleanor Sterling',
  },
  {
    id: 'rel-003',
    userId: 'resident-002',
    requesterName: 'Michael Chen',
    requesterEmail: 'michael.c@ams-community.org',
    unitId: 'Tower A - 101',
    relationshipType: 'TENANT',
    status: 'PENDING',
    effectiveFrom: '2026-10-01',
    notes: 'Moving into A-101 while my own unit is being renovated.',
    submittedAt: '2026-09-22T08:15:00Z',
  },
  {
    id: 'rel-004',
    userId: 'resident-003',
    requesterName: 'Priya Patel',
    requesterEmail: 'priya.p@ams-community.org',
    unitId: 'Tower A - 108',
    relationshipType: 'TENANT',
    status: 'APPROVED',
    effectiveFrom: '2025-04-15',
    submittedAt: '2025-04-11T08:40:00Z',
    reviewedAt: '2025-04-12T14:05:00Z',
    reviewedBy: 'Eleanor Sterling',
  },
  {
    id: 'rel-005',
    userId: 'resident-003',
    requesterName: 'Priya Patel',
    requesterEmail: 'priya.p@ams-community.org',
    unitId: 'Tower B - 310',
    relationshipType: 'OWNER',
    status: 'REJECTED',
    effectiveFrom: '2026-06-01',
    notes: 'Recently purchased this unit.',
    submittedAt: '2026-06-03T12:20:00Z',
    reviewedAt: '2026-06-05T10:00:00Z',
    reviewedBy: 'Eleanor Sterling',
    reviewNote: 'Ownership transfer is not yet recorded for this unit. Please resubmit once the title transfer is complete.',
  },
  {
    id: 'rel-006',
    userId: 'resident-004',
    requesterName: 'David Kim',
    requesterEmail: 'david.k@ams-community.org',
    unitId: 'Tower B - 512',
    relationshipType: 'OWNER',
    status: 'PENDING',
    effectiveFrom: '2025-05-01',
    submittedAt: '2026-09-18T16:30:00Z',
  },
  {
    id: 'rel-007',
    userId: 'resident-005',
    requesterName: 'Elena Rostova',
    requesterEmail: 'elena.r@ams-community.org',
    unitId: 'Tower A - 904',
    relationshipType: 'TENANT',
    status: 'PENDING',
    effectiveFrom: '2026-09-01',
    notes: 'Lease signed with the unit owner in August.',
    submittedAt: '2026-09-24T11:05:00Z',
  },
  {
    id: 'rel-008',
    userId: 'resident-006',
    requesterName: 'Alexander Wright',
    requesterEmail: 'alex.w@ams-community.org',
    unitId: 'Tower B - 801',
    relationshipType: 'OWNER',
    status: 'APPROVED',
    effectiveFrom: '2025-06-01',
    submittedAt: '2025-06-22T13:30:00Z',
    reviewedAt: '2025-06-23T09:00:00Z',
    reviewedBy: 'Eleanor Sterling',
  },
];

const clone = (rel: ApartmentRelationship): ApartmentRelationship => ({ ...rel });

const newestFirst = (a: ApartmentRelationship, b: ApartmentRelationship) =>
  b.submittedAt.localeCompare(a.submittedAt);

const requirePending = (requestId: string): ApartmentRelationship => {
  const request = relationships.find((r) => r.id === requestId);
  if (!request) throw new Error('This relationship request could not be found.');
  if (request.status !== 'PENDING') throw new Error('This request has already been reviewed.');
  return request;
};

const saveReview = (requestId: string, patch: Partial<ApartmentRelationship>): ApartmentRelationship => {
  let updated: ApartmentRelationship | undefined;
  relationships = relationships.map((r) => {
    if (r.id !== requestId) return r;
    updated = { ...r, ...patch, reviewedAt: new Date().toISOString() };
    return updated;
  });
  return clone(updated as ApartmentRelationship);
};

export const relationshipApi = {
  getMyRelationships: async (userId: string): Promise<ApartmentRelationship[]> => {
    await mockDelay();
    return relationships.filter((r) => r.userId === userId).sort(newestFirst).map(clone);
  },

  getRelationshipRequests: async (): Promise<ApartmentRelationship[]> => {
    await mockDelay();
    return [...relationships].sort(newestFirst).map(clone);
  },

  getApprovedRelationships: async (): Promise<ApartmentRelationship[]> => {
    await mockDelay();
    return relationships.filter((r) => r.status === 'APPROVED').map(clone);
  },

  submitRequest: async (
    requester: RelationshipRequester,
    payload: SubmitRelationshipRequest
  ): Promise<ApartmentRelationship> => {
    await mockDelay(650);
    const duplicate = relationships.find(
      (r) =>
        r.userId === requester.userId &&
        r.unitId === payload.unitId &&
        r.relationshipType === payload.relationshipType &&
        r.status !== 'REJECTED'
    );
    if (duplicate) {
      const typeLabel = RELATIONSHIP_TYPE_CONFIG[payload.relationshipType].label;
      throw new Error(
        `You already have a ${duplicate.status === 'PENDING' ? 'pending' : 'approved'} ${typeLabel} relationship for ${payload.unitId}.`
      );
    }

    const created: ApartmentRelationship = {
      id: `rel-${Date.now()}`,
      userId: requester.userId,
      requesterName: requester.name,
      requesterEmail: requester.email,
      unitId: payload.unitId,
      relationshipType: payload.relationshipType,
      status: 'PENDING',
      effectiveFrom: payload.effectiveFrom,
      notes: payload.notes?.trim() || undefined,
      submittedAt: new Date().toISOString(),
    };
    relationships = [created, ...relationships];
    return clone(created);
  },

  approveRequest: async (requestId: string, reviewerName: string): Promise<ApartmentRelationship> => {
    await mockDelay();
    requirePending(requestId);
    return saveReview(requestId, { status: 'APPROVED', reviewedBy: reviewerName, reviewNote: undefined });
  },

  rejectRequest: async (requestId: string, reviewerName: string, reason: string): Promise<ApartmentRelationship> => {
    await mockDelay();
    requirePending(requestId);
    return saveReview(requestId, { status: 'REJECTED', reviewedBy: reviewerName, reviewNote: reason.trim() });
  },
};
