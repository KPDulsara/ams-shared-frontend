import React from 'react';
import { formatDate, formatDateTime } from '@/utils/date';
import { ProfileField, ProfileFieldList } from '@/features/users/components/ProfileField';
import { RELATIONSHIP_TYPE_CONFIG } from '../constants/relationships';
import type { ApartmentRelationship } from '../types/relationship.types';
import { RelationshipStatusBadge } from './RelationshipStatusBadge';

/** Full request information shown to an administrator before a review decision. */
export const RelationshipRequestDetails: React.FC<{ request: ApartmentRelationship }> = ({ request }) => (
  <ProfileFieldList>
    <ProfileField label="Requester">{request.requesterName}</ProfileField>
    <ProfileField label="Requester email">{request.requesterEmail}</ProfileField>
    <ProfileField label="Unit">{request.unitId}</ProfileField>
    <ProfileField label="Relationship">{RELATIONSHIP_TYPE_CONFIG[request.relationshipType].label}</ProfileField>
    <ProfileField label="Effective from">{formatDate(request.effectiveFrom)}</ProfileField>
    <ProfileField label="Submitted">{formatDateTime(request.submittedAt)}</ProfileField>
    <ProfileField label="Status">
      <RelationshipStatusBadge status={request.status} />
    </ProfileField>
    <ProfileField label="Requester note" emptyText="None">{request.notes}</ProfileField>
    {request.reviewedAt && (
      <>
        <ProfileField label="Reviewed">
          {formatDateTime(request.reviewedAt)}
          {request.reviewedBy ? ` by ${request.reviewedBy}` : ''}
        </ProfileField>
        {request.reviewNote && <ProfileField label="Rejection reason">{request.reviewNote}</ProfileField>}
      </>
    )}
  </ProfileFieldList>
);
