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
  const [selectedStaff, setSelectedStaff] = useState<StaffInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleRowClick = (s: StaffInfo) => {
    setSelectedStaff(s);
    setIsModalOpen(true);
  };

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
              <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider">Real-time Directory Sync • Click row for details</p>
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
                    <tr 
                      key={s.id} 
                      onClick={() => handleRowClick(s)}
                      className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer"
                    >
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

      {/* Staff Member Card Modal */}
      <AnimatePresence>
        {isModalOpen && selectedStaff && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden border border-white/20 relative"
            >
               {/* Close Button */}
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="absolute top-8 right-8 w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all z-10"
               >
                 <MoreVertical size={20} />
               </button>

               <div className="p-12">
                  <div className="flex items-center space-x-8 mb-10">
                    <div className="w-24 h-24 bg-primary text-white rounded-[32px] flex items-center justify-center font-black text-3xl shadow-2xl shadow-primary/20">
                      {selectedStaff.User?.first_name[0]}{selectedStaff.User?.last_name[0]}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-primary dark:text-white leading-tight">
                        {selectedStaff.User?.first_name} {selectedStaff.User?.last_name}
                      </h2>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs font-mono text-gray-400">ID: {selectedStaff.staff_number}</span>
                        <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest">
                          {selectedStaff.position}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    {/* Bio & Identification */}
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 dark:border-slate-800 pb-3">Personal Dossier</h4>
                       <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                             <Mail size={16} className="text-primary opacity-40" />
                             <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Email Address</p>
                                <p className="text-sm font-bold text-primary dark:text-white">{selectedStaff.User?.email}</p>
                             </div>
                          </div>
                          <div className="flex items-center space-x-3">
                             <Phone size={16} className="text-primary opacity-40" />
                             <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Mobile Contact</p>
                                <p className="text-sm font-bold text-primary dark:text-white">{selectedStaff.phone || 'N/A'}</p>
                             </div>
                          </div>
                          <div className="flex items-center space-x-3">
                             <Building size={16} className="text-primary opacity-40" />
                             <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Residential Address</p>
                                <p className="text-sm font-bold text-primary dark:text-white">{selectedStaff.address || 'Confidential'}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Employment & Payroll */}
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 dark:border-slate-800 pb-3">Employment Data</h4>
                       <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                             <Calendar size={16} className="text-accent opacity-40" />
                             <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Hired Since</p>
                                <p className="text-sm font-bold text-primary dark:text-white">{new Date(selectedStaff.hire_date).toLocaleDateString()}</p>
                             </div>
                          </div>
                          <div className="flex items-center space-x-3">
                             <DollarSign size={16} className="text-emerald-500 opacity-40" />
                             <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Salary Grade</p>
                                <p className="text-sm font-black text-emerald-600">
                                  {selectedStaff.salary ? `$${Number(selectedStaff.salary).toLocaleString()}` : '—'}
                                  <span className="text-[10px] ml-1 font-medium text-gray-400">/mo</span>
                                </p>
                             </div>
                          </div>
                          <div className="flex items-center space-x-3">
                             <ShieldCheck size={16} className="text-blue-500 opacity-40" />
                             <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Department</p>
                                <p className="text-sm font-bold text-primary dark:text-white">{selectedStaff.Department?.name || 'Unassigned'}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-10 border-t border-gray-100 dark:border-slate-800 flex justify-end space-x-4">
                     <Button variant="outline" className="rounded-2xl px-6 h-12" onClick={() => setIsModalOpen(false)}>Close Archive</Button>
                     <Button className="bg-primary text-white rounded-2xl px-8 h-12 shadow-xl shadow-primary/20">Edit Profile</Button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
