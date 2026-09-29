import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { Shield, ArrowLeft } from 'lucide-react';
import { userApi, type RoleReference } from '../api/userApi';

const fallbackRoles: RoleReference[] = [
  {
    id: 'SYSTEM_ADMINISTRATOR',
    name: 'System Administrator',
    description: 'Manage system-level roles, access settings, reference data, and audit visibility.',
    permissions: ['USERS_MANAGE', 'ROLES_ASSIGN', 'AUDIT_VIEW', 'SETTINGS_MANAGE'],
  },
  {
    id: 'APARTMENT_MANAGER',
    name: 'Apartment Manager',
    description: 'Oversee buildings, units, residents, occupancy, financial status, maintenance, facilities, and announcements.',
    permissions: ['BUILDINGS_MANAGE', 'UNITS_MANAGE', 'RESIDENTS_OVERSEE', 'FINANCIALS_VIEW', 'FACILITIES_MANAGE'],
  },
  {
    id: 'OWNER',
    name: 'Owner',
    description: 'View owned units, occupancy, charges, receipts, requests, and relevant notices.',
    permissions: ['OWNED_UNITS_VIEW', 'CHARGES_VIEW', 'RECEIPTS_VIEW', 'REQUESTS_VIEW'],
  },
  {
    id: 'TENANT_RESIDENT',
    name: 'Tenant / Resident',
    description: 'View profile and unit information, charges, payments, requests, facility bookings, visitor records, and announcements.',
    permissions: ['PROFILE_VIEW', 'PAYMENTS_MAKE', 'FACILITIES_BOOK', 'VISITORS_REGISTER'],
  },
  {
    id: 'FINANCE_OFFICER',
    name: 'Finance Officer',
    description: 'Generate charges and invoices, record or verify simulated payments, review arrears, and produce summaries.',
    permissions: ['CHARGES_GENERATE', 'INVOICES_ISSUE', 'PAYMENTS_VERIFY', 'ARREARS_REVIEW'],
  },
  {
    id: 'MAINTENANCE_COORDINATOR',
    name: 'Maintenance Coordinator',
    description: 'Review requests, prioritize work, assign technicians, track progress, and close work orders.',
    permissions: ['REQUESTS_REVIEW', 'WORK_ORDERS_ASSIGN', 'PROGRESS_TRACK', 'WORK_ORDERS_CLOSE'],
  },
  {
    id: 'TECHNICIAN',
    name: 'Technician / Service Staff',
    description: 'View assigned work, update status, record actions, and report completion.',
    permissions: ['ASSIGNED_WORK_VIEW', 'WORK_STATUS_UPDATE', 'COMPLETION_REPORT'],
  },
  {
    id: 'SECURITY_OFFICER',
    name: 'Security Officer',
    description: 'Record or validate visitors and view approved visitor information.',
    permissions: ['VISITORS_VALIDATE', 'GATE_PASS_SCAN', 'SECURITY_LOG_RECORD'],
  },
];

export const RolesPage: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<RoleReference[]>(fallbackRoles);

  useEffect(() => {
    let isMounted = true;

    userApi
      .getRoles()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setRoles(data);
        }
      })
      .catch(() => {
        // Fallback to project defined roles reference table
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageContainer
      title="System Role Reference"
      subtitle="Reference directory of active system roles, descriptions, and functional scope."
      actions={
        <Button variant="secondary" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate(ROUTES.USERS)}>
          Back to User Access
        </Button>
      }
    >
      <Card title="Defined Application Roles">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {roles.map((role) => (
            <div
              key={role.id || role.name}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={18} color="var(--color-accent)" />
                  <strong style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>{role.name}</strong>
                </div>
                <Badge variant="accent">{role.name}</Badge>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--color-secondary)', margin: 0 }}>
                {role.description}
              </p>

              {role.permissions && role.permissions.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {role.permissions.map((p) => (
                    <Badge key={p} variant="neutral">
                      {p}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
};

export default RolesPage;
