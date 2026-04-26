'use client';

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  PieChart,
  LineChart
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function AdminReportsPage() {
  const stats = [
    { label: 'Total Enrollment', value: '1,284', growth: '+12%', up: true, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Academic Revenue', value: '$84,200', growth: '+8.4%', up: true, icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Graduation Rate', value: '94.2%', growth: '+2.1%', up: true, icon: GraduationCap, color: 'bg-amber-50 text-amber-600' },
    { label: 'Active Inquiry', value: '42', growth: '-4%', up: false, icon: BarChart3, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">Strategic Analytics</h1>
          <p className="text-gray-500 mt-2 font-medium">Visualizing academy performance and academic growth metrics.</p>
        </div>
        <div className="flex items-center space-x-3">
           <Button variant="outline" className="rounded-2xl border-gray-100 px-6">
              <Calendar size={18} className="mr-2" /> Quarter: Q2 2026
           </Button>
           <Button className="bg-primary text-white rounded-2xl px-8 shadow-lg shadow-primary/20">
              <Download size={18} className="mr-2" /> Export Performance Report
           </Button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {stats.map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-xl transition-all"
           >
              <div className="flex items-center justify-between mb-6">
                 <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center`}>
                    <stat.icon size={26} />
                 </div>
                 <div className={`flex items-center text-xs font-bold ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stat.up ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                    {stat.growth}
                 </div>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-3">{stat.label}</p>
              <h3 className="text-3xl font-black text-primary dark:text-white">{stat.value}</h3>
           </motion.div>
         ))}
      </div>

      {/* Main Charts Area (Simulated Visuals) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Enrollment Trend */}
         <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[48px] p-10 border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h3 className="text-xl font-bold text-primary dark:text-white">Enrollment Trajectory</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time Admission Data</p>
               </div>
               <div className="flex items-center space-x-3">
                  <div className="flex items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="w-2 h-2 rounded-full bg-primary mr-2"></span> On-Campus
                  </div>
                  <div className="flex items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="w-2 h-2 rounded-full bg-accent mr-2"></span> Online
                  </div>
               </div>
            </div>
            
            {/* Chart Graphic Simulation */}
            <div className="h-64 relative flex items-end justify-between px-4 space-x-2">
               {[40, 70, 45, 90, 65, 80, 50, 85, 100, 60, 75, 95].map((h, i) => (
                 <div key={i} className="flex-1 group relative">
                    <div 
                      className="w-full bg-primary/10 group-hover:bg-primary/20 rounded-t-xl transition-all"
                      style={{ height: `${h}%` }}
                    ></div>
                    <div 
                      className="absolute bottom-0 left-0 w-full bg-primary group-hover:bg-accent rounded-t-xl transition-all"
                      style={{ height: `${h * 0.6}%` }}
                    ></div>
                 </div>
               ))}
            </div>
            <div className="flex justify-between mt-6 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
               <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
         </div>

         {/* Distribution */}
         <div className="bg-white dark:bg-slate-900 rounded-[48px] p-10 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-primary dark:text-white mb-8">Program Popularity</h3>
            
            <div className="flex-1 flex flex-col justify-center space-y-8">
               {[
                 { name: "Master's Degree", val: 65, color: "bg-primary" },
                 { name: "Professional Certs", val: 25, color: "bg-accent" },
                 { name: "Executive Workshops", val: 10, color: "bg-emerald-500" }
               ].map((item, i) => (
                 <div key={i} className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                       <span className="text-gray-500">{item.name}</span>
                       <span className="text-primary">{item.val}%</span>
                    </div>
                    <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${item.val}%` }}
                         transition={{ duration: 1.5, delay: i * 0.2 }}
                         className={`h-full ${item.color} rounded-full`}
                       ></motion.div>
                    </div>
                 </div>
               ))}
            </div>
            
            <div className="pt-8 border-t border-gray-50 mt-8">
               <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest text-primary hover:bg-gray-50 rounded-2xl py-4">
                  View Demographic Analysis <ChevronRight size={16} className="ml-1" />
               </Button>
            </div>
         </div>

      </div>

      {/* Advanced Metrics */}
      <div className="bg-primary rounded-[56px] p-12 text-white relative overflow-hidden">
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
               <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Student Satisfaction</p>
               <h4 className="text-4xl font-black mb-4">4.8 / 5.0</h4>
               <div className="flex space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="fill-accent text-accent" />)}
               </div>
               <p className="text-sm text-white/70 leading-relaxed">Based on 840+ academic reviews from graduates across 12 countries.</p>
            </div>
            <div className="md:border-l md:border-white/10 md:pl-12">
               <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Resource Utilization</p>
               <h4 className="text-4xl font-black mb-4">82%</h4>
               <p className="text-sm text-white/70 leading-relaxed">Average engagement rate with the online resource library and digital workshops.</p>
            </div>
            <div className="md:border-l md:border-white/10 md:pl-12">
               <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">System Uptime</p>
               <h4 className="text-4xl font-black mb-4">99.98%</h4>
               <p className="text-sm text-white/70 leading-relaxed">High-availability cluster performance across all regional access points.</p>
            </div>
         </div>
         <BarChart3 size={300} className="absolute -right-20 -bottom-20 text-white/5" />
      </div>

    </div>
  );
}

function Star({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
