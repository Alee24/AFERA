'use client';

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/lib/AuthContext';
import { NotificationProvider } from '@/lib/NotificationContext';
import I18nProvider from '@/lib/I18nProvider';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
