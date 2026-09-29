export type RelationshipType = 'OWNER' | 'TENANT';

export type RelationshipStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ApartmentRelationship {
  id: string;
  userId: string;
  requesterName: string;
  requesterEmail: string;
  /** Unit reference owned by Group 2 (Property & Units); displayed as-is here. */
  unitId: string;
  relationshipType: RelationshipType;
  status: RelationshipStatus;
  /** Date the ownership or tenancy started / will start (ISO date). */
  effectiveFrom: string;
  notes?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
}

export interface RelationshipRequester {
  userId: string;
  name: string;
  email: string;
}

export interface SubmitRelationshipRequest {
  unitId: string;
  relationshipType: RelationshipType;
  effectiveFrom: string;
  notes?: string;
}

export interface RelationshipRequestFormValues {
  unitId: string;
  relationshipType: RelationshipType | '';
  effectiveFrom: string;
  notes: string;
  confirmAccuracy: boolean;
}
