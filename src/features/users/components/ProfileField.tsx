import React from 'react';

export interface ProfileFieldProps {
  label: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  emptyText?: string;
}

/** Label / value row used on profile and account detail screens. */
export const ProfileField: React.FC<ProfileFieldProps> = ({ label, icon, children, emptyText = 'Not provided' }) => {
  const isEmpty = children === undefined || children === null || children === '';

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem 1rem',
        padding: '0.75rem 0',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <dt
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          color: 'var(--color-text-muted)',
        }}
      >
        {icon && <span style={{ display: 'inline-flex', color: 'var(--color-secondary)' }}>{icon}</span>}
        {label}
      </dt>
      <dd
        style={{
          margin: 0,
          fontSize: '0.875rem',
          fontWeight: 500,
          color: isEmpty ? 'var(--color-text-muted)' : 'var(--color-text)',
          fontStyle: isEmpty ? 'italic' : 'normal',
          textAlign: 'right',
          wordBreak: 'break-word',
        }}
      >
        {isEmpty ? emptyText : children}
      </dd>
    </div>
  );
};

export const ProfileFieldList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <dl style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>{children}</dl>
);
