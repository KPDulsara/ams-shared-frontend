import React from 'react';
import { SYSTEM_ROLES, SYSTEM_ROLE_CONFIG } from '../constants/systemRoles';
import type { SystemRole } from '../types/user.types';

export interface RoleSelectorProps {
  selected: SystemRole[];
  onChange: (roles: SystemRole[]) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

/** Multi-select checkbox list of the AMS system roles. */
export const RoleSelector: React.FC<RoleSelectorProps> = ({ selected, onChange, error, disabled, required }) => {
  const toggle = (role: SystemRole) => {
    onChange(selected.includes(role) ? selected.filter((r) => r !== role) : [...selected, role]);
  };

  return (
    <fieldset
      aria-describedby={error ? 'role-selector-error' : undefined}
      style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
    >
      <legend
        style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          marginBottom: '0.375rem',
          display: 'flex',
          gap: '0.25rem',
        }}
      >
        Roles
        {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
      </legend>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '0.5rem' }}>
        {SYSTEM_ROLES.map((role) => {
          const checked = selected.includes(role);
          return (
            <label
              key={role}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.625rem',
                padding: '0.625rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: checked ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border)',
                backgroundColor: checked ? 'var(--color-accent-subtle)' : 'var(--color-surface)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.65 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(role)}
                style={{ marginTop: '0.2rem', accentColor: 'var(--color-accent)' }}
              />
              <span style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
                  {SYSTEM_ROLE_CONFIG[role].label}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {SYSTEM_ROLE_CONFIG[role].description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <span id="role-selector-error" role="alert" style={{ fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 500 }}>
          {error}
        </span>
      )}
    </fieldset>
  );
};
