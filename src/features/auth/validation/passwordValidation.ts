import type { FieldErrors } from '@/features/users/validation/userValidation';

export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lower', label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { id: 'number', label: 'One number', test: (pw) => /\d/.test(pw) },
  { id: 'symbol', label: 'One special character', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

export interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const validateChangePassword = (values: ChangePasswordValues): FieldErrors<ChangePasswordValues> => {
  const errors: FieldErrors<ChangePasswordValues> = {};

  if (!values.currentPassword) errors.currentPassword = 'Current password is required.';

  if (!values.newPassword) {
    errors.newPassword = 'New password is required.';
  } else if (PASSWORD_RULES.some((rule) => !rule.test(values.newPassword))) {
    errors.newPassword = 'New password does not meet all of the requirements below.';
  } else if (values.newPassword === values.currentPassword) {
    errors.newPassword = 'New password must be different from your current password.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your new password.';
  } else if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};
