import React, { useState } from 'react';
import { Save, UserPlus, KeyRound, RefreshCw, Copy, Check } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/feedback/Alert';
import { ACCOUNT_STATUSES, ACCOUNT_STATUS_CONFIG, DEFAULT_ACCOUNT_STATUS } from '../constants/accountStatus';
import { hasErrors, validateUserForm, type FieldErrors } from '../validation/userValidation';
import { getFullName } from '../utils/userFormat';
import type { AccountStatus, UserFormValues } from '../types/user.types';
import { RoleSelector } from './RoleSelector';

export const generateTempPassword = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `AMS#${code}`;
};

export const EMPTY_USER_FORM: UserFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  roles: [],
  status: DEFAULT_ACCOUNT_STATUS,
  temporaryPassword: '',
};

const STATUS_OPTIONS = ACCOUNT_STATUSES.map((status) => ({
  value: status,
  label: ACCOUNT_STATUS_CONFIG[status].label,
  subLabel: ACCOUNT_STATUS_CONFIG[status].description,
}));

export interface UserFormProps {
  mode: 'create' | 'edit';
  initialValues?: UserFormValues;
  isSubmitting: boolean;
  submitError?: string | null;
  onSubmit: (values: UserFormValues) => void;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  mode,
  initialValues = EMPTY_USER_FORM,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}) => {
  const isCreate = mode === 'create';
  const [values, setValues] = useState<UserFormValues>(() => {
    if (isCreate && !initialValues.temporaryPassword) {
      return {
        ...initialValues,
        temporaryPassword: generateTempPassword(),
      };
    }
    return initialValues;
  });
  const [errors, setErrors] = useState<FieldErrors<UserFormValues>>({});
  const [copied, setCopied] = useState(false);

  const setField = <K extends keyof UserFormValues>(field: K, value: UserFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleCopyPassword = () => {
    if (values.temporaryPassword) {
      navigator.clipboard.writeText(values.temporaryPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateUserForm(values, { requireRole: isCreate });
    if (isCreate && (!values.temporaryPassword || values.temporaryPassword.trim().length < 6)) {
      validation.temporaryPassword = 'Temporary password must be at least 6 characters.';
    }
    setErrors(validation);
    if (!hasErrors(validation)) onSubmit(values);
  };

  const fullName = getFullName(values);

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {hasErrors(errors) && (
        <Alert
          key={Object.keys(errors).join()}
          type="error"
          title="Please fix the highlighted fields"
          message="Some required information is missing or invalid."
          autoDismiss={false}
          showDismissButton={false}
        />
      )}
      {submitError && (
        <Alert key={submitError} type="error" title="Could not save user" message={submitError} autoDismiss={false} />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <Input
          label="First Name"
          required
          value={values.firstName}
          onChange={(e) => setField('firstName', e.target.value)}
          error={errors.firstName}
          aria-invalid={Boolean(errors.firstName)}
          disabled={isSubmitting}
          autoComplete="given-name"
          placeholder="e.g. Jordan"
        />
        <Input
          label="Last Name"
          required
          value={values.lastName}
          onChange={(e) => setField('lastName', e.target.value)}
          error={errors.lastName}
          aria-invalid={Boolean(errors.lastName)}
          disabled={isSubmitting}
          autoComplete="family-name"
          placeholder="e.g. Lee"
        />
      </div>

      <Input
        label="Full Name"
        value={fullName}
        readOnly
        disabled
        helperText="Generated automatically from the first and last name."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <Input
          label="Corporate / Personal Email"
          type="email"
          required
          value={values.email}
          onChange={(e) => setField('email', e.target.value)}
          error={errors.email}
          aria-invalid={Boolean(errors.email)}
          disabled={isSubmitting}
          autoComplete="email"
          placeholder="name@example.com"
        />
        <Input
          label="Phone"
          type="tel"
          value={values.phone}
          onChange={(e) => setField('phone', e.target.value)}
          error={errors.phone}
          aria-invalid={Boolean(errors.phone)}
          disabled={isSubmitting}
          autoComplete="tel"
          placeholder="+1 555-0100"
          helperText="Optional."
        />
      </div>

      {isCreate && (
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(13, 148, 136, 0.05)',
            border: '1.5px solid rgba(13, 148, 136, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <KeyRound size={20} color="var(--color-accent)" />
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                Temporary Password (One-Time Login)
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              leftIcon={<RefreshCw size={14} />}
              onClick={() => setField('temporaryPassword', generateTempPassword())}
              disabled={isSubmitting}
            >
              Generate New
            </Button>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <div style={{ flex: 1 }}>
              <Input
                label=""
                value={values.temporaryPassword || ''}
                onChange={(e) => setField('temporaryPassword', e.target.value)}
                error={errors.temporaryPassword}
                placeholder="e.g. AMS#8A9B2C"
                disabled={isSubmitting}
                style={{
                  fontFamily: 'Consolas, Monaco, monospace',
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '1px',
                  color: 'var(--color-primary)',
                }}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              leftIcon={copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
              onClick={handleCopyPassword}
              disabled={isSubmitting || !values.temporaryPassword}
              style={{ minHeight: '42px', flexShrink: 0 }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
            Provide this temporary password along with their email to the newly registered member or officer. Upon their first login, they will be prompted to set their own permanent password.
          </p>
        </div>
      )}

      <Select
        label="Account Status"
        required
        options={STATUS_OPTIONS}
        value={values.status}
        onChange={(e) => setField('status', e.target.value as AccountStatus)}
        disabled={isSubmitting}
        searchable={false}
      />

      {isCreate && (
        <RoleSelector
          required
          selected={values.roles}
          onChange={(roles) => setField('roles', roles)}
          error={errors.roles}
          disabled={isSubmitting}
        />
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--color-border-subtle)',
        }}
      >
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          leftIcon={isCreate ? <UserPlus size={16} /> : <Save size={16} />}
        >
          {isCreate ? 'Create User' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
