import '@/app/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { NotificationProvider } from '@/lib/NotificationContext';
import I18nProvider from '@/lib/I18nProvider';
import { AuthProvider } from '@/lib/AuthContext';

import { ThemeProvider } from '@/context/ThemeContext';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { lang } = await params;
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
