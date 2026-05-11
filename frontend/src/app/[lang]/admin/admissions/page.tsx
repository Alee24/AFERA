'use client';

import React, { useState } from 'react';
import { 
  FileBadge, 
  UserCheck, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function AdmissionsDashboard() {
  const [activeTab, setActiveTab] = useState('pending');

  const stats = [
    { label: 'Total Applications', value: '845', icon: FileBadge, color: 'text-primary' },
    { label: 'Under Review', value: '124', icon: Clock, color: 'text-amber-500' },
    { label: 'Accepted', value: '350', icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Rejected', value: '45', icon: XCircle, color: 'text-red-500' }
  ];

  const applications = [
    { id: 'APP-1021', name: 'James Doe', program: 'MSc. Infrastructure Finance', status: 'Pending Review', date: 'Oct 15, 2026', profile: 'Civil Engineer' },
    { id: 'APP-1022', name: 'Sarah Connor', program: 'Cert. Results Based Management', status: 'Interview', date: 'Oct 16, 2026', profile: 'Project Manager' },
    { id: 'APP-1023', name: 'Michael Osei', program: 'MSc. Infrastructure Finance', status: 'Accepted', date: 'Oct 10, 2026', profile: 'Finance Analyst' },
    { id: 'APP-1024', name: 'Aisha Bello', program: 'Cert. Results Based Management', status: 'Rejected', date: 'Oct 05, 2026', profile: 'Junior Architect' },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-primary dark:text-white tracking-tight">Admissions <span className="text-accent italic">Pipeline</span></h2>
          <p className="text-gray-500 mt-2 font-medium">Review applications, conduct interviews, and manage cohort intake.</p>
        </div>
        <div className="flex items-center space-x-3">
           <Button variant="outline" className="border-gray-200 dark:border-slate-800 rounded-2xl px-6 h-12 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
              <Filter size={16} className="mr-2" /> Filter Pipeline
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
            <h3 className="text-xl font-bold text-primary dark:text-white">Application Queue</h3>
            <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
               <button onClick={() => setActiveTab('pending')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'pending' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-gray-400 hover:text-primary'}`}>Pending</button>
               <button onClick={() => setActiveTab('interview')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'interview' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-gray-400 hover:text-primary'}`}>Interview</button>
               <button onClick={() => setActiveTab('decided')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'decided' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-gray-400 hover:text-primary'}`}>Decided</button>
            </div>
         </div>

         <div className="p-0">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                     <th className="px-12 py-6">Applicant</th>
                     <th className="px-12 py-6">Program Choice</th>
                     <th className="px-12 py-6">Date Applied</th>
                     <th className="px-12 py-6">Status</th>
                     <th className="px-12 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="group hover:bg-gray-50/30 transition-colors border-b border-gray-50 dark:border-slate-800 last:border-0">
                       <td className="px-12 py-6">
                          <div className="flex items-center space-x-4">
                             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold">
                                {app.name.charAt(0)}
                             </div>
                             <div>
                                <span className="text-sm font-bold text-primary dark:text-white block">{app.name}</span>
                                <span className="text-[10px] text-gray-400 font-medium">{app.profile}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-12 py-6 text-sm font-bold text-gray-600 dark:text-gray-300">
                          {app.program}
                       </td>
                       <td className="px-12 py-6 text-sm font-medium text-gray-500 font-mono">
                          {app.date}
                       </td>
                       <td className="px-12 py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                             app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-500' :
                             app.status === 'Rejected' ? 'bg-red-50 text-red-500' : 
                             app.status === 'Interview' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'
                          }`}>
                             {app.status}
                          </span>
                       </td>
                       <td className="px-12 py-6 text-right">
                          <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                             <UserCheck size={18} />
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
