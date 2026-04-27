'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  preferred_language: string;
  StudentProfile?: {
    nationality?: string;
    admission_number?: string;
    gender?: string;
    date_of_birth?: string;
    status?: string;
    enrollment_date?: string;
    professional_profile?: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load auth from localStorage on mount
    const storedUser = localStorage.getItem('afera_user');
    const storedToken = localStorage.getItem('afera_token');

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (err) {
        console.error('Failed to parse stored user', err);
        localStorage.removeItem('afera_user');
        localStorage.removeItem('afera_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('afera_user', JSON.stringify(userData));
    localStorage.setItem('afera_token', authToken);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('afera_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('afera_user');
    localStorage.removeItem('afera_token');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      updateUser,
      logout, 
      isLoading, 
      isAuthenticated: !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
