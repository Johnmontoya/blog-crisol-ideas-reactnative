import { apiRequest } from './api';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth';

export const AuthService = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiRequest<AuthResponse>('/api/v1/user/login', {
      method: 'POST',
      body: data,
    }),

  register: (data: RegisterRequest): Promise<AuthResponse> =>
    apiRequest<AuthResponse>('/api/v1/user/register', {
      method: 'POST',
      body: data,
    }),
};
