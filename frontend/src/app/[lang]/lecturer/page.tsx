'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  CheckSquare, 
  GraduationCap, 
  TrendingUp, 
  Clock,
  ChevronRight,
  Bell,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';

export default function LecturerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/lecturer/dashboard');
      setData(res.data);
    } catch (err) {
      showNotification('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading Dashboard...</div>;

  const stats = [
    { label: 'Active Classes', value: data?.stats.totalClasses || 0, icon: BookOpen, color: 'text-primary', bg: 'bg-primary/5' },
    { label: 'Total Students', value: data?.stats.totalStudents || 0, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Pending Grades', value: data?.stats.totalAssessments || 0, icon: GraduationCap, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Attendance Rate', value: '94%', icon: CheckSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-primary dark:text-white tracking-tight">Lecturer <span className="text-accent italic">Dashboard</span></h1>
          <p className="text-gray-500 mt-2 font-medium">Welcome back, {data?.staff?.first_name || 'Professor'}. Here's what's happening with your classes.</p>
        </div>
        <div className="flex space-x-4">
           <button className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 text-gray-400 hover:text-primary transition-all relative">
              <Bell size={20} />
              <span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800"
          >
            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} mb-6 shadow-sm`}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-primary dark:text-white">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Active Classes */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-bold text-primary dark:text-white">Active Units & Classes</h3>
            <button className="text-xs font-bold text-accent uppercase tracking-widest flex items-center hover:translate-x-1 transition-transform">View All <ChevronRight size={16} /></button>
          </div>
          <div className="space-y-6">
            {data?.classes.length > 0 ? data.classes.map((c: any) => (
              <div key={c.id} className="group p-8 bg-gray-50 dark:bg-slate-800 rounded-3xl border border-transparent hover:border-gray-200 transition-all flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-primary dark:text-white shadow-sm font-black text-xl uppercase">
                    {c.CourseUnit?.name?.[0] || 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary dark:text-white">{c.CourseUnit?.name}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{c.class_name} • Semester {c.CourseUnit?.semester}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right mr-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Next Lecture</p>
                    <p className="text-sm font-bold text-primary dark:text-white">Tomorrow, 10:00 AM</p>
                  </div>
                  <button className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                <p className="text-gray-400 font-medium">No active classes assigned yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities/Notifications */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-primary p-10 rounded-[40px] text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Academic Notice</h3>
                <p className="text-white/70 text-sm font-medium mb-8 leading-relaxed">Please ensure all mid-semester grades are uploaded by the end of this week for review by the dean.</p>
                <button className="w-full py-4 bg-white text-primary rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-accent transition-all shadow-xl">Manage Grades</button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
              <h3 className="text-xl font-bold text-primary dark:text-white mb-8">Recent Submissions</h3>
              <div className="space-y-6">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-accent">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary dark:text-white">John Doe submitted Quiz 2</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
