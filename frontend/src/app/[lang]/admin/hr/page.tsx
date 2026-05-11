"use client";
import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  MoreVertical, 
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/lib/NotificationContext';

interface StaffInfo {
  id: string;
  staff_number: string;
  position: string;
  hire_date: string;
  phone?: string;
  address?: string;
  salary?: number;
  User?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  Department?: {
    name: string;
  };
}

export default function HRPage() {
  const [staff, setStaff] = useState<StaffInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/hr');
      setStaff(res.data);
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to load staff directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Workforce', value: staff.length, icon: Users, color: 'text-primary' },
    { label: 'Active Depts', value: '8', icon: Building, color: 'text-accent' },
    { label: 'Monthly Payroll', value: '$42,500', icon: DollarSign, color: 'text-emerald-500' },
    { label: 'Retention Rate', value: '98%', icon: ShieldCheck, color: 'text-blue-500' }
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary dark:text-white tracking-tight">Staff <span className="text-accent italic">Operations</span></h1>
          <p className="text-gray-500 mt-2 font-medium">Manage institutional human capital, payroll, and departmental assignments.</p>
        </div>
        <div className="flex items-center space-x-3">
           <Button variant="outline" className="border-gray-200 dark:border-slate-800 rounded-2xl px-6 h-12 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
              <Filter size={16} className="mr-2" /> Advanced Filter
           </Button>
           <Button className="bg-primary text-white rounded-2xl px-8 h-12 font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              <UserPlus size={18} className="mr-2" /> Onboard Staff
           </Button>
        </div>
      </div>

      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {stats.map((stat, i) => (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             key={i} 
             className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-800 relative overflow-hidden group"
           >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-slate-800 ${stat.color} mb-6 transition-transform group-hover:scale-110 duration-500`}>
                 <stat.icon size={26} />
              </div>
              <div>
                 <h3 className="text-3xl font-black text-primary dark:text-white mb-1">{stat.value}</h3>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </div>
              <ArrowUpRight size={100} className="absolute -right-6 -bottom-6 text-gray-50 dark:text-slate-800/20 group-hover:text-primary/5 transition-colors duration-500" />
           </motion.div>
         ))}
      </div>

      {/* Directory Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[48px] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
         <div className="px-12 py-10 border-b border-gray-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/30">
            <div>
              <h3 className="text-xl font-bold text-primary dark:text-white">Active Personnel</h3>
              <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider">Real-time Directory Sync</p>
            </div>
            <div className="relative w-full md:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Search by name, role or ID..." 
                 className="w-full pl-12 pr-4 h-12 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all"
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 dark:border-slate-800">
                     <th className="px-12 py-6">Staff Member</th>
                     <th className="px-12 py-6">Designation</th>
                     <th className="px-12 py-6">Department</th>
                     <th className="px-12 py-6">Contact Info</th>
                     <th className="px-12 py-6 text-right">Payroll</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                  {loading ? (
                    <tr><td colSpan={5} className="py-32 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Syncing Employee Database...</td></tr>
                  ) : staff.length === 0 ? (
                    <tr><td colSpan={5} className="py-32 text-center text-gray-400 italic">No personnel records found in the directory.</td></tr>
                  ) : staff.map((s) => (
                    <tr key={s.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-all">
                       <td className="px-12 py-8">
                          <div className="flex items-center space-x-5">
                             <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center font-black text-sm border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                {s.User?.first_name?.[0]}{s.User?.last_name?.[0]}
                             </div>
                             <div>
                                <span className="text-base font-bold text-primary dark:text-white block">{s.User?.first_name} {s.User?.last_name}</span>
                                <span className="text-xs text-gray-400 font-mono">#{s.staff_number}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-12 py-8">
                          <div className="flex items-center space-x-2">
                             <Briefcase size={14} className="text-accent" />
                             <span className="text-sm font-bold text-gray-600 dark:text-slate-300">{s.position}</span>
                          </div>
                       </td>
                       <td className="px-12 py-8">
                          <span className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest border border-gray-200/50 dark:border-slate-700">
                             {s.Department?.name || 'Unassigned'}
                          </span>
                       </td>
                       <td className="px-12 py-8 space-y-1.5">
                          <div className="flex items-center text-xs text-gray-500 font-medium">
                             <Mail size={12} className="mr-2 opacity-50" /> {s.User?.email}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 font-medium">
                             <Phone size={12} className="mr-2 opacity-50" /> {s.phone || '—'}
                          </div>
                       </td>
                       <td className="px-12 py-8 text-right">
                          <div className="inline-flex flex-col items-end">
                            <span className="text-sm font-black text-primary dark:text-white">
                               {s.salary ? `$${Number(s.salary).toLocaleString()}` : 'Negotiable'}
                            </span>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Gross Monthly</span>
                          </div>
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
