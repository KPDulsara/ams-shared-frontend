import React, { useId, useState } from 'react';

export interface TextAreaFieldProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  error?: string;
  helperText?: string;
}

/** Multi-line text input styled to match the shared Input component. */
export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  error,
  helperText,
  required,
  maxLength,
  value,
  onFocus,
  onBlur,
  style,
  ...props
}) => {
  const id = useId();
  const messageId = `${id}-message`;
  const [isFocused, setIsFocused] = useState(false);
  const length = typeof value === 'string' ? value.length : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%' }}>
      <label
        htmlFor={id}
        style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', display: 'flex', gap: '0.25rem' }}
      >
        {label}
        {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
      </label>
      <textarea
        id={id}
        required={required}
        maxLength={maxLength}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error || helperText ? messageId : undefined}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        style={{
          padding: '0.625rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          border: error
            ? '1.5px solid var(--color-danger)'
            : isFocused
            ? '1.5px solid var(--color-accent)'
            : '1px solid var(--color-border)',
          boxShadow: isFocused ? '0 0 0 3px rgba(47, 139, 139, 0.15)' : 'none',
          backgroundColor: props.disabled ? 'var(--color-surface-sunken)' : 'var(--color-surface)',
          color: 'var(--color-text)',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          outline: 'none',
          resize: 'vertical',
          fontFamily: 'inherit',
          transition: 'all var(--transition-fast)',
          ...style,
        }}
        {...props}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
        <span
          id={messageId}
          style={{
            fontSize: '0.75rem',
            color: error ? 'var(--color-danger)' : 'var(--color-text-muted)',
            fontWeight: error ? 500 : 400,
          }}
        >
          {error ?? helperText}
        </span>
        {maxLength && (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
            {length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};
