import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserRole } from '../types/auth';
import { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  role: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if we're using mock data
const useMockData = () => {
  return !supabase.supabaseUrl.includes('supabase.co') || 
         supabase.supabaseUrl.includes('placeholder-project');
};

// Mock users for development
const mockUsers = {
  student: {
    user: {
      id: 'mock-student-id',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      role: '',
      updated_at: new Date().toISOString(),
      email: 'student@example.com',
      phone: '',
      factors: null
    },
    profile: {
      id: 'mock-student-id',
      name: 'John Student',
      email: 'student@example.com',
      role: 'student',
      contact: '9876543210',
      department: 'Computer Science',
      year: 'Third Year',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  faculty: {
    user: {
      id: 'mock-faculty-id',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      role: '',
      updated_at: new Date().toISOString(),
      email: 'faculty@example.com',
      phone: '',
      factors: null
    },
    profile: {
      id: 'mock-faculty-id',
      name: 'Jane Faculty',
      email: 'faculty@example.com',
      role: 'faculty',
      contact: '9876543211',
      department: 'Computer Science',
      year: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  admin: {
    user: {
      id: 'mock-admin-id',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      role: '',
      updated_at: new Date().toISOString(),
      email: 'admin@example.com',
      phone: '',
      factors: null
    },
    profile: {
      id: 'mock-admin-id',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      contact: '9876543212',
      department: null,
      year: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mockUserType, setMockUserType] = useState<'student' | 'faculty' | 'admin' | null>(null);

  useEffect(() => {
    // For mock data environment
    if (useMockData()) {
      setIsLoading(false);
      if (mockUserType) {
        const mockData = mockUsers[mockUserType];
        setUser(mockData.user);
        setProfile(mockData.profile);
      } else {
        setUser(null);
        setProfile(null);
      }
      return;
    }

    // Get initial session for real Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    }).catch(error => {
      console.error('Error getting session:', error);
      setIsLoading(false);
    });

    // Listen for auth changes
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth state change listener:', error);
      setIsLoading(false);
      return () => {};
    }
  }, [mockUserType]);

  const fetchProfile = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (useMockData()) {
      // Mock sign in
      if (email === 'student@example.com' && password === 'password') {
        setMockUserType('student');
        return { error: null };
      } else if (email === 'faculty@example.com' && password === 'password') {
        setMockUserType('faculty');
        return { error: null };
      } else if (email === 'admin@example.com' && password === 'password') {
        setMockUserType('admin');
        return { error: null };
      } else {
        return { error: { message: 'Invalid login credentials' } };
      }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
  ) => {
    if (useMockData()) {
      // For mock signup, we'll just return success
      // In a real app, we would create a new user and profile
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role
          }
        }
      });

      if (!error && data.user) {
        // Create profile
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              ...userData
            });

          if (profileError) {
            return { error: profileError };
          }
        } catch (profileError) {
          console.error('Error creating profile:', profileError);
          return { error: profileError };
        }
      }

      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    }
  };

  const signOut = async () => {
    if (useMockData()) {
      setMockUserType(null);
      return;
    }

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: useMockData() ? !!mockUserType : !!user,
    role: profile?.role as UserRole || null
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}