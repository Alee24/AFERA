'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  LogOut, 
  FileText,
  UserCheck,
  ShieldCheck,
  Bell,
  DollarSign,
  Presentation,
  CreditCard,
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
  { icon: Video, label: 'Virtual Room', href: '/admin/virtual-room' },
  { icon: FileText, label: 'University Analytics', href: '/admin/analytics' },
  { icon: UserCheck, label: 'Users', href: '/admin/applications' },
  { icon: Users, label: 'Students', href: '/admin/students' },
  { icon: BookOpen, label: 'Programs & Courses', href: '/admin/courses' },
  { icon: ShieldCheck, label: 'Academic Structure', href: '/admin/academic' },
  { icon: Presentation, label: 'Workshops', href: '/admin/workshops' },
  { icon: FileText, label: 'Manage Blog Posts', href: '/admin/blog' },
  { icon: DollarSign, label: 'Finance & Billing', href: '/admin/finance' },
  { icon: CreditCard, label: 'Payment Gateways', href: '/admin/finance/settings' },
  { icon: MessageSquare, label: 'Contact Inbox', href: '/admin/contacts' },
  { icon: FileText, label: 'Strategic Reports', href: '/admin/reports' },
];

const othersItems = [
  { icon: Bell, label: 'Notifications', href: '/admin/notifications' },
  { icon: Settings, label: 'System Settings', href: '/admin/settings' },
];

export default function AdminSidebar({ lang }: { lang: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 h-screen sticky top-0 border-r border-gray-100 dark:border-slate-800 flex flex-col transition-all">
      {/* Brand */}
      <div className="p-8 flex items-center space-x-3">
        <Image src="/LOGOMAIN.png" alt="Afera Logo" width={150} height={40} className="h-8 w-auto object-contain" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-10 overflow-y-auto pt-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 px-4">Main Menu</p>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const fullHref = `/${lang}${item.href}`;
              const isActive = pathname === fullHref;
              return (
                <li key={item.label}>
                  <Link 
                    href={fullHref}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group",
                      isActive 
                        ? "bg-primary/5 text-primary border-l-4 border-primary shadow-sm" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-primary dark:text-gray-400 dark:hover:bg-slate-800"
                    )}
                  >
                    <item.icon size={20} className={cn("transition-colors", isActive ? "text-primary" : "text-gray-400 group-hover:text-primary")} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 px-4">Management</p>
          <ul className="space-y-1">
            {othersItems.map((item) => (
              <li key={item.label}>
                <Link 
                  href={`/${lang}${item.href}`}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-primary transition-all dark:text-gray-400 dark:hover:bg-slate-800"
                >
                  <item.icon size={20} className="text-gray-400" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-gray-50 dark:border-slate-800">
        <button className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all group">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
