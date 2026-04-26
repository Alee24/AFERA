'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  MoreVertical, 
  FolderTree, 
  Building2, 
  GraduationCap, 
  ChevronRight,
  Edit,
  Trash2,
  Box
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function AdminAcademicPage() {
  const [faculties, setFaculties] = useState([
    { id: '1', name: 'Faculty of Road Infrastructure & Finance', departments: 2, programs: 5 },
    { id: '2', name: 'Faculty of Transport Technology', departments: 1, programs: 3 },
  ]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">Academic Infrastructure</h1>
          <p className="text-gray-500 mt-2 font-medium">Configure the organizational hierarchy: Faculties, Departments, and Program Levels.</p>
        </div>
        <div className="flex items-center space-x-3">
           <Button className="bg-primary text-white rounded-2xl px-8 shadow-lg shadow-primary/20">
              <Plus size={18} className="mr-2" /> Create New Faculty
           </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Faculties', count: '02', icon: Building2 },
           { label: 'Departments', count: '06', icon: Box },
           { label: 'Degree Levels', count: '03', icon: ShieldCheck },
           { label: 'Active Programs', count: '14', icon: GraduationCap }
         ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center space-x-4">
               <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-primary">
                  <stat.icon size={22} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-primary dark:text-white">{stat.count}</p>
               </div>
            </div>
         ))}
      </div>

      {/* Main Hierarchy View */}
      <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-bold text-primary dark:text-white">Institutional Hierarchy</h3>
            <div className="flex items-center space-x-2">
               <div className="relative w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="Search hierarchy..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm" />
               </div>
               <Button variant="outline" className="rounded-xl border-gray-50">Expand All</Button>
            </div>
         </div>

         <div className="p-8 space-y-6">
            {faculties.map((faculty, i) => (
              <div key={faculty.id} className="group border border-gray-50 dark:border-slate-800 rounded-[32px] overflow-hidden hover:border-primary/20 transition-all">
                 <div className="p-6 flex items-center justify-between bg-white dark:bg-slate-900">
                    <div className="flex items-center space-x-6">
                       <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                          <Building2 size={24} />
                       </div>
                       <div>
                          <h4 className="text-lg font-bold text-primary dark:text-white">{faculty.name}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                             <span className="text-xs text-gray-400 font-medium flex items-center"><Box size={14} className="mr-1.5" /> {faculty.departments} Departments</span>
                             <span className="text-xs text-gray-400 font-medium flex items-center"><GraduationCap size={14} className="mr-1.5" /> {faculty.programs} Active Programs</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center space-x-2">
                       <Button variant="ghost" className="p-2 hover:bg-gray-50 rounded-xl text-gray-400"><Edit size={18} /></Button>
                       <Button variant="ghost" className="p-2 hover:bg-red-50 rounded-xl text-red-400"><Trash2 size={18} /></Button>
                       <Button className="bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-xl text-xs font-bold px-4 transition-all">Manage Structure</Button>
                    </div>
                 </div>
                 
                 {/* Visual Hierarchy Line - Simplified for Preview */}
                 {i === 0 && (
                   <div className="px-10 pb-8 space-y-4 border-t border-gray-50 dark:border-slate-800 bg-gray-50/20 pt-6">
                      <div className="flex items-center space-x-4 ml-8">
                         <div className="w-8 h-8 border-l-2 border-b-2 border-gray-200 rounded-bl-xl"></div>
                         <div className="flex-1 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-50 flex items-center justify-between">
                            <span className="text-sm font-bold text-primary">Department of Infrastructure Finance</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded font-black uppercase">Active</span>
                         </div>
                      </div>
                      <div className="flex items-center space-x-4 ml-8">
                         <div className="w-8 h-8 border-l-2 border-b-2 border-gray-200 rounded-bl-xl"></div>
                         <div className="flex-1 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-50 flex items-center justify-between">
                            <span className="text-sm font-bold text-primary">Department of Public Policy</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded font-black uppercase">Active</span>
                         </div>
                      </div>
                   </div>
                 )}
              </div>
            ))}
         </div>
      </div>

      {/* Information Panel */}
      <div className="bg-primary rounded-[40px] p-10 text-white relative overflow-hidden flex items-center justify-between">
         <div className="relative z-10 max-w-xl">
            <h4 className="text-2xl font-bold mb-4">Organizational Scalability</h4>
            <p className="text-white/70 leading-relaxed text-sm">
               The academic structure follows the international standard for higher education. 
               Adding a faculty automatically enables departmental reporting and localized program management.
            </p>
         </div>
         <FolderTree size={200} className="absolute -right-20 -bottom-20 text-white/5" />
      </div>
    </div>
  );
}
