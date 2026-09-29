import { isBlank, isValidEmail, isValidPhone } from '@/utils/validation';
import type { UserFormValues } from '../types/user.types';

// Field rules shared by Create User, Edit User and Edit Profile so the same field
// is validated identically everywhere.

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const NAME_MAX_LENGTH = 50;

export const validatePersonName = (value: string, label: string): string | undefined => {
  if (isBlank(value)) return `${label} is required.`;
  if (value.trim().length > NAME_MAX_LENGTH) return `${label} must be ${NAME_MAX_LENGTH} characters or fewer.`;
  return undefined;
};

export const validateEmailField = (value: string): string | undefined => {
  if (isBlank(value)) return 'Email is required.';
  if (!isValidEmail(value)) return 'Enter a valid email address, e.g. name@example.com.';
  return undefined;
};

export const validatePhoneField = (value: string): string | undefined => {
  if (isBlank(value)) return undefined;
  if (!isValidPhone(value)) return 'Enter a valid phone number (7–15 digits, optional leading +).';
  return undefined;
};

export const validateUserForm = (
  values: UserFormValues,
  options: { requireRole: boolean }
): FieldErrors<UserFormValues> => {
  const errors: FieldErrors<UserFormValues> = {
    firstName: validatePersonName(values.firstName, 'First name'),
    lastName: validatePersonName(values.lastName, 'Last name'),
    email: validateEmailField(values.email),
    phone: validatePhoneField(values.phone),
    roles: options.requireRole && values.roles.length === 0 ? 'Select at least one role.' : undefined,
  };
  return stripEmpty(errors);
};

export const stripEmpty = <T,>(errors: FieldErrors<T>): FieldErrors<T> =>
  Object.fromEntries(Object.entries(errors).filter(([, message]) => Boolean(message))) as FieldErrors<T>;

export const hasErrors = <T,>(errors: FieldErrors<T>): boolean => Object.keys(errors).length > 0;
