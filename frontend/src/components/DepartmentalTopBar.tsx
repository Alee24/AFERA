'use client';

import React, { useState, useEffect } from 'react';
import { Building2, ChevronDown, GraduationCap, Users } from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function DepartmentalTopBar() {
  const [faculties, setFaculties] = useState<any[]>([]);
  const [activeDept, setActiveDept] = useState<string | null>(null);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const res = await api.get('/academic/faculties');
      setFaculties(res.data);
    } catch (err) {
      console.error('Failed to load top bar departments', err);
    }
  };

  return (
    <div className="h-14 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-8 flex items-center space-x-8 overflow-x-auto no-scrollbar scroll-smooth">
       <div className="flex items-center text-xs font-black text-gray-400 uppercase tracking-widest mr-4">
          <Building2 size={14} className="mr-2" /> Schools
       </div>
       
       {faculties.map((faculty) => (
         <div key={faculty.id} className="relative group flex-shrink-0">
            <button 
              className="flex items-center space-x-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white py-4 transition-all"
              onMouseEnter={() => setActiveDept(faculty.id)}
            >
               <span>{faculty.name}</span>
               <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
            </button>

            <AnimatePresence>
               {activeDept === faculty.id && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: 10 }}
                   className="absolute top-full left-0 w-64 bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-4 border border-gray-100 dark:border-slate-700 z-50"
                   onMouseLeave={() => setActiveDept(null)}
                 >
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b pb-2">Academic Departments</p>
                    <div className="space-y-1">
                       {faculty.Departments?.map((dept: any) => (
                         <div key={dept.id} className="p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl cursor-pointer group/item transition-all">
                            <div className="flex items-center justify-between">
                               <p className="text-xs font-bold text-primary dark:text-white group-hover/item:text-accent transition-colors">{dept.name}</p>
                               <GraduationCap size={14} className="text-gray-300 group-hover/item:text-accent" />
                            </div>
                            <div className="flex items-center space-x-3 mt-1.5 opacity-60 group-hover/item:opacity-100">
                               <span className="text-[9px] font-bold text-gray-400 flex items-center"><Users size={10} className="mr-1" /> {dept.Staff?.length || 0} Staff</span>
                               <span className="text-[9px] font-bold text-gray-400 flex items-center"><GraduationCap size={10} className="mr-1" /> {dept.Programs?.length || 0} Programs</span>
                            </div>
                         </div>
                       ))}
                       {(!faculty.Departments || faculty.Departments.length === 0) && (
                         <p className="text-xs text-gray-400 italic py-2 text-center">No departments registered</p>
                       )}
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>
       ))}
    </div>
  );
}
