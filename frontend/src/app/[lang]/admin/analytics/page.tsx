'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  Monitor, 
  GraduationCap,
  Calendar,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  MessageSquare,
  Globe
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// --- Mock Data ---
const enrollmentData = [
  { name: 'Jan', current: 4000, previous: 2400 },
  { name: 'Feb', current: 3000, previous: 1398 },
  { name: 'Mar', current: 2000, previous: 9800 },
  { name: 'Apr', current: 2780, previous: 3908 },
  { name: 'May', current: 1890, previous: 4800 },
  { name: 'Jun', current: 2390, previous: 3800 },
];

const revenueData = [
  { name: 'Jan', actual: 4000, expected: 4500 },
  { name: 'Feb', actual: 3500, expected: 4500 },
  { name: 'Mar', actual: 4800, expected: 4500 },
  { name: 'Apr', actual: 5200, expected: 5000 },
  { name: 'May', actual: 6100, expected: 5000 },
  { name: 'Jun', actual: 5900, expected: 5500 },
];

const distributionData = [
  { name: 'Engineering', value: 400 },
  { name: 'Medicine', value: 300 },
  { name: 'Business', value: 300 },
  { name: 'Arts', value: 200 },
];

const COLORS = ['#2563EB', '#F97316', '#10B981', '#6366F1'];

const atRiskStudents = [
  { name: 'Alex Johnson', gpa: 1.8, attendance: '65%', risk: 'High', color: 'text-red-500 bg-red-50' },
  { name: 'Sarah Miller', gpa: 2.1, attendance: '72%', risk: 'Medium', color: 'text-amber-500 bg-amber-50' },
  { name: 'David Chen', gpa: 1.9, attendance: '68%', risk: 'High', color: 'text-red-500 bg-red-50' },
  { name: 'Emma Wilson', gpa: 2.3, attendance: '78%', risk: 'Medium', color: 'text-amber-500 bg-amber-50' },
];

const recentActivity = [
  { id: 1, user: 'John Doe', action: 'New student registered', time: '2 mins ago', icon: Users, color: 'text-blue-500' },
  { id: 2, user: 'Admin', action: 'Payment received: $1,250', time: '15 mins ago', icon: DollarSign, color: 'text-emerald-500' },
  { id: 3, user: 'System', action: 'New workshop published', time: '1 hour ago', icon: BookOpen, color: 'text-orange-500' },
  { id: 4, user: 'Jane Smith', action: 'Course completed: RBM', time: '3 hours ago', icon: GraduationCap, color: 'text-purple-500' },
];

// --- Components ---

const KPICard = ({ title, value, trend, trendValue, icon: Icon, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col justify-between"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-gray-50 dark:bg-slate-800 ${color}`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
        {trend === 'up' ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
        {trendValue}
      </div>
    </div>
    <div>
      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-black text-primary dark:text-white">{value}</h3>
    </div>
  </motion.div>
);

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('6M');

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-primary dark:text-white">University Analytics</h1>
          <p className="text-gray-500 font-medium">Real-time performance metrics and academic insights.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-white dark:bg-slate-900 rounded-xl p-1 shadow-sm border border-gray-100 dark:border-slate-800">
             {['1M', '3M', '6M', '1Y'].map(t => (
               <button 
                 key={t}
                 onClick={() => setTimeRange(t)}
                 className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${timeRange === t ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-primary'}`}
               >
                 {t}
               </button>
             ))}
          </div>
          <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 text-xs font-bold text-gray-500 hover:text-primary transition-all">
            <Filter size={16} className="mr-2" /> Filters
          </button>
          <button className="flex items-center px-4 py-2 bg-primary text-white rounded-xl shadow-lg text-xs font-bold hover:bg-slate-900 transition-all">
            <Download size={16} className="mr-2" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Students" value="12,845" trend="up" trendValue="12.5%" icon={Users} color="text-blue-500" />
        <KPICard title="Total Revenue" value="$425,000" trend="up" trendValue="8.2%" icon={DollarSign} color="text-emerald-500" />
        <KPICard title="Enrollment Growth" value="24.8%" trend="up" trendValue="5.1%" icon={TrendingUp} color="text-orange-500" />
        <KPICard title="At-Risk Students" value="142" trend="down" trendValue="2.4%" icon={AlertCircle} color="text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Enrollment Trends */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-primary dark:text-white">Enrollment Growth</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Current Year</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Previous Year</span>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentData}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94A3B8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94A3B8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="current" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" />
                <Area type="monotone" dataKey="previous" stroke="#E2E8F0" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Distribution */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col">
          <h3 className="text-xl font-bold text-primary dark:text-white mb-8">Faculty Distribution</h3>
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {distributionData.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-xs font-bold text-gray-500">{d.name}</span>
                  </div>
                  <span className="text-xs font-black text-primary dark:text-white">{(d.value / 12).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* At-Risk Students Panel */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-primary dark:text-white flex items-center">
              <AlertCircle size={20} className="mr-2 text-red-500" /> At-Risk Students
            </h3>
            <button className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {atRiskStudents.map((student, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-transparent hover:border-red-100 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-primary shadow-sm">
                    {student.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary dark:text-white">{student.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium">GPA: {student.gpa} &bull; Att: {student.attendance}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${student.color}`}>
                  {student.risk}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Performance */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800">
           <h3 className="text-lg font-bold text-primary dark:text-white mb-6">Revenue Actual vs Target</h3>
           <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94A3B8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94A3B8' }} />
                  <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                  <Bar dataKey="actual" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="expected" fill="#E2E8F0" radius={[4, 4, 0, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-4 p-4 bg-emerald-50 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                 <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-500 shadow-sm">
                    <TrendingUp size={16} />
                 </div>
                 <p className="text-[10px] font-bold text-emerald-600">On track for Q2 targets</p>
              </div>
              <span className="text-xs font-black text-emerald-600">+12%</span>
           </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-primary dark:text-white mb-6">Live Activity</h3>
          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 relative">
                <div className={`mt-1 w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center ${activity.color}`}>
                   <activity.icon size={16} />
                </div>
                <div>
                   <p className="text-xs font-bold text-primary dark:text-white">{activity.action}</p>
                   <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[10px] text-gray-400 font-medium">{activity.user}</span>
                      <span className="text-[10px] text-gray-400">&bull;</span>
                      <span className="text-[10px] text-gray-400 font-medium">{activity.time}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
            View System Logs
          </button>
        </div>

      </div>

      {/* Online Learning Insights */}
      <div className="bg-primary p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
               <h3 className="text-2xl font-black mb-2">LMS Pulse</h3>
               <p className="text-white/60 text-sm font-medium">Real-time learning engagement metrics from Moodle.</p>
            </div>
            <div className="grid grid-cols-3 md:col-span-3 gap-8">
               <div className="text-center">
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Active Now</p>
                  <p className="text-3xl font-black">1,452</p>
               </div>
               <div className="text-center">
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Completion Rate</p>
                  <p className="text-3xl font-black text-emerald-400">74%</p>
               </div>
               <div className="text-center">
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">Avg. Session</p>
                  <p className="text-3xl font-black text-accent">42m</p>
               </div>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
      </div>
    </div>
  );
}
