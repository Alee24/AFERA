import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AFERA INNOV ACADEMY | Excellence in Higher Education",
  description: "Join AFERA INNOV ACADEMY to start your career and pursue your passion with our world-class academic programs.",
  keywords: ["University", "Education", "Higher Learning", "Afera Innov Academy", "Courses", "Degrees"],
  icons: {
    icon: "/favicon.png",
  },
};

import { ClientProviders } from "@/components/ClientProviders";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} min-h-screen bg-background font-inter antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
