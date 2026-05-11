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
import api from '@/lib/api';

export default function AdmissionsDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Total Applications', value: '0', icon: FileBadge, color: 'text-primary' },
    { label: 'Pending Review', value: '0', icon: Clock, color: 'text-amber-500' },
    { label: 'Accepted', value: '0', icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Rejected', value: '0', icon: XCircle, color: 'text-red-500' }
  ]);

  React.useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/admissions');
      const data = res.data;
      setApplications(data);

      // Calculate stats
      const total = data.length;
      const pending = data.filter((a: any) => a.status === 'pending_approval').length;
      const accepted = data.filter((a: any) => a.status === 'enrolled').length;
      const rejected = data.filter((a: any) => a.status === 'withdrawn').length;

      setStats([
        { label: 'Total Applications', value: total.toString(), icon: FileBadge, color: 'text-primary' },
        { label: 'Pending Review', value: pending.toString(), icon: Clock, color: 'text-amber-500' },
        { label: 'Accepted', value: accepted.toString(), icon: CheckCircle2, color: 'text-emerald-500' },
        { label: 'Rejected', value: rejected.toString(), icon: XCircle, color: 'text-red-500' }
      ]);
    } catch (err) {
      console.error('Failed to load admissions', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app: any) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return app.status === 'pending_approval';
    if (activeTab === 'decided') return app.status === 'enrolled' || app.status === 'withdrawn';
    return true;
  });

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
               <button onClick={() => setActiveTab('all')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'all' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-gray-400 hover:text-primary'}`}>All</button>
               <button onClick={() => setActiveTab('pending')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'pending' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-gray-400 hover:text-primary'}`}>Pending</button>
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
                  {loading ? (
                    <tr><td colSpan={5} className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Synchronizing Admission Records...</td></tr>
                  ) : filteredApplications.length === 0 ? (
                    <tr><td colSpan={5} className="py-20 text-center text-gray-400 italic">No applications found for this filter.</td></tr>
                  ) : filteredApplications.map((app) => (
                    <tr key={app.id} className="group hover:bg-gray-50/30 transition-colors border-b border-gray-50 dark:border-slate-800 last:border-0">
                       <td className="px-12 py-6">
                          <div className="flex items-center space-x-4">
                             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold">
                                {app.Student?.User?.first_name?.[0] || 'A'}
                             </div>
                             <div>
                                <span className="text-sm font-bold text-primary dark:text-white block">{app.Student?.User?.first_name} {app.Student?.User?.last_name}</span>
                                <span className="text-[10px] text-gray-400 font-medium">{app.Student?.User?.email}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-12 py-6 text-sm font-bold text-gray-600 dark:text-gray-300">
                          {app.Program?.name || 'Academic Program'}
                       </td>
                       <td className="px-12 py-6 text-sm font-medium text-gray-500 font-mono">
                          {new Date(app.created_at).toLocaleDateString()}
                       </td>
                       <td className="px-12 py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                             app.status === 'enrolled' ? 'bg-emerald-50 text-emerald-500' :
                             app.status === 'withdrawn' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                          }`}>
                             {app.status === 'pending_approval' ? 'Under Review' : app.status}
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
