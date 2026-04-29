'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Eye,
  Calendar,
  Mail,
  ArrowUpRight,
  Download,
  Users,
  Clock,
  ChevronDown,
  LogIn,
  Key,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/lib/NotificationContext';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState<any>(null);
  
  const [newUser, setNewUser] = useState({ first_name: '', last_name: '', email: '', password: '', role: 'student' });
  const [newPassword, setNewPassword] = useState('');
  const { login: impersonateLogin } = useAuth();

  const handleImpersonate = async (userId: string) => {
    try {
      const res = await api.post(`/admin/impersonate/${userId}`);
      impersonateLogin(res.data.user, res.data.token);
      showNotification('Logged in as user successfully', 'success');
      
      const role = res.data.user.role;
      if (role === 'admin') window.location.href = '/admin';
      else if (role === 'lecturer') window.location.href = '/lecturer';
      else if (role === 'finance') window.location.href = '/admin/finance';
      else if (role === 'admissions') window.location.href = '/admin/students';
      else window.location.href = '/dashboard';
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Impersonation failed', 'error');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/users/reset-password', { id: selectedUserForReset?.id, newPassword });
      showNotification('Password reset successfully', 'success');
      setIsResetModalOpen(false);
      setNewPassword('');
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Password reset failed', 'error');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', newUser);
      showNotification('User created successfully', 'success');
      setIsCreateModalOpen(false);
      setNewUser({ first_name: '', last_name: '', email: '', password: '', role: 'student' });
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to create user', 'error');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/admin/admissions');
      setApplications(res.data);
    } catch (err) {
      showNotification('Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.put(`/admin/admissions/${id}`, { status });
      showNotification(`Application ${status === 'enrolled' ? 'approved' : 'rejected'} successfully`, 'success');
      fetchApplications();
    } catch (err) {
      showNotification('Operation failed', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Pending...';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recieved Recently';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filteredApps = applications.filter(app => {
    const searchStr = `${app.Student?.User?.first_name} ${app.Student?.User?.last_name} ${app.Program?.name}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-10">
                   <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-600 text-white rounded-[32px] flex items-center justify-center text-4xl font-black shadow-2xl shadow-primary/30">
                         {selectedApp.Student?.User?.first_name?.[0]}{selectedApp.Student?.User?.last_name?.[0]}
                      </div>
                      <div>
                         <h2 className="text-4xl font-black text-primary dark:text-white tracking-tight leading-tight">
                            {selectedApp.Student?.User?.first_name}<br/>{selectedApp.Student?.User?.last_name}
                         </h2>
                         <div className="flex items-center mt-2 text-accent font-bold text-sm">
                            <GraduationCap size={16} className="mr-2" /> {selectedApp.Program?.name}
                         </div>
                      </div>
                   </div>
                   <button 
                     onClick={() => setSelectedApp(null)}
                     className="w-14 h-14 bg-gray-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                   >
                      <XCircle size={28} />
                   </button>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-12">
                   {[
                     { label: 'Email Address', value: selectedApp.Student?.User?.email },
                     { label: 'Phone Number', value: selectedApp.Student?.User?.phone || 'Not Provided' },
                     { label: 'Nationality', value: selectedApp.Student?.nationality || 'N/A' },
                     { label: 'Gender', value: selectedApp.Student?.gender || 'N/A' },
                     { label: 'Date of Birth', value: formatDate(selectedApp.Student?.date_of_birth) },
                     { label: 'Scholar ID', value: selectedApp.Student?.admission_number, highlight: true }
                   ].map((item, i) => (
                     <div key={i} className="space-y-1.5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                        <p className={`font-bold ${item.highlight ? 'text-accent' : 'text-primary dark:text-white'}`}>{item.value}</p>
                     </div>
                   ))}
                </div>

                <div className="flex space-x-4">
                   <Button 
                     onClick={() => { handleStatusUpdate(selectedApp.id, 'enrolled'); setSelectedApp(null); }}
                     className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl h-16 font-bold uppercase tracking-widest shadow-xl shadow-emerald-500/20 text-xs"
                   >
                      Approve & Enroll Scholar
                   </Button>
                   <Button 
                     onClick={() => { handleStatusUpdate(selectedApp.id, 'withdrawn'); setSelectedApp(null); }}
                     variant="outline"
                     className="flex-1 border-red-100 text-red-500 hover:bg-red-50 rounded-3xl h-16 font-bold uppercase tracking-widest text-xs"
                   >
                      Reject Application
                   </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="lg:col-span-2 space-y-2">
            <h1 className="text-5xl font-black text-primary dark:text-white tracking-tighter">Admission <span className="text-accent italic">Portal</span></h1>
            <p className="text-gray-500 font-medium text-lg">Orchestrating the next generation of African infrastructure leaders.</p>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 flex items-center justify-between group hover:shadow-xl transition-all">
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Applicants</p>
               <p className="text-3xl font-black text-primary dark:text-white">{applications.length}</p>
            </div>
            <div className="w-14 h-14 bg-primary/5 rounded-[24px] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
               <Users size={28} />
            </div>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 flex items-center justify-between group hover:shadow-xl transition-all">
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Review</p>
               <p className="text-3xl font-black text-accent">{applications.filter(a => a.status === 'pending_approval').length}</p>
            </div>
            <div className="w-14 h-14 bg-accent/5 rounded-[24px] flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
               <Clock size={28} />
            </div>
         </div>
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-col xl:flex-row items-center gap-6">
         <div className="relative flex-1 w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={22} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, professional profile or program..." 
              className="w-full pl-16 pr-6 h-20 bg-white dark:bg-slate-900 border-none rounded-[32px] text-base font-medium shadow-sm focus:ring-4 focus:ring-primary/5 dark:focus:ring-white/5 transition-all outline-none"
            />
         </div>
         <div className="flex items-center space-x-4 w-full xl:w-auto">
            <Button variant="outline" className="h-20 flex-1 xl:flex-none rounded-[32px] border-none bg-white dark:bg-slate-900 px-8 text-primary dark:text-white font-bold text-sm shadow-sm hover:shadow-md transition-all">
               <Filter size={20} className="mr-3 text-accent" /> Advanced Filter <ChevronDown size={18} className="ml-3 opacity-30" />
            </Button>
            <Button className="h-20 bg-primary text-white rounded-[32px] px-10 font-bold text-sm shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
               <Download size={20} className="mr-3" /> Export Selection
            </Button>
         </div>
      </div>

      {/* Master Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[48px] shadow-sm border border-gray-50 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-gray-50/30 dark:bg-slate-800/30 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <th className="px-10 py-8">Identity</th>
                    <th className="px-10 py-8">Academic Program</th>
                    <th className="px-10 py-8">Submission Status</th>
                    <th className="px-10 py-8 text-right">Administrative Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                 {loading ? (
                   <tr><td colSpan={4} className="text-center py-40">
                      <div className="flex flex-col items-center">
                         <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-6"></div>
                         <p className="font-black text-gray-400 uppercase tracking-widest animate-pulse">Syncing Admission Ledger...</p>
                      </div>
                   </td></tr>
                 ) : filteredApps.length === 0 ? (
                   <tr><td colSpan={4} className="text-center py-32 text-gray-400 font-medium italic">No applications found matching your current filters.</td></tr>
                 ) : filteredApps.map((app) => (
                   <tr key={app.id} className="group hover:bg-primary/[0.02] transition-colors relative">
                      <td className="px-10 py-8">
                         <div className="flex items-center space-x-5">
                            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-primary dark:text-white rounded-[22px] flex items-center justify-center font-black text-xl shadow-sm border border-white dark:border-slate-700 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                               {app.Student?.User?.first_name?.[0]}{app.Student?.User?.last_name?.[0]}
                            </div>
                            <div>
                               <p className="font-bold text-primary dark:text-white text-lg tracking-tight">
                                  {app.Student?.User?.first_name} {app.Student?.User?.last_name}
                               </p>
                               <p className="text-xs text-gray-400 font-medium mt-1">{app.Student?.User?.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex flex-col">
                            <span className="text-base font-bold text-primary dark:text-white leading-tight">
                               {app.Program?.name || 'Open Enrollment'}
                            </span>
                            <div className="flex items-center mt-2">
                               <Calendar size={12} className="text-accent mr-2" />
                               <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                  Recieved: {formatDate(app.created_at)}
                               </span>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex flex-col space-y-2">
                            <span className={`inline-flex items-center w-fit text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest ${
                               app.status === 'enrolled' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                               app.status === 'withdrawn' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}>
                               <span className={`w-1.5 h-1.5 rounded-full mr-2 animate-pulse ${
                                 app.status === 'enrolled' ? 'bg-emerald-500' : app.status === 'withdrawn' ? 'bg-rose-500' : 'bg-amber-500'
                               }`}></span>
                               {app.status === 'enrolled' ? 'Verified' : app.status === 'withdrawn' ? 'Rejected' : 'Pending Review'}
                            </span>
                         </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <div className="flex items-center justify-end space-x-3">
                            <button 
                              onClick={() => handleStatusUpdate(app.id, 'enrolled')}
                              className="w-11 h-11 bg-white dark:bg-slate-800 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-[14px] flex items-center justify-center transition-all shadow-sm border border-gray-100 dark:border-slate-700"
                              title="Approve Scholar"
                            >
                               <CheckCircle2 size={22} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(app.id, 'withdrawn')}
                              className="w-11 h-11 bg-white dark:bg-slate-800 text-rose-500 hover:bg-rose-500 hover:text-white rounded-[14px] flex items-center justify-center transition-all shadow-sm border border-gray-100 dark:border-slate-700"
                              title="Decline Scholar"
                            >
                               <XCircle size={22} />
                            </button>
                            <button 
                              onClick={() => setSelectedApp(app)}
                              className="w-11 h-11 bg-white dark:bg-slate-800 text-gray-400 hover:bg-primary hover:text-white rounded-[14px] flex items-center justify-center transition-all shadow-sm border border-gray-100 dark:border-slate-800"
                            >
                               <Eye size={22} />
                            </button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-10">
         <div className="flex items-center space-x-4 text-gray-400">
            <div className="w-10 h-10 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center">
               <UserCheck size={18} />
            </div>
            <p className="text-sm font-medium italic">Administrative Audit Log: Last sync 2 mins ago</p>
         </div>
         <div className="flex items-center space-x-3">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email System Online</p>
         </div>
      </div>
    </div>
  );
}

function GraduationCap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
