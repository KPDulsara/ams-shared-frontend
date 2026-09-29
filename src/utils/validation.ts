// Generic field-format helpers shared by every form that captures contact details.
// Keep feature-specific rules (e.g. which fields are required) inside the feature.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[0-9\s\-()]+$/;

export const isBlank = (value?: string | null): boolean => !value || value.trim().length === 0;

export const isValidEmail = (value: string): boolean => EMAIL_PATTERN.test(value.trim());

export const isValidPhone = (value: string): boolean => {
  const trimmed = value.trim();
  const digitCount = trimmed.replace(/\D/g, '').length;
  return PHONE_PATTERN.test(trimmed) && digitCount >= 7 && digitCount <= 15;
};

export const normalizeEmail = (value: string): string => value.trim().toLowerCase();
