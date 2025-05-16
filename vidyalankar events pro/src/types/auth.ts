import { ReactNode } from 'react';

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  year?: number;
  contact: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}

export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}