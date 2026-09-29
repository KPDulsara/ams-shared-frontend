import { ROLES, type UserRole } from '@/constants/roles';

/*
 * Frontend presentation rules for restricted profile fields (email, phone).
 * This only controls what the UI renders — the backend must still enforce access
 * and should omit restricted fields from responses the viewer is not entitled to.
 *
 *   visible — the viewer's own record, or a system administrator
 *   masked  — building staff: partially shown so they can confirm identity
 *   hidden  — other residents / owners: not shown at all
 */
export type FieldVisibility = 'visible' | 'masked' | 'hidden';

export type RestrictedFieldKind = 'email' | 'phone';

export interface Viewer {
  userId: string;
  role: UserRole;
}

export const getRestrictedFieldVisibility = (viewer: Viewer, subjectUserId: string): FieldVisibility => {
  if (viewer.userId === subjectUserId) return 'visible';
  if (viewer.role === ROLES.ADMIN) return 'visible';
  if (viewer.role === ROLES.STAFF) return 'masked';
  return 'hidden';
};

const MASK = '•••';

export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!domain) return MASK;
  return `${local.charAt(0)}${MASK}@${domain}`;
};

export const maskPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  return digits.length < 2 ? MASK : `${MASK} ${MASK}${digits.slice(-2)}`;
};

/**
 * Returns the text that may be rendered for a restricted field, or null when the
 * field must not be shown. Raw values never leave this function unless visible.
 */
export const presentRestrictedValue = (
  value: string | undefined,
  kind: RestrictedFieldKind,
  visibility: FieldVisibility
): string | null => {
  if (!value || visibility === 'hidden') return null;
  if (visibility === 'visible') return value;
  return kind === 'email' ? maskEmail(value) : maskPhone(value);
};
