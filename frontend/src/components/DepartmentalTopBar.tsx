'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DollarSign, Megaphone, HeartHandshake, FileBadge, GraduationCap, LayoutGrid, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    { name: 'HR', icon: Users, href: `/${lang}/admin/hr` },
  ];

  return (
    <div className="h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 px-8 flex items-center space-x-10 overflow-x-auto no-scrollbar sticky top-20 z-20">
       <div className="flex items-center text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mr-4 flex-shrink-0">
          <LayoutGrid size={12} className="mr-2 text-primary" /> Management
       </div>
       
       <div className="flex items-center space-x-1 flex-1">
         {modules.map((mod) => {
           const isActive = pathname.startsWith(mod.href);
           return (
             <Link 
               key={mod.name} 
               href={mod.href}
               className="relative group px-4 h-14 flex items-center"
             >
                <div className={cn(
                  "flex items-center space-x-2.5 text-xs font-black uppercase tracking-widest transition-all duration-300",
                  isActive 
                    ? "text-primary dark:text-white" 
                    : "text-gray-400 hover:text-primary dark:text-slate-500 dark:hover:text-slate-300"
                )}>
                  <mod.icon size={14} className={cn("transition-transform group-hover:scale-110 duration-300", isActive ? "text-accent" : "opacity-60")} />
                  <span>{mod.name}</span>
                </div>

                {isActive && (
                  <motion.div 
                    layoutId="activeModule"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent shadow-[0_-2px_8px_rgba(var(--accent-rgb),0.4)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                {!isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                )}
             </Link>
           );
         })}
       </div>
    </div>
  );
}
