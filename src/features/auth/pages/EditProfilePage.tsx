import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/feedback/Alert';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorMessage } from '@/components/feedback/ErrorMessage';
import { ROUTES } from '@/constants/routes';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { withFlash } from '@/hooks/useFlashMessage';
import { useCurrentAccess } from '@/features/users/hooks/useCurrentAccess';
import {
  hasErrors,
  stripEmpty,
  validatePersonName,
  validatePhoneField,
  type FieldErrors,
} from '@/features/users/validation/userValidation';
import { profileApi, type UpdateProfileRequest } from '../api/profileApi';

const EMPTY_FORM: UpdateProfileRequest = { firstName: '', lastName: '', phone: '' };

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userId, name, email } = useCurrentAccess();
  const { data: profile, loading, error, reload } = useAsyncResource(() => profileApi.getMyProfile({ userId, name, email }), [userId]);

  const [values, setValues] = useState<UpdateProfileRequest>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors<UpdateProfileRequest>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setValues({ firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone ?? '' });
    }
  }, [profile]);

  const isDirty =
    !!profile &&
    (values.firstName !== profile.firstName ||
      values.lastName !== profile.lastName ||
      values.phone !== (profile.phone ?? ''));

  const setField = (field: keyof UpdateProfileRequest, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = stripEmpty<UpdateProfileRequest>({
      firstName: validatePersonName(values.firstName, 'First name'),
      lastName: validatePersonName(values.lastName, 'Last name'),
      phone: validatePhoneField(values.phone),
    });
    setErrors(validation);
    if (hasErrors(validation)) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      await profileApi.updateMyProfile(userId, values);
      navigate(ROUTES.PROFILE, withFlash('Your profile was updated.'));
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Your profile could not be saved.');
      setIsSaving(false);
    }
  };

  const cancel = () => navigate(ROUTES.PROFILE);

  return (
    <PageContainer
      title="Edit Profile"
      subtitle="Update your name and contact number."
      maxWidth="760px"
      actions={
        <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={cancel}>
          Back to Profile
        </Button>
      }
    >
      {loading ? (
        <LoadingState message="Loading your profile..." />
      ) : error || !profile ? (
        <ErrorMessage title="Could not load your profile" message={error ?? 'Profile not found.'} onRetry={reload} />
      ) : (
        <Card padding="lg">
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {hasErrors(errors) && (
              <Alert
                key={Object.keys(errors).join()}
                type="error"
                title="Please fix the highlighted fields"
                message="Some information is missing or invalid."
                autoDismiss={false}
                showDismissButton={false}
              />
            )}
            {saveError && <Alert key={saveError} type="error" title="Could not save" message={saveError} autoDismiss={false} />}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <Input
                label="First Name"
                required
                value={values.firstName}
                onChange={(e) => setField('firstName', e.target.value)}
                error={errors.firstName}
                aria-invalid={Boolean(errors.firstName)}
                disabled={isSaving}
                autoComplete="given-name"
              />
              <Input
                label="Last Name"
                required
                value={values.lastName}
                onChange={(e) => setField('lastName', e.target.value)}
                error={errors.lastName}
                aria-invalid={Boolean(errors.lastName)}
                disabled={isSaving}
                autoComplete="family-name"
              />
            </div>

            <Input
              label="Phone"
              type="tel"
              value={values.phone}
              onChange={(e) => setField('phone', e.target.value)}
              error={errors.phone}
              aria-invalid={Boolean(errors.phone)}
              disabled={isSaving}
              autoComplete="tel"
              placeholder="+1 555-0100"
              helperText="Optional. Only you and administrators can see your phone number."
            />

            <div>
              <Input label="Email" value={profile.email} readOnly disabled />
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.375rem' }}>
                Your email is used to sign in and must be verified when changed.{' '}
                <Link to={ROUTES.PROFILE_EMAIL_CHANGE}>Change email address</Link>
              </p>
            </div>

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
              <Button type="button" variant="outline" onClick={cancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSaving} disabled={!isDirty} leftIcon={<Save size={16} />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}
    </PageContainer>
  );
};

export default EditProfilePage;
