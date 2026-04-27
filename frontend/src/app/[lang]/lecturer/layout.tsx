'use client';

import React from 'react';
import LecturerSidebar from '@/components/LecturerSidebar';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, useParams } from 'next/navigation';

export default function LecturerLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  React.useEffect(() => {
    if (!isLoading && (!user || (user.role !== 'lecturer' && user.role !== 'admin'))) {
      router.push(`/${lang}/login`);
    }
  }, [user, isLoading, router, lang]);

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user || (user.role !== 'lecturer' && user.role !== 'admin')) return null;

  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-slate-950">
      <LecturerSidebar lang={lang} />
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
