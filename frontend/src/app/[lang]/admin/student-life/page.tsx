'use client';

import React, { useState } from 'react';
import { 
  HeartHandshake, 
  CalendarDays, 
  Users, 
  LifeBuoy, 
  Plus,
  MessageSquare,
  Activity,
  Award,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function StudentLifeDashboard() {
  const [activeTab, setActiveTab] = useState('events');

  const stats = [
    { label: 'Active Clubs', value: '24', icon: Users, color: 'text-primary' },
    { label: 'Upcoming Events', value: '8', icon: CalendarDays, color: 'text-accent' },
    { label: 'Open Helpdesk Tickets', value: '15', icon: LifeBuoy, color: 'text-red-500' },
    { label: 'Student Council Members', value: '12', icon: Award, color: 'text-emerald-500' }
  ];

  const events = [
    { id: 1, name: 'Annual Tech Hackathon', organizer: 'Computer Science Club', date: 'Nov 15, 2026', attendees: 120, status: 'Upcoming' },
    { id: 2, name: 'Mental Health Awareness Week', organizer: 'Wellbeing Center', date: 'Nov 20, 2026', attendees: 350, status: 'Upcoming' },
    { id: 3, name: 'Alumni Networking Dinner', organizer: 'Student Council', date: 'Dec 05, 2026', attendees: 80, status: 'Planning' },
    { id: 4, name: 'Freshers Orientation', organizer: 'Admissions & Life', date: 'Sep 01, 2026', attendees: 500, status: 'Completed' },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-primary dark:text-white tracking-tight">Student <span className="text-accent italic">Life & Wellbeing</span></h2>
          <p className="text-gray-500 mt-2 font-medium">Manage campus activities, student organizations, and support services.</p>
        </div>
        <div className="flex space-x-3">
           <Button className="bg-primary text-white rounded-2xl px-6 h-12 font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              <Plus size={16} className="mr-2" /> Schedule Event
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
            <h3 className="text-xl font-bold text-primary dark:text-white">Campus Events</h3>
            <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
               <button onClick={() => setActiveTab('events')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'events' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-gray-400 hover:text-primary'}`}>Events</button>
               <button onClick={() => setActiveTab('clubs')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'clubs' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-gray-400 hover:text-primary'}`}>Clubs & Societies</button>
               <button onClick={() => setActiveTab('support')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'support' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-gray-400 hover:text-primary'}`}>Wellbeing</button>
            </div>
         </div>

         <div className="p-0">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                     <th className="px-12 py-6">Event Name</th>
                     <th className="px-12 py-6">Organizer</th>
                     <th className="px-12 py-6">Date</th>
                     <th className="px-12 py-6">Est. Attendees</th>
                     <th className="px-12 py-6">Status</th>
                     <th className="px-12 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {events.map((evt) => (
                    <tr key={evt.id} className="group hover:bg-gray-50/30 transition-colors border-b border-gray-50 dark:border-slate-800 last:border-0">
                       <td className="px-12 py-6">
                          <div className="flex items-center space-x-4">
                             <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                <Activity size={18} />
                             </div>
                             <span className="text-sm font-bold text-primary dark:text-white">{evt.name}</span>
                          </div>
                       </td>
                       <td className="px-12 py-6 text-sm font-medium text-gray-500">
                          {evt.organizer}
                       </td>
                       <td className="px-12 py-6 text-sm font-bold text-primary dark:text-white">
                          {evt.date}
                       </td>
                       <td className="px-12 py-6 text-sm font-black text-gray-600 dark:text-gray-300">
                          {evt.attendees}
                       </td>
                       <td className="px-12 py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                             evt.status === 'Upcoming' ? 'bg-emerald-50 text-emerald-500' :
                             evt.status === 'Planning' ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-500'
                          }`}>
                             {evt.status}
                          </span>
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
