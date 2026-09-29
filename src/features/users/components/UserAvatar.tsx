import React from 'react';
import { getInitials } from '../utils/userFormat';
import type { UserAccount } from '../types/user.types';

export const UserAvatar: React.FC<{ user: Pick<UserAccount, 'firstName' | 'lastName'>; size?: number }> = ({
  user,
  size = 52,
}) => (
  <div
    aria-hidden="true"
    style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-text-inverse)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${Math.round(size * 0.36)}px`,
      fontWeight: 700,
      flexShrink: 0,
    }}
  >
    {getInitials(user)}
  </div>
);
