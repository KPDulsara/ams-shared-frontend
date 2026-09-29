import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/feedback/Alert';
import { ROUTES } from '@/constants/routes';
import { useCurrentAccess } from '@/features/users/hooks/useCurrentAccess';
import { hasErrors, type FieldErrors } from '@/features/users/validation/userValidation';
import { profileApi } from '../api/profileApi';
import { validateChangePassword, type ChangePasswordValues } from '../validation/passwordValidation';
import { PasswordRequirements } from '../components/PasswordRequirements';

const EMPTY_VALUES: ChangePasswordValues = { currentPassword: '', newPassword: '', confirmPassword: '' };

export const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useCurrentAccess();

  const [values, setValues] = useState<ChangePasswordValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FieldErrors<ChangePasswordValues>>({});
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const setField = (field: keyof ChangePasswordValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    setIsSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSuccess(false);

    const validation = validateChangePassword(values);
    setErrors(validation);
    if (hasErrors(validation)) return;

    setIsSubmitting(true);
    try {
      await profileApi.changePassword(userId, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setValues(EMPTY_VALUES);
      setIsSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Your password could not be changed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputType = showPasswords ? 'text' : 'password';

  return (
    <PageContainer
      title="Change Password"
      subtitle="Choose a strong password that you do not use for other services."
      maxWidth="760px"
      actions={
        <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate(ROUTES.PROFILE)}>
          Back to Profile
        </Button>
      }
    >
      <Card padding="lg">
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          {isSuccess && (
            <Alert
              type="success"
              title="Password changed"
              message="Your password was updated. Use the new password the next time you sign in."
              autoDismiss={false}
            />
          )}
          {hasErrors(errors) && (
            <Alert
              key={Object.keys(errors).join()}
              type="error"
              title="Please fix the highlighted fields"
              message="Your password was not changed."
              autoDismiss={false}
              showDismissButton={false}
            />
          )}
          {submitError && (
            <Alert key={submitError} type="error" title="Password not changed" message={submitError} autoDismiss={false} />
          )}

          <Input
            label="Current Password"
            type={inputType}
            required
            value={values.currentPassword}
            onChange={(e) => setField('currentPassword', e.target.value)}
            error={errors.currentPassword}
            aria-invalid={Boolean(errors.currentPassword)}
            disabled={isSubmitting}
            autoComplete="current-password"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <Input
              label="New Password"
              type={inputType}
              required
              value={values.newPassword}
              onChange={(e) => setField('newPassword', e.target.value)}
              error={errors.newPassword}
              aria-invalid={Boolean(errors.newPassword)}
              aria-describedby="password-requirements"
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            <PasswordRequirements id="password-requirements" password={values.newPassword} />
          </div>

          <Input
            label="Confirm New Password"
            type={inputType}
            required
            value={values.confirmPassword}
            onChange={(e) => setField('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            aria-invalid={Boolean(errors.confirmPassword)}
            disabled={isSubmitting}
            autoComplete="new-password"
          />

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={(e) => setShowPasswords(e.target.checked)}
              style={{ accentColor: 'var(--color-accent)' }}
            />
            Show passwords
          </label>

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
            <Button type="button" variant="outline" onClick={() => navigate(ROUTES.PROFILE)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting} leftIcon={<KeyRound size={16} />}>
              Change Password
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};

export default ChangePasswordPage;
