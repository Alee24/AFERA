'use client';

import React, { ReactNode } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Search, Bell, Settings, Mail } from 'lucide-react';
import Image from 'next/image';

export default function AdminLayout({ 
  children, 
  params 
}: { 
  children: ReactNode;
  params: { lang: string };
}) {
  const resolvedParams = React.use(params);
  const lang = resolvedParams.lang;

  return (
    <div className="flex bg-gray-50/50 dark:bg-slate-950 min-h-screen">
      <AdminSidebar lang={lang} />
      
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30 transition-all">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search data, reports, settings..." 
              className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl pl-12 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 border-r border-gray-200 dark:border-slate-800 pr-6 mr-6">
               <button className="p-2 text-gray-400 hover:text-primary transition-colors relative">
                 <Bell size={20} />
                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
               <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                 <Mail size={20} />
               </button>
               <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                 <Settings size={20} />
               </button>
            </div>

            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-primary dark:text-white leading-none">Patricia Peters</p>
                <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-wider">System Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:border-primary transition-colors">
                <Image src="https://i.pravatar.cc/100?u=admin" alt="Admin" width={40} height={40} className="object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
