import type { AccountStatus } from '@/features/users/types/user.types';
import type { RelationshipType } from './relationship.types';

export interface ResidentUnitLink {
  unitId: string;
  relationshipType: RelationshipType;
}

export interface ResidentDirectoryEntry {
  userId: string;
  firstName: string;
  lastName: string;
  /** Restricted — render only through presentRestrictedValue. */
  email: string;
  /** Restricted — render only through presentRestrictedValue. */
  phone?: string;
  status: AccountStatus;
  units: ResidentUnitLink[];
}
