'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut, 
  FileText,
  Calendar,
  GraduationCap,
  Bell,
  MessageSquare,
  CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/lecturer' },
  { icon: BookOpen, label: 'My Classes', href: '/lecturer/classes' },
  { icon: CheckSquare, label: 'Attendance', href: '/lecturer/attendance' },
  { icon: GraduationCap, label: 'Grades & Results', href: '/lecturer/grades' },
  { icon: FileText, label: 'Course Content', href: '/lecturer/content' },
  { icon: MessageSquare, label: 'Student Messages', href: '/lecturer/messages' },
];

export default function LecturerSidebar({ lang }: { lang: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 h-screen sticky top-0 border-r border-gray-100 dark:border-slate-800 flex flex-col transition-all">
      <div className="p-8 flex items-center space-x-3">
        <Image src="/LOGOMAIN.png" alt="Afera Logo" width={150} height={40} className="h-8 w-auto object-contain" />
        <span className="bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-primary/10">Staff</span>
      </div>

      <nav className="flex-1 px-6 space-y-10 overflow-y-auto pt-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 px-4">Lecturer Portal</p>
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
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 px-4">Support</p>
          <ul className="space-y-1">
            <li key="Notifications">
              <Link 
                href={`/${lang}/lecturer/notifications`}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-primary transition-all dark:text-gray-400 dark:hover:bg-slate-800"
              >
                <Bell size={20} className="text-gray-400" />
                <span>Notifications</span>
              </Link>
            </li>
            <li key="Settings">
              <Link 
                href={`/${lang}/lecturer/settings`}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-primary transition-all dark:text-gray-400 dark:hover:bg-slate-800"
              >
                <Settings size={20} className="text-gray-400" />
                <span>Profile Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="p-6 border-t border-gray-50 dark:border-slate-800">
        <button className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all group">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
