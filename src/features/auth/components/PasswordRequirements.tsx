import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { PASSWORD_RULES } from '../validation/passwordValidation';

export const PasswordRequirements: React.FC<{ password: string; id?: string }> = ({ password, id }) => (
  <ul
    id={id}
    aria-label="Password requirements"
    style={{
      listStyle: 'none',
      margin: 0,
      padding: '0.75rem 1rem',
      borderRadius: 'var(--radius-md)',
      backgroundColor: 'var(--color-surface-hover)',
      border: '1px solid var(--color-border-subtle)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
      gap: '0.375rem 1rem',
    }}
  >
    {PASSWORD_RULES.map((rule) => {
      const met = rule.test(password);
      return (
        <li
          key={rule.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8125rem',
            color: met ? 'var(--color-success-text)' : 'var(--color-text-muted)',
          }}
        >
          {met ? (
            <CheckCircle2 size={15} color="var(--color-success)" aria-hidden="true" />
          ) : (
            <Circle size={15} aria-hidden="true" />
          )}
          <span>{rule.label}</span>
          <span className="sr-only">{met ? '(met)' : '(not met)'}</span>
        </li>
      );
    })}
  </ul>
);
