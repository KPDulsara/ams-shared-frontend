import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setMustChangePassword } from '@/features/auth/store/authSlice';
import { ROUTES } from '@/constants/routes';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/feedback/Alert';
import { ShieldAlert, KeyRound } from 'lucide-react';
import { authApi } from '../api/authApi';
import { userMockStore } from '@/features/users/api/userMockStore';

export const ForceChangePasswordPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, currentUser } = useAppSelector((state) => state.auth);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await authApi.forceChangePassword({ newPassword });
      const userIdentifier = user?.email || user?.id || currentUser?.email || currentUser?.id;
      if (userIdentifier) {
        userMockStore.updatePassword(userIdentifier, newPassword);
      }
      setLoading(false);
      dispatch(setMustChangePassword(false));
      navigate(ROUTES.DASHBOARD);
    } catch (_err: unknown) {
      // Stand-in update in store
      setTimeout(() => {
        const userIdentifier = user?.email || user?.id || currentUser?.email || currentUser?.id;
        if (userIdentifier) {
          userMockStore.updatePassword(userIdentifier, newPassword);
        }
        setLoading(false);
        dispatch(setMustChangePassword(false));
        navigate(ROUTES.DASHBOARD);
      }, 400);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-background)',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              color: '#d97706',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <ShieldAlert size={30} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            Password Update Required
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-secondary)', marginTop: '4px' }}>
            Your account requires setting a permanent password before accessing the portal.
          </p>
        </div>

        <Card>
          {error && (
            <div style={{ marginBottom: '16px' }}>
              <Alert type="error" message={error} autoDismiss={false} />
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="New Permanent Password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              helperText="Choose a strong password you will use for future logins."
            />

            <Input
              label="Confirm New Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="primary"
              style={{ width: '100%', minHeight: '44px' }}
              isLoading={loading}
              leftIcon={<KeyRound size={16} />}
            >
              Set New Password & Continue
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ForceChangePasswordPage;
