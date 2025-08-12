import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth as useSupabaseAuth } from '../hooks/useAuth';
import { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: any;
  profile: Profile | null;
  session: any;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, userData: {
    firstName: string;
    lastName: string;
    accountType: 'aidant' | 'proche_aide';
  }) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<Profile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useSupabaseAuth();

  const value = {
    user: auth.user,
    profile: auth.profile,
    session: auth.session,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    signUp: auth.signUp,
    signIn: auth.signIn,
    signOut: auth.signOut,
    resetPassword: auth.resetPassword,
    updateProfile: auth.updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};