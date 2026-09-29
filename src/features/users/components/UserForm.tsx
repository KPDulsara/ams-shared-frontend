import React, { useState } from 'react';
import { Save, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/feedback/Alert';
import { ACCOUNT_STATUSES, ACCOUNT_STATUS_CONFIG, DEFAULT_ACCOUNT_STATUS } from '../constants/accountStatus';
import { hasErrors, validateUserForm, type FieldErrors } from '../validation/userValidation';
import { getFullName } from '../utils/userFormat';
import type { AccountStatus, UserFormValues } from '../types/user.types';
import { RoleSelector } from './RoleSelector';

export const EMPTY_USER_FORM: UserFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  roles: [],
  status: DEFAULT_ACCOUNT_STATUS,
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
  const [values, setValues] = useState<UserFormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<UserFormValues>>({});
  const isCreate = mode === 'create';

  const setField = <K extends keyof UserFormValues>(field: K, value: UserFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateUserForm(values, { requireRole: isCreate });
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
          label="Email"
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
