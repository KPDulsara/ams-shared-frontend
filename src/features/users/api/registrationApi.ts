import { apiClient } from '@/services/api/client';
import type { RegistrationRequest } from '../types/registration.types';
import { mockDelay, registrationMockStore } from './registrationMockStore';

export const registrationApi = {
  getRegistrationRequests: async (): Promise<RegistrationRequest[]> => {
    try {
      const response = await apiClient.get<RegistrationRequest[]>('/v1/auth/registrations');
      return response.data;
    } catch {
      await mockDelay();
      return registrationMockStore.list();
    }
  },

  approveRegistration: async (id: string, reviewedBy?: string): Promise<RegistrationRequest> => {
    try {
      const response = await apiClient.post<RegistrationRequest>(`/v1/auth/registrations/${id}/approve`, {
        reviewedBy,
      });
      return response.data;
    } catch {
      await mockDelay();
      return registrationMockStore.approve(id, reviewedBy);
    }
  },

  rejectRegistration: async (id: string, reason: string, reviewedBy?: string): Promise<RegistrationRequest> => {
    try {
      const response = await apiClient.post<RegistrationRequest>(`/v1/auth/registrations/${id}/reject`, {
        rejectionReason: reason,
        reviewedBy,
      });
      return response.data;
    } catch {
      await mockDelay();
      return registrationMockStore.reject(id, reason, reviewedBy);
    }
  },
};

export default registrationApi;
