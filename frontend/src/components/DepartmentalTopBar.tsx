'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DollarSign, Megaphone, HeartHandshake, FileBadge, GraduationCap, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DepartmentalTopBar() {
  const pathname = usePathname();
  
  // Extract lang from pathname (e.g., /en/admin/...)
  const lang = pathname.split('/')[1] || 'en';

  const modules = [
    { name: 'Finance', icon: DollarSign, href: `/${lang}/admin/finance` },
    { name: 'Marketing', icon: Megaphone, href: `/${lang}/admin/marketing` },
    { name: 'Student Life', icon: HeartHandshake, href: `/${lang}/admin/student-life` },
    { name: 'Admissions', icon: FileBadge, href: `/${lang}/admin/admissions` },
    { name: 'Alumni', icon: GraduationCap, href: `/${lang}/admin/alumni` },
  ];

  return (
    <div className="h-16 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-8 flex items-center space-x-8 overflow-x-auto no-scrollbar">
       <div className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest mr-4 flex-shrink-0">
          <LayoutGrid size={14} className="mr-2" /> ERP Modules
       </div>
       
       <div className="flex items-center space-x-8 flex-1">
         {modules.map((mod) => {
           const isActive = pathname.startsWith(mod.href);
           return (
             <Link 
               key={mod.name} 
               href={mod.href}
               className={cn(
                 "flex items-center space-x-2 text-sm font-bold py-5 border-b-2 transition-all whitespace-nowrap",
                 isActive 
                   ? "border-primary text-primary dark:text-white dark:border-white" 
                   : "border-transparent text-gray-500 hover:text-primary hover:border-gray-200 dark:text-gray-400 dark:hover:text-white"
               )}
             >
               <mod.icon size={16} className={cn(isActive ? "text-accent" : "opacity-50")} />
               <span>{mod.name}</span>
             </Link>
           );
         })}
       </div>
    </div>
  );
}
