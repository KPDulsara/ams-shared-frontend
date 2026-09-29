import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { RELATIONSHIP_STATUS_CONFIG } from '../constants/relationships';
import type { RelationshipStatus } from '../types/relationship.types';

const STATUS_ICONS: Record<RelationshipStatus, React.ReactNode> = {
  PENDING: <Clock size={12} aria-hidden="true" />,
  APPROVED: <CheckCircle2 size={12} aria-hidden="true" />,
  REJECTED: <XCircle size={12} aria-hidden="true" />,
};

export const RelationshipStatusBadge: React.FC<{ status: RelationshipStatus }> = ({ status }) => {
  const config = RELATIONSHIP_STATUS_CONFIG[status];
  return (
    <Badge variant={config.badgeVariant} size="sm">
      {STATUS_ICONS[status]}
      {config.label}
    </Badge>
  );
};
