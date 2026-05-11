'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, 
  MapPin, 
  Briefcase, 
  Gift, 
  Search,
  Mail,
  MoreVertical,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function AlumniDashboard() {
  const [activeTab, setActiveTab] = useState('directory');

  const stats = [
    { label: 'Total Alumni', value: '3,450', icon: GraduationCap, color: 'text-primary' },
    { label: 'Employed Globally', value: '94%', icon: Briefcase, color: 'text-accent' },
    { label: 'Alumni Chapters', value: '18', icon: MapPin, color: 'text-emerald-500' },
    { label: 'Annual Donations', value: '$125K', icon: Gift, color: 'text-blue-500' }
  ];

  const alumni = [
    { id: 'AL-001', name: 'David Mwangi', year: '2022', program: 'MSc. Infrastructure', company: 'World Bank', location: 'Washington DC' },
    { id: 'AL-002', name: 'Fatoumata Diallo', year: '2023', program: 'Cert. RBM', company: 'AfDB', location: 'Abidjan' },
    { id: 'AL-003', name: 'John Kamau', year: '2021', program: 'BSc. Civil Eng', company: 'KeNHA', location: 'Nairobi' },
    { id: 'AL-004', name: 'Linda Osei', year: '2024', program: 'MSc. Infrastructure', company: 'Ministry of Roads', location: 'Accra' },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-primary dark:text-white tracking-tight">Alumni <span className="text-accent italic">Network</span></h2>
          <p className="text-gray-500 mt-2 font-medium">Engage past graduates, track career progression, and manage donations.</p>
        </div>
        <div className="flex space-x-3">
           <Button className="bg-primary text-white rounded-2xl px-6 h-12 font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              <Mail size={16} className="mr-2" /> Send Newsletter
           </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {stats.map((stat, i) => (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             key={i} 
             className="bg-white dark:bg-slate-900 p-8 rounded-[36px] shadow-sm border border-gray-100 dark:border-slate-800 relative overflow-hidden group"
           >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-slate-800 ${stat.color} mb-6`}>
                 <stat.icon size={22} />
              </div>
              <div>
                 <h3 className="text-3xl font-black text-primary dark:text-white mb-1">{stat.value}</h3>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </div>
           </motion.div>
         ))}
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 rounded-[48px] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
         <div className="px-12 py-8 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between bg-gray-50/30 dark:bg-slate-800/30">
            <h3 className="text-xl font-bold text-primary dark:text-white">Global Directory</h3>
            <div className="relative w-64">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <input type="text" placeholder="Search alumni..." className="w-full pl-11 pr-4 h-10 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-primary transition-all" />
            </div>
         </div>

         <div className="p-0">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                     <th className="px-12 py-6">Alumnus Name</th>
                     <th className="px-12 py-6">Class Of</th>
                     <th className="px-12 py-6">Current Employer</th>
                     <th className="px-12 py-6">Location</th>
                     <th className="px-12 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {alumni.map((alum) => (
                    <tr key={alum.id} className="group hover:bg-gray-50/30 transition-colors border-b border-gray-50 dark:border-slate-800 last:border-0">
                       <td className="px-12 py-6">
                          <div className="flex items-center space-x-4">
                             <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-primary font-bold">
                                {alum.name.charAt(0)}
                             </div>
                             <div>
                                <span className="text-sm font-bold text-primary dark:text-white block">{alum.name}</span>
                                <span className="text-[10px] text-gray-400 font-medium">{alum.program}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-12 py-6">
                          <span className="bg-primary/5 text-primary px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                             {alum.year}
                          </span>
                       </td>
                       <td className="px-12 py-6 text-sm font-bold text-gray-600 dark:text-gray-300">
                          {alum.company}
                       </td>
                       <td className="px-12 py-6 text-sm font-medium text-gray-500 flex items-center">
                          <MapPin size={14} className="mr-2 text-gray-400" /> {alum.location}
                       </td>
                       <td className="px-12 py-6 text-right">
                          <button className="p-2 text-gray-400 hover:text-accent transition-colors">
                             <Star size={18} />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
