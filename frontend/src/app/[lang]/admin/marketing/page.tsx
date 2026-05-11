'use client';

import React, { useState } from 'react';
import { 
  Megaphone, 
  TrendingUp, 
  Users, 
  Target, 
  Mail, 
  Globe, 
  Plus,
  BarChart2,
  Calendar,
  MoreVertical,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState('campaigns');

  const stats = [
    { label: 'Total Leads (This Month)', value: '1,248', change: '+12%', icon: Users, color: 'text-primary' },
    { label: 'Conversion Rate', value: '8.4%', change: '+1.2%', icon: Target, color: 'text-accent' },
    { label: 'Email Open Rate', value: '24.5%', change: '-0.5%', icon: Mail, color: 'text-emerald-500' },
    { label: 'Social Reach', value: '45.2K', change: '+22%', icon: Share2, color: 'text-blue-500' }
  ];

  const campaigns = [
    { id: 1, name: 'Fall Admissions Drive', status: 'Active', reach: '12,500', budget: '$4,500', leads: 450, date: 'Oct 1 - Nov 30' },
    { id: 2, name: 'Executive Masters Promo', status: 'Active', reach: '8,200', budget: '$2,000', leads: 125, date: 'Nov 5 - Dec 15' },
    { id: 3, name: 'Alumni Referral Campaign', status: 'Planned', reach: '---', budget: '$1,000', leads: 0, date: 'Jan 10 - Feb 28' },
    { id: 4, name: 'Summer Engineering Bootcamp', status: 'Completed', reach: '25,000', budget: '$5,000', leads: 850, date: 'Jul 1 - Aug 30' },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-primary dark:text-white tracking-tight">Marketing & <span className="text-accent italic">Outreach</span></h2>
          <p className="text-gray-500 mt-2 font-medium">Manage enrollment campaigns, lead generation, and institutional branding.</p>
        </div>
        <div className="flex space-x-3">
           <Button className="bg-primary text-white rounded-2xl px-6 h-12 font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              <Plus size={16} className="mr-2" /> New Campaign
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
              <div className="flex justify-between items-start mb-4">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-slate-800 ${stat.color}`}>
                    <stat.icon size={22} />
                 </div>
                 <span className={`text-xs font-black px-3 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                    {stat.change}
                 </span>
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
            <h3 className="text-xl font-bold text-primary dark:text-white">Active Campaigns</h3>
            <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
               <button onClick={() => setActiveTab('campaigns')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'campaigns' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-gray-400 hover:text-primary'}`}>All Campaigns</button>
               <button onClick={() => setActiveTab('leads')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'leads' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-gray-400 hover:text-primary'}`}>Lead Pipeline</button>
            </div>
         </div>

         <div className="p-0">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                     <th className="px-12 py-6">Campaign Name</th>
                     <th className="px-12 py-6">Timeline</th>
                     <th className="px-12 py-6">Status</th>
                     <th className="px-12 py-6">Reach / Leads</th>
                     <th className="px-12 py-6">Budget</th>
                     <th className="px-12 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {campaigns.map((camp) => (
                    <tr key={camp.id} className="group hover:bg-gray-50/30 transition-colors border-b border-gray-50 dark:border-slate-800 last:border-0">
                       <td className="px-12 py-6">
                          <div className="flex items-center space-x-4">
                             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                <Megaphone size={18} />
                             </div>
                             <span className="text-sm font-bold text-primary dark:text-white">{camp.name}</span>
                          </div>
                       </td>
                       <td className="px-12 py-6">
                          <div className="flex items-center space-x-2 text-gray-500 text-sm font-medium">
                             <Calendar size={14} className="text-gray-400" />
                             <span>{camp.date}</span>
                          </div>
                       </td>
                       <td className="px-12 py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                             camp.status === 'Active' ? 'bg-emerald-50 text-emerald-500' :
                             camp.status === 'Planned' ? 'bg-amber-50 text-amber-500' : 'bg-gray-100 text-gray-500'
                          }`}>
                             {camp.status}
                          </span>
                       </td>
                       <td className="px-12 py-6">
                          <div>
                             <p className="text-sm font-bold text-primary dark:text-white">{camp.reach}</p>
                             <p className="text-[10px] text-accent font-bold uppercase tracking-widest">{camp.leads} Conversions</p>
                          </div>
                       </td>
                       <td className="px-12 py-6 text-sm font-black text-gray-600 dark:text-gray-300">
                          {camp.budget}
                       </td>
                       <td className="px-12 py-6 text-right">
                          <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                             <MoreVertical size={18} />
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
