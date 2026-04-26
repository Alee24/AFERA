'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  MessageSquare, 
  TrendingUp,
  Clock,
  MoreVertical,
  Calendar as CalendarIcon,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotification } from '@/lib/NotificationContext';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const StatCard = ({ icon: Icon, label, value, trend, color, subtext, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-800 transition-all hover:shadow-xl hover:-translate-y-1"
  >
    <div className="flex items-start justify-between mb-8">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner", color)}>
        <Icon size={24} className="text-primary dark:text-white" />
      </div>
      <button className="text-gray-300 hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-xl">
        <MoreVertical size={20} />
      </button>
    </div>
    <div>
      <h3 className="text-5xl font-black text-primary dark:text-white mb-2 tracking-tighter">{value}</h3>
      <div className="flex items-center space-x-2">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</span>
        {trend && (
          <span className="flex items-center text-[10px] font-black text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">
            <TrendingUp size={12} className="mr-1" /> {trend}
          </span>
        )}
      </div>
      <p className="mt-6 text-xs text-gray-400 leading-relaxed font-medium">{subtext}</p>
    </div>
  </motion.div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to fetch academic stats', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
       <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
       <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Syncing Academy Data...</p>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
         >
            <h1 className="text-4xl font-black text-primary dark:text-white tracking-tight">System Overview</h1>
            <p className="text-gray-500 mt-2 font-medium">Global management of Afera Innov Academy operations.</p>
         </motion.div>
         <div className="flex items-center space-x-3">
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl px-6 py-3 flex items-center shadow-sm">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-3"></div>
               <span className="text-xs font-black text-primary dark:text-white uppercase tracking-widest">Server Live</span>
            </div>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          icon={Users} 
          label="Active Scholars" 
          value={stats?.totalStudents || 0} 
          trend="+12.5%"
          color="bg-blue-50 dark:bg-blue-900/20"
          subtext="Total registered students across all specialized programs."
          delay={0.1}
        />
        <StatCard 
          icon={UserCheck} 
          label="Admissions" 
          value={stats?.totalUsers || 0} 
          trend="+8.2%"
          color="bg-emerald-50 dark:bg-emerald-900/20"
          subtext="New applications received during the 2026 intake window."
          delay={0.2}
        />
        <StatCard 
          icon={BookOpen} 
          label="Elite Courses" 
          value={stats?.totalCourses || 0} 
          color="bg-amber-50 dark:bg-amber-900/20"
          subtext="Active Master's and Certificate programs currently in session."
          delay={0.3}
        />
        <StatCard 
          icon={MessageSquare} 
          label="Inquiries" 
          value={stats?.totalContacts || 0} 
          color="bg-purple-50 dark:bg-purple-900/20"
          subtext="Public inquiries and contact form submissions awaiting response."
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Enrollment Overview */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[48px] shadow-sm border border-gray-100 dark:border-slate-800 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
               <h3 className="text-2xl font-bold text-primary dark:text-white">Growth Trajectory</h3>
               <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Enrollment Analytics 2026</p>
            </div>
            <div className="flex space-x-6">
               <div className="flex items-center space-x-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/20"></div>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">In-House</span>
               </div>
               <div className="flex items-center space-x-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-lg shadow-accent/20"></div>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Digital</span>
               </div>
            </div>
          </div>
          
          <div className="h-72 w-full flex items-end justify-between relative px-4">
             {/* Animated Chart Simulation */}
             <svg className="absolute inset-0 w-full h-full text-primary/5 dark:text-white/5" preserveAspectRatio="none">
                <path d="M0,200 Q200,50 400,150 T800,100 T1200,180" fill="none" stroke="currentColor" strokeWidth="60" />
             </svg>
             <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent z-0"></div>
             
             {[60, 85, 45, 95, 70, 80, 55, 90, 65, 100].map((h, i) => (
               <div key={i} className="flex-1 max-w-[40px] flex flex-col justify-end items-center group/bar relative z-10">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.6 + (i * 0.05), duration: 1 }}
                    className="w-full bg-primary/10 rounded-t-2xl group-hover/bar:bg-primary/20 transition-all cursor-pointer relative"
                  >
                     <div className="absolute bottom-0 left-0 w-full bg-primary rounded-t-2xl opacity-40" style={{ height: '60%' }}></div>
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover/bar:opacity-100 transition-opacity pb-2">
                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg whitespace-nowrap">{h}% Growth</span>
                     </div>
                  </motion.div>
               </div>
             ))}
          </div>
          <div className="flex justify-between mt-8 px-4 text-[10px] font-black text-gray-300 uppercase tracking-widest border-t border-gray-50 pt-6">
             <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span>
          </div>
        </motion.div>

        {/* Academic Calendar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-primary rounded-[48px] p-10 text-white shadow-2xl shadow-primary/30 relative overflow-hidden flex flex-col"
        >
           <div className="flex items-center justify-between mb-10 relative z-10">
             <h3 className="text-2xl font-bold">Timeline</h3>
             <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <CalendarIcon size={20} />
             </div>
           </div>
           
           <div className="space-y-8 relative z-10 flex-1">
              {[
                { date: '12 JUL', event: 'Summer Intake Deadline', type: 'Critical', color: 'bg-accent' },
                { date: '15 JUL', event: 'Faculty Board Meeting', type: 'Administrative', color: 'bg-white/20' },
                { date: '20 JUL', event: 'Global Resource Webinar', type: 'Academic', color: 'bg-white/20' },
                { date: '05 AUG', event: 'Annual Budget Review', type: 'Finance', color: 'bg-white/20' },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-6 group cursor-pointer">
                   <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${item.color} mt-1.5 shadow-[0_0_15px_rgba(255,255,255,0.3)]`}></div>
                      {i !== 3 && <div className="w-0.5 h-12 bg-white/10 mt-2"></div>}
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none mb-2">{item.date} • {item.type}</p>
                      <p className="text-sm font-bold text-white group-hover:text-accent transition-colors">{item.event}</p>
                   </div>
                </div>
              ))}
           </div>

           <button className="w-full mt-12 py-5 bg-white text-primary rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-xl shadow-black/10 relative z-10">
             Strategic Roadmap 2026
           </button>
           
           <Clock size={300} className="absolute -right-20 -bottom-20 text-white/5 pointer-events-none" />
        </motion.div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm group hover:border-primary/20 transition-all cursor-pointer">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
               <UserCheck size={24} />
            </div>
            <h4 className="text-xl font-bold text-primary dark:text-white mb-2">Review Applications</h4>
            <p className="text-sm text-gray-400">Process pending student admissions and verify documents.</p>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm group hover:border-accent/20 transition-all cursor-pointer">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-all">
               <DollarSign size={24} />
            </div>
            <h4 className="text-xl font-bold text-primary dark:text-white mb-2">Finance Overview</h4>
            <p className="text-sm text-gray-400">Monitor revenue streams and student tuition payments.</p>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm group hover:border-emerald-500/20 transition-all cursor-pointer">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all">
               <BookOpen size={24} />
            </div>
            <h4 className="text-xl font-bold text-primary dark:text-white mb-2">Curriculum Hub</h4>
            <p className="text-sm text-gray-400">Update specialized modules and program details.</p>
         </div>
      </div>
    </div>
  );
}

