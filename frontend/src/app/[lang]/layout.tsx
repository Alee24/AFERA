import '@/app/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { NotificationProvider } from '@/lib/NotificationContext';
import I18nProvider from '@/lib/I18nProvider';
import { AuthProvider } from '@/lib/AuthContext';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { lang } = await params;
  return (
    <>
      <AuthProvider>
        <NotificationProvider>
          <I18nProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </I18nProvider>
        </NotificationProvider>
      </AuthProvider>
    </>
  );
}
