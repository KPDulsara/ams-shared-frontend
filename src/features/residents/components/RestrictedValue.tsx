import React from 'react';
import { EyeOff, Lock } from 'lucide-react';
import type { FieldVisibility } from '../utils/profileVisibility';

export interface RestrictedValueProps {
  /** Already-filtered display text from presentRestrictedValue; never the raw value when restricted. */
  display: string | null;
  visibility: FieldVisibility;
  fieldLabel: string;
}

export const RestrictedValue: React.FC<RestrictedValueProps> = ({ display, visibility, fieldLabel }) => {
  if (visibility === 'hidden') {
    return (
      <span
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}
      >
        <Lock size={13} aria-hidden="true" />
        Private
        <span className="sr-only">{fieldLabel} is hidden for privacy</span>
      </span>
    );
  }

  if (!display) {
    return <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', fontStyle: 'italic' }}>Not provided</span>;
  }

  if (visibility === 'masked') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}>
        <EyeOff size={13} color="var(--color-secondary)" aria-hidden="true" />
        <span>{display}</span>
        <span className="sr-only">{fieldLabel} partially masked for privacy</span>
      </span>
    );
  }

  return <span style={{ fontSize: '0.8125rem', wordBreak: 'break-word' }}>{display}</span>;
};
