import React, { useState } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setCredentials, type User } from '@/features/auth/store/authSlice';
import { ROUTES } from '@/constants/routes';
import type { UserRole } from '@/constants/roles';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/feedback/Alert';
import { Building2, LogIn, Shield, KeyRound } from 'lucide-react';

import { authApi } from '@/features/auth/api/authApi';
import { userMockStore } from '@/features/users/api/userMockStore';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const reduxAuthError = useAppSelector((state) => state.auth.error);

  const isSessionExpired =
    searchParams.get('reason') === 'session_expired' ||
    (location.state as { reason?: string })?.reason === 'session_expired' ||
    reduxAuthError?.includes('expired');

  const [email, setEmail] = useState('admin@ams.internal');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      // First attempt live backend API if available
      const response = await authApi.login({ email: trimmedEmail, password });
      setLoading(false);

      if (response.user.accountStatus === 'LOCKED') {
        setError('Your account has been locked. Please contact the system administrator.');
        return;
      }
      if (response.user.accountStatus === 'INACTIVE' || response.user.accountStatus === 'SUSPENDED') {
        setError(`Your account status is ${response.user.accountStatus}. Access is restricted.`);
        return;
      }

      dispatch(
        setCredentials({
          user: response.user,
          token: response.token,
          mustChangePassword: response.mustChangePassword,
        })
      );

      if (response.mustChangePassword || response.user.mustChangePassword) {
        navigate(ROUTES.FORCE_CHANGE_PASSWORD);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (_err: unknown) {
      // Stand-in authentication & verification against user accounts store
      setTimeout(() => {
        setLoading(false);

        const foundUser = userMockStore.findByEmail(trimmedEmail);

        if (!foundUser) {
          setError(
            'No account found with this email. Accounts must be registered by a System Administrator.'
          );
          return;
        }

        if (foundUser.status === 'LOCKED') {
          setError('This account is locked. Please contact the system administrator.');
          return;
        }
        if (foundUser.status === 'SUSPENDED') {
          setError('This account is suspended. Please contact the system administrator.');
          return;
        }
        if (foundUser.status === 'INACTIVE') {
          setError('This account is inactive. Please contact the system administrator to activate it.');
          return;
        }

        // Verify password
        const matchesTempPassword = Boolean(
          foundUser.temporaryPassword && password === foundUser.temporaryPassword
        );
        const matchesPermanentPassword = Boolean(
          foundUser.password && password === foundUser.password
        );
        const matchesDefaultSeed =
          !foundUser.password &&
          !foundUser.temporaryPassword &&
          (password === 'admin123' ||
            password === 'password123' ||
            password === 'staff123' ||
            password === 'resident123' ||
            password.length >= 4);

        if (!matchesTempPassword && !matchesPermanentPassword && !matchesDefaultSeed) {
          setError(
            foundUser.temporaryPassword
              ? 'Invalid password. Please enter the temporary password provided by your administrator.'
              : 'Invalid email or password. Please verify your credentials.'
          );
          return;
        }

        // Must change password if flagged or if logging in with temporary password
        const mustChange = Boolean(foundUser.mustChangePassword || matchesTempPassword);

        // Map system role to UI UserRole
        let role: UserRole = 'STAFF';
        let relStatus: 'OWNER' | 'TENANT' | 'STAFF' | 'RESIDENT' | 'NONE' = 'STAFF';

        if (
          foundUser.roles.includes('SYSTEM_ADMINISTRATOR') ||
          foundUser.roles.includes('APARTMENT_MANAGER')
        ) {
          role = 'ADMIN';
          relStatus = 'STAFF';
        } else if (foundUser.roles.includes('OWNER')) {
          role = 'OWNER';
          relStatus = 'OWNER';
        } else if (foundUser.roles.includes('TENANT_RESIDENT')) {
          role = 'RESIDENT';
          relStatus = 'TENANT';
        } else {
          // FINANCE_OFFICER, MAINTENANCE_COORDINATOR, TECHNICIAN, SECURITY_OFFICER
          role = 'STAFF';
          relStatus = 'STAFF';
        }

        const authenticatedUser: User = {
          id: foundUser.id,
          name: `${foundUser.firstName} ${foundUser.lastName}`.trim(),
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          email: foundUser.email,
          phone: foundUser.phone,
          role,
          systemRole: foundUser.roles[0],
          systemRoles: foundUser.roles,
          relationshipStatus: relStatus,
          accountStatus: foundUser.status,
          mustChangePassword: mustChange,
        };

        dispatch(
          setCredentials({
            user: authenticatedUser,
            token: `mock-jwt-token-${foundUser.id}-${Date.now()}`,
            mustChangePassword: mustChange,
          })
        );

        if (mustChange) {
          navigate(ROUTES.FORCE_CHANGE_PASSWORD);
        } else {
          navigate(ROUTES.DASHBOARD);
        }
      }, 350);
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
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <Building2 size={28} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            AMS Portal
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-secondary)', marginTop: '4px' }}>
            Apartment Management System
          </p>
        </div>

        <Card>
          {isSessionExpired && !error && (
            <div style={{ marginBottom: '16px' }}>
              <Alert
                type="warning"
                title="Session Expired"
                message={reduxAuthError || 'Your session has expired. Please sign in again to continue.'}
                autoDismiss={false}
              />
            </div>
          )}

          {error && (
            <div style={{ marginBottom: '16px' }}>
              <Alert type="error" message={error} autoDismiss={false} />
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Corporate / Registered Email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="user@ams.internal"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              helperText="Enter your permanent password or one-time temporary password."
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link to={ROUTES.FORGOT_PASSWORD} style={{ fontSize: '0.8125rem', color: 'var(--color-accent)', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              style={{ width: '100%', minHeight: '44px' }}
              isLoading={loading}
              leftIcon={<LogIn size={16} />}
            >
              Sign In to AMS
            </Button>

            <div
              style={{
                borderTop: '1px solid var(--color-border)',
                marginTop: '12px',
                paddingTop: '16px',
                textAlign: 'center',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.5,
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-secondary)' }}>
                <Shield size={15} color="var(--color-accent)" />
                <span>Authorized Personnel & Resident Access Only</span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                All user accounts and one-time passwords are created exclusively by the Administrator.
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
