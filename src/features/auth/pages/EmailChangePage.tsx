import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MailCheck, Send, XCircle } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/feedback/Alert';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorMessage } from '@/components/feedback/ErrorMessage';
import { ROUTES } from '@/constants/routes';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { normalizeEmail } from '@/utils/validation';
import { useCurrentAccess } from '@/features/users/hooks/useCurrentAccess';
import { hasErrors, validateEmailField, type FieldErrors } from '@/features/users/validation/userValidation';
import { ConfirmationModal } from '@/features/users/components/ConfirmationModal';
import { profileApi } from '../api/profileApi';

interface EmailChangeValues {
  newEmail: string;
  confirmEmail: string;
}

type Feedback = { type: 'success' | 'error'; message: string } | null;

export const EmailChangePage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useCurrentAccess();
  const { data: profile, setData: setProfile, loading, error, reload } = useAsyncResource(
    () => profileApi.getMyProfile(userId),
    [userId]
  );

  const [values, setValues] = useState<EmailChangeValues>({ newEmail: '', confirmEmail: '' });
  const [errors, setErrors] = useState<FieldErrors<EmailChangeValues>>({});
  const [busyAction, setBusyAction] = useState<'submit' | 'resend' | 'cancel' | null>(null);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const setField = (field: keyof EmailChangeValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const runAction = async (action: 'submit' | 'resend' | 'cancel', task: () => Promise<void>, fallbackError: string) => {
    setBusyAction(action);
    setFeedback(null);
    try {
      await task();
    } catch (err) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : fallbackError });
    } finally {
      setBusyAction(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation: FieldErrors<EmailChangeValues> = {};
    const emailError = validateEmailField(values.newEmail);
    if (emailError) validation.newEmail = emailError;
    if (!values.confirmEmail) validation.confirmEmail = 'Please confirm the new email address.';
    else if (normalizeEmail(values.confirmEmail) !== normalizeEmail(values.newEmail))
      validation.confirmEmail = 'Email addresses do not match.';
    setErrors(validation);
    if (hasErrors(validation)) return;

    runAction(
      'submit',
      async () => {
        const updated = await profileApi.requestEmailChange(userId, values.newEmail);
        setProfile(updated);
        setValues({ newEmail: '', confirmEmail: '' });
        setFeedback({ type: 'success', message: `Verification link sent to ${updated.pendingEmail}.` });
      },
      'The email change could not be requested.'
    );
  };

  const handleResend = () =>
    runAction(
      'resend',
      async () => {
        await profileApi.resendEmailVerification(userId);
        setFeedback({ type: 'success', message: `A new verification link was sent to ${profile?.pendingEmail}.` });
      },
      'The verification email could not be resent.'
    );

  const handleCancelRequest = () =>
    runAction(
      'cancel',
      async () => {
        const updated = await profileApi.cancelEmailChange(userId);
        setProfile(updated);
        setIsCancelConfirmOpen(false);
        setFeedback({ type: 'success', message: 'Your email change request was cancelled.' });
      },
      'The email change request could not be cancelled.'
    );

  return (
    <PageContainer
      title="Change Email Address"
      subtitle="Your new email must be verified before it replaces your current sign-in email."
      maxWidth="760px"
      actions={
        <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate(ROUTES.PROFILE)}>
          Back to Profile
        </Button>
      }
    >
      {loading ? (
        <LoadingState message="Loading your account..." />
      ) : error || !profile ? (
        <ErrorMessage title="Could not load your account" message={error ?? 'Profile not found.'} onRetry={reload} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {feedback && (
            <Alert
              key={feedback.message}
              type={feedback.type}
              message={feedback.message}
              autoDismiss={feedback.type === 'success'}
            />
          )}

          <Card padding="lg">
            <Input label="Current Email" value={profile.email} readOnly disabled />
          </Card>

          {profile.pendingEmail ? (
            <Card padding="lg">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                  <span
                    aria-hidden="true"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-warning-bg)',
                      color: 'var(--color-warning)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MailCheck size={20} />
                  </span>
                  <div>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      Verification pending
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                      We sent a verification link to <strong>{profile.pendingEmail}</strong>. Open the link to
                      confirm the change. Until then, keep signing in with <strong>{profile.email}</strong>.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outline"
                    leftIcon={<XCircle size={16} />}
                    onClick={() => setIsCancelConfirmOpen(true)}
                    disabled={busyAction !== null}
                  >
                    Cancel Request
                  </Button>
                  <Button
                    variant="primary"
                    leftIcon={<Send size={16} />}
                    onClick={handleResend}
                    isLoading={busyAction === 'resend'}
                    disabled={busyAction !== null && busyAction !== 'resend'}
                  >
                    Resend Verification
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card title="Request a new email" padding="lg">
              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input
                  label="New Email"
                  type="email"
                  required
                  value={values.newEmail}
                  onChange={(e) => setField('newEmail', e.target.value)}
                  error={errors.newEmail}
                  aria-invalid={Boolean(errors.newEmail)}
                  disabled={busyAction === 'submit'}
                  autoComplete="email"
                  placeholder="name@example.com"
                />
                <Input
                  label="Confirm New Email"
                  type="email"
                  required
                  value={values.confirmEmail}
                  onChange={(e) => setField('confirmEmail', e.target.value)}
                  error={errors.confirmEmail}
                  aria-invalid={Boolean(errors.confirmEmail)}
                  disabled={busyAction === 'submit'}
                  autoComplete="email"
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <Button type="button" variant="outline" onClick={() => navigate(ROUTES.PROFILE)} disabled={busyAction === 'submit'}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" leftIcon={<Send size={16} />} isLoading={busyAction === 'submit'}>
                    Send Verification Link
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={isCancelConfirmOpen}
        title="Cancel email change?"
        description={
          <>
            The pending change to <strong>{profile?.pendingEmail}</strong> will be discarded and the verification link
            will stop working. Your current email stays the same.
          </>
        }
        confirmLabel="Cancel Request"
        cancelLabel="Keep Request"
        tone="danger"
        isConfirming={busyAction === 'cancel'}
        onConfirm={handleCancelRequest}
        onCancel={() => setIsCancelConfirmOpen(false)}
      />
    </PageContainer>
  );
};

export default EmailChangePage;
