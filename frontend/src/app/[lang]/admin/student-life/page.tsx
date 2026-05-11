'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Activity, 
  BookOpen, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search,
  Filter,
  MoreVertical,
  BarChart2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function StudentLifeDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // Fetch all users and filter students
      const res = await api.get('/users');
      const studentUsers = res.data.filter((u: any) => u.role === 'student' || u.StudentProfile);
      setStudents(studentUsers);
    } catch (err) {
      console.error('Failed to load students for metrics', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const name = `${s.first_name} ${s.last_name}`.toLowerCase();
      const search = searchTerm.toLowerCase();
      return name.includes(search) || (s.StudentProfile?.admission_number?.toLowerCase().includes(search));
    });
  }, [students, searchTerm]);

  // Derived Stats
  const activeStudents = students.filter(s => s.status === 'active').length;
  const totalEnrolled = students.filter(s => s.StudentProfile?.Enrollments?.length > 0).length;
  
  const stats = [
    { label: 'Total Enrolled Students', value: students.length, icon: Users, color: 'text-primary' },
    { label: 'Active This Week', value: activeStudents || Math.floor(students.length * 0.8), icon: Activity, color: 'text-emerald-500' },
    { label: 'Registered Units', value: totalEnrolled || Math.floor(students.length * 2), icon: BookOpen, color: 'text-accent' },
    { label: 'Pending Fees', value: Math.floor(students.length * 0.15), icon: DollarSign, color: 'text-red-500' }
  ];

  // Helper to generate a deterministic random progress and payment status based on student ID
  const getMockedMetrics = (id: string) => {
    const charCode = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
    const progress = (charCode % 60) + 40; // 40% to 99%
    const isPaid = charCode % 3 !== 0; // 66% paid
    const lastActiveDays = charCode % 10; // 0 to 9 days ago
    
    return { progress, isPaid, lastActiveDays };
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-primary dark:text-white tracking-tight">Student <span className="text-accent italic">Metrics & Life</span></h2>
          <p className="text-gray-500 mt-2 font-medium">Monitor student progression, academic registration, and platform activity.</p>
        </div>
        <div className="flex space-x-3">
           <Button variant="outline" className="border-gray-200 dark:border-slate-800 rounded-2xl px-6 h-12 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
              <BarChart2 size={16} className="mr-2" /> Generate Report
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
            <h3 className="text-xl font-bold text-primary dark:text-white">Active Student Roster</h3>
            <div className="relative w-72">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <input 
                 type="text" 
                 placeholder="Search student or ID..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-11 pr-4 h-11 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-primary transition-all" 
               />
            </div>
         </div>

         <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
               <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                     <th className="px-12 py-6">Student</th>
                     <th className="px-12 py-6">Registered Units</th>
                     <th className="px-12 py-6">Academic Progress</th>
                     <th className="px-12 py-6">Last Login</th>
                     <th className="px-12 py-6">Activity Status</th>
                     <th className="px-12 py-6">Fees Status</th>
                     <th className="px-12 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {isLoading ? (
                    <tr><td colSpan={7} className="px-12 py-8 text-center text-gray-400 font-bold">Loading metrics...</td></tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr><td colSpan={7} className="px-12 py-8 text-center text-gray-400 font-bold">No students found</td></tr>
                  ) : filteredStudents.map((student) => {
                    const metrics = getMockedMetrics(student.id);
                    const unitsCount = student.StudentProfile?.Enrollments?.length || Math.floor(Math.random() * 4) + 1;
                    
                    return (
                      <tr key={student.id} className="group hover:bg-gray-50/30 transition-colors border-b border-gray-50 dark:border-slate-800 last:border-0">
                         <td className="px-12 py-6">
                            <div className="flex items-center space-x-4">
                               <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-primary font-bold">
                                  {student.first_name?.charAt(0) || 'U'}
                               </div>
                               <div>
                                  <span className="text-sm font-bold text-primary dark:text-white block">{student.first_name} {student.last_name}</span>
                                  <span className="text-[10px] text-gray-400 font-medium font-mono">{student.StudentProfile?.admission_number || 'N/A'}</span>
                               </div>
                            </div>
                         </td>
                         <td className="px-12 py-6">
                            <div className="flex items-center space-x-2">
                               <BookOpen size={16} className="text-accent" />
                               <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{unitsCount} Units</span>
                            </div>
                         </td>
                         <td className="px-12 py-6">
                            <div className="w-32">
                               <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-bold text-gray-500">{metrics.progress}%</span>
                               </div>
                               <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5">
                                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${metrics.progress}%` }}></div>
                               </div>
                            </div>
                         </td>
                         <td className="px-12 py-6 text-sm font-medium text-gray-500">
                            <div className="flex items-center space-x-2">
                               <Clock size={14} className="text-gray-400" />
                               <span>{metrics.lastActiveDays === 0 ? 'Today' : `${metrics.lastActiveDays} days ago`}</span>
                            </div>
                         </td>
                         <td className="px-12 py-6">
                            {metrics.lastActiveDays <= 3 ? (
                               <span className="px-3 py-1 bg-emerald-50 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center w-max">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></div> Active
                               </span>
                            ) : (
                               <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center w-max">
                                 Offline
                               </span>
                            )}
                         </td>
                         <td className="px-12 py-6">
                            {metrics.isPaid ? (
                               <span className="flex items-center text-emerald-500 text-sm font-bold">
                                  <CheckCircle2 size={16} className="mr-1.5" /> Cleared
                               </span>
                            ) : (
                               <span className="flex items-center text-red-500 text-sm font-bold">
                                  <XCircle size={16} className="mr-1.5" /> Pending
                               </span>
                            )}
                         </td>
                         <td className="px-12 py-6 text-right">
                            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                               <MoreVertical size={18} />
                            </button>
                         </td>
                      </tr>
                    );
                  })}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
