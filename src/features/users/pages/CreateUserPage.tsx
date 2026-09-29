import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ROUTES, buildUserDetailPath } from '@/constants/routes';
import { withFlash } from '@/hooks/useFlashMessage';
import { userApi } from '../api/userApi';
import { getFullName } from '../utils/userFormat';
import { UserForm } from '../components/UserForm';
import type { UserFormValues } from '../types/user.types';

export const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const created = await userApi.createUser(values);
      navigate(buildUserDetailPath(created.id), withFlash(`${getFullName(created)}'s account was created.`));
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'The user could not be created.');
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="Create User"
      subtitle="Register a new AMS user account and assign their initial roles."
      maxWidth="960px"
      actions={
        <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate(ROUTES.USERS)}>
          Back to Users
        </Button>
      }
    >
      <Card padding="lg">
        <UserForm
          mode="create"
          isSubmitting={isSubmitting}
          submitError={submitError}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.USERS)}
        />
      </Card>
    </PageContainer>
  );
};

export default CreateUserPage;
