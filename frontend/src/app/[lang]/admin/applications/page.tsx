'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Eye,
  Calendar,
  Mail,
  MapPin,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/lib/NotificationContext';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const { showNotification } = useNotification();

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
      showNotification(`Application ${status} successfully`, 'success');
      fetchApplications();
    } catch (err) {
      showNotification('Operation failed', 'error');
    }
  };

  return (
    <div className="space-y-10">
      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-10">
                   <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-primary text-white rounded-3xl flex items-center justify-center text-3xl font-black shadow-xl">
                         {selectedApp.Student?.User?.first_name?.[0]}{selectedApp.Student?.User?.last_name?.[0]}
                      </div>
                      <div>
                         <h2 className="text-3xl font-bold text-primary dark:text-white">
                            {selectedApp.Student?.User?.first_name} {selectedApp.Student?.User?.last_name}
                         </h2>
                         <p className="text-gray-400 font-medium">Applied for {selectedApp.Program?.name}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setSelectedApp(null)}
                     className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
                   >
                      <XCircle size={24} />
                   </button>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                      <p className="font-bold text-primary dark:text-white">{selectedApp.Student?.User?.email}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                      <p className="font-bold text-primary dark:text-white">{selectedApp.Student?.User?.phone || 'N/A'}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nationality</p>
                      <p className="font-bold text-primary dark:text-white">{selectedApp.Student?.nationality || 'N/A'}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gender</p>
                      <p className="font-bold text-primary dark:text-white capitalize">{selectedApp.Student?.gender || 'N/A'}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date of Birth</p>
                      <p className="font-bold text-primary dark:text-white">
                         {selectedApp.Student?.date_of_birth ? new Date(selectedApp.Student.date_of_birth).toLocaleDateString() : 'N/A'}
                      </p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Admission Number</p>
                      <p className="font-bold text-accent">{selectedApp.Student?.admission_number}</p>
                   </div>
                </div>

                <div className="flex space-x-4">
                   <Button 
                     onClick={() => { handleStatusUpdate(selectedApp.id, 'enrolled'); setSelectedApp(null); }}
                     className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-4 font-bold uppercase tracking-widest shadow-lg shadow-emerald-600/20"
                   >
                      Approve & Enroll
                   </Button>
                   <Button 
                     onClick={() => { handleStatusUpdate(selectedApp.id, 'withdrawn'); setSelectedApp(null); }}
                     variant="outline"
                     className="flex-1 border-red-100 text-red-600 hover:bg-red-50 rounded-2xl py-4 font-bold uppercase tracking-widest"
                   >
                      Reject Application
                   </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">Admission Portal</h1>
          <p className="text-gray-500 mt-2 font-medium">Review and manage incoming student applications for 2026.</p>
        </div>
        <div className="flex items-center space-x-3">
           <Button variant="outline" className="rounded-2xl border-gray-100 bg-white shadow-sm">
              <Calendar size={18} className="mr-2" /> Academic Calendar
           </Button>
           <Button className="bg-primary text-white rounded-2xl px-6 shadow-lg shadow-primary/20">
              Generate Admissions Report
           </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-6">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, email or program..." 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10"
            />
         </div>
         <div className="flex items-center space-x-3 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none rounded-2xl border-gray-50 px-6">
               <Filter size={18} className="mr-2" /> Filter Status
            </Button>
            <Button variant="outline" className="flex-1 md:flex-none rounded-2xl border-gray-50 px-6">
               Program: All
            </Button>
         </div>
      </div>

      {/* Applications List */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-10 py-6">Applicant Details</th>
                    <th className="px-10 py-6">Program of Choice</th>
                    <th className="px-10 py-6">Submission Date</th>
                    <th className="px-10 py-6">Status</th>
                    <th className="px-10 py-6 text-right">Review Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                 {loading ? (
                   <tr><td colSpan={5} className="text-center py-24 animate-pulse font-bold text-gray-400 uppercase tracking-widest">Scanning Admission Database...</td></tr>
                 ) : applications.length === 0 ? (
                   <tr><td colSpan={5} className="text-center py-24 text-gray-400">No pending applications found.</td></tr>
                 ) : applications.map((app) => (
                   <tr key={app.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-10 py-8">
                         <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner">
                               {app.Student?.User?.first_name?.[0]}{app.Student?.User?.last_name?.[0]}
                            </div>
                            <div>
                               <p className="font-bold text-primary dark:text-white">
                                  {app.Student?.User?.first_name} {app.Student?.User?.last_name}
                               </p>
                               <p className="text-xs text-gray-400 mt-0.5">{app.Student?.User?.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex flex-col">
                            <span className="text-sm font-bold text-primary dark:text-white line-clamp-1">
                               {app.Program?.name || 'Program Not Selected'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                               Admissions 2026
                            </span>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex items-center text-gray-500 text-sm font-medium">
                            <Calendar size={14} className="mr-2 text-accent" />
                            {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                         </div>
                      </td>
                      <td className="px-10 py-8">
                         <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
                            app.status === 'enrolled' ? 'bg-emerald-100 text-emerald-600' : 
                            app.status === 'withdrawn' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                         }`}>
                            {app.status === 'enrolled' ? 'Approved' : app.status === 'withdrawn' ? 'Rejected' : 'Pending Review'}
                         </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => handleStatusUpdate(app.id, 'enrolled')}
                              className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm"
                              title="Approve Admission"
                            >
                               <CheckCircle2 size={20} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(app.id, 'withdrawn')}
                              className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                              title="Reject Application"
                            >
                               <XCircle size={20} />
                            </button>
                            <button 
                              onClick={() => setSelectedApp(app)}
                              className="p-2.5 bg-gray-50 text-gray-400 hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm"
                            >
                               <Eye size={20} />
                            </button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-primary rounded-[40px] p-10 text-white relative overflow-hidden group">
            <div className="relative z-10">
               <h4 className="text-xl font-bold mb-4">Need to bulk process?</h4>
               <p className="text-white/70 mb-8 text-sm leading-relaxed max-w-sm">
                  You can download the entire batch of applications as a CSV or PDF file for physical review by the board.
               </p>
               <Button className="bg-accent text-white hover:bg-white hover:text-accent rounded-2xl px-8 transition-all">
                  Export Batch Data <ArrowUpRight size={18} className="ml-2" />
               </Button>
            </div>
            <UserCheck size={160} className="absolute -right-10 -bottom-10 text-white/5 group-hover:scale-110 transition-transform duration-700" />
         </div>
         
         <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
               <h4 className="text-xl font-bold text-primary dark:text-white mb-2">Automated Notifications</h4>
               <p className="text-gray-500 text-sm max-w-xs">System will automatically email applicants upon status change.</p>
            </div>
            <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center text-accent">
               <Mail size={28} />
            </div>
         </div>
      </div>
    </div>
  );
}
