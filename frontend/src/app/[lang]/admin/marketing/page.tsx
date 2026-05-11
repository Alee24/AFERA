'use client';

import React, { useState, useEffect } from 'react';
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
  Share2,
  Phone,
  MessageSquare,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/Modal';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';

export default function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [leads, setLeads] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const { showNotification } = useNotification();

  const stats = [
    { label: 'Total Leads (This Month)', value: '1,248', change: '+12%', icon: Users, color: 'text-primary' },
    { label: 'Conversion Rate', value: '8.4%', change: '+1.2%', icon: Target, color: 'text-accent' },
    { label: 'Email Open Rate', value: '24.5%', change: '-0.5%', icon: Mail, color: 'text-emerald-500' },
    { label: 'Social Reach', value: '45.2K', change: '+22%', icon: Share2, color: 'text-blue-500' }
  ];
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'Fall Admissions Drive', status: 'Active', reach: '12,500', budget: '$4,500', leads: 450, date: 'Oct 1 - Nov 30' },
    { id: 2, name: 'Executive Masters Promo', status: 'Active', reach: '8,200', budget: '$2,000', leads: 125, date: 'Nov 5 - Dec 15' },
    { id: 3, name: 'Alumni Referral Campaign', status: 'Planned', reach: '---', budget: '$1,000', leads: 0, date: 'Jan 10 - Feb 28' },
    { id: 4, name: 'Summer Engineering Bootcamp', status: 'Completed', reach: '25,000', budget: '$5,000', leads: 850, date: 'Jul 1 - Aug 30' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    status: 'Planned',
    budget: '',
    date: ''
  });

  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    subject: 'New Lead',
    message: ''
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/contacts');
      setLeads(res.data);
    } catch (err) {
      console.error('Failed to load leads');
    }
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp = {
      id: campaigns.length + 1,
      name: formData.name,
      status: formData.status,
      reach: '---',
      budget: formData.budget || '$0',
      leads: 0,
      date: formData.date || 'TBD'
    };
    setCampaigns([newCamp, ...campaigns]);
    setIsModalOpen(false);
    setFormData({ name: '', status: 'Planned', budget: '', date: '' });
    showNotification('Campaign created successfully', 'success');
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/contacts', leadForm);
      showNotification('Lead added successfully', 'success');
      setIsLeadModalOpen(false);
      setLeadForm({ name: '', email: '', subject: 'New Lead', message: '' });
      fetchLeads();
    } catch (err) {
      showNotification('Failed to add lead', 'error');
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-primary dark:text-white tracking-tight">Marketing & <span className="text-accent italic">Outreach</span></h2>
          <p className="text-gray-500 mt-2 font-medium">Manage enrollment campaigns, lead generation, and institutional branding.</p>
        </div>
        <div className="flex space-x-3">
           <Button onClick={() => setIsLeadModalOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl px-6 h-12 font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">
              <Plus size={16} className="mr-2" /> New Lead
           </Button>
           <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary-600 text-white rounded-2xl px-6 h-12 font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
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
            <h3 className="text-xl font-bold text-primary dark:text-white">{activeTab === 'campaigns' ? 'Active Campaigns' : 'Lead Pipeline'}</h3>
            <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
               <button onClick={() => setActiveTab('campaigns')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'campaigns' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-gray-400 hover:text-primary'}`}>All Campaigns</button>
               <button onClick={() => setActiveTab('leads')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'leads' ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm' : 'text-gray-400 hover:text-primary'}`}>Lead Pipeline</button>
            </div>
         </div>

         <div className="p-0">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">
                     <th className="px-12 py-6">{activeTab === 'campaigns' ? 'Campaign Name' : 'Lead Identity'}</th>
                     <th className="px-12 py-6">{activeTab === 'campaigns' ? 'Timeline' : 'Contact Information'}</th>
                     <th className="px-12 py-6">Status</th>
                     <th className="px-12 py-6">{activeTab === 'campaigns' ? 'Reach / Leads' : 'Inquiry Type'}</th>
                     <th className="px-12 py-6">{activeTab === 'campaigns' ? 'Budget' : 'Date Received'}</th>
                     <th className="px-12 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {activeTab === 'campaigns' ? campaigns.map((camp) => (
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
                  )) : (leads || []).map((lead) => (
                    <tr key={lead.id} className="group hover:bg-gray-50/30 transition-colors border-b border-gray-50 dark:border-slate-800 last:border-0">
                       <td className="px-12 py-6">
                          <div className="flex items-center space-x-4">
                             <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center text-accent">
                                <Users size={18} />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-primary dark:text-white">{lead.name}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{lead.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-12 py-6">
                          <div className="flex items-center space-x-4">
                             <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-400">
                                <Mail size={14} />
                             </Button>
                             <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-400">
                                <Phone size={14} />
                             </Button>
                          </div>
                       </td>
                       <td className="px-12 py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                             lead.status === 'processed' ? 'bg-emerald-50 text-emerald-500' :
                             lead.status === 'archived' ? 'bg-gray-100 text-gray-500' : 'bg-amber-50 text-amber-500'
                          }`}>
                             {lead.status || 'New'}
                          </span>
                       </td>
                       <td className="px-12 py-6">
                          <div className="flex items-center text-xs font-bold text-primary dark:text-white">
                             <MessageSquare size={14} className="mr-2 text-accent" />
                             {lead.subject}
                          </div>
                       </td>
                       <td className="px-12 py-6 text-xs font-medium text-gray-500">
                          {new Date(lead.created_at).toLocaleDateString()}
                       </td>
                       <td className="px-12 py-6 text-right">
                          <button 
                            onClick={() => window.location.href=`/en/admin/contacts`}
                            className="p-2 text-gray-400 hover:text-primary transition-colors"
                          >
                             <MoreVertical size={18} />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Marketing Campaign">
        <form onSubmit={handleCreateCampaign} className="space-y-8 p-2">
          <div className="space-y-6">
            <div className="relative group">
              <label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-2 block ml-1">Campaign Name</label>
              <div className="relative">
                <Megaphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/10 focus:bg-white dark:focus:bg-slate-900 rounded-[24px] pl-12 pr-6 py-5 font-bold text-sm transition-all outline-none" 
                  placeholder="e.g. Winter Scholarship Promo"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="relative group">
                <label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-2 block ml-1">Status</label>
                <div className="relative">
                  <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-gray-50/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/10 focus:bg-white dark:focus:bg-slate-900 rounded-[24px] pl-12 pr-6 py-5 font-bold text-sm transition-all outline-none appearance-none"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="relative group">
                <label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-2 block ml-1">Budget</label>
                <div className="relative">
                  <BarChart2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="w-full bg-gray-50/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/10 focus:bg-white dark:focus:bg-slate-900 rounded-[24px] pl-12 pr-6 py-5 font-bold text-sm transition-all outline-none" 
                    placeholder="$5,000"
                  />
                </div>
              </div>
            </div>

            <div className="relative group">
              <label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-2 block ml-1">Timeline (Date Range)</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  required
                  type="text" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-gray-50/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/10 focus:bg-white dark:focus:bg-slate-900 rounded-[24px] pl-12 pr-6 py-5 font-bold text-sm transition-all outline-none" 
                  placeholder="e.g. Jan 15 - Feb 20"
                />
              </div>
            </div>
          </div>

          <div className="pt-8 flex items-center justify-between">
            <button type="button" onClick={() => setIsModalOpen(false)} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors">
              Discard Changes
            </button>
            <Button type="submit" className="bg-primary text-white rounded-[24px] px-10 py-6 h-auto font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
              Launch Campaign
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} title="Register New Lead">
        <form onSubmit={handleCreateLead} className="space-y-8 p-2">
          <div className="space-y-6">
            <div className="relative group">
              <label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-2 block ml-1">Lead Identity (Full Name)</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  required
                  type="text" 
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({...leadForm, name: e.target.value})}
                  className="w-full bg-gray-50/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/10 focus:bg-white dark:focus:bg-slate-900 rounded-[24px] pl-12 pr-6 py-5 font-bold text-sm transition-all outline-none" 
                  placeholder="e.g. Dr. John Doe"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-2 block ml-1">Communication Channel (Email)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  required
                  type="email" 
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                  className="w-full bg-gray-50/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/10 focus:bg-white dark:focus:bg-slate-900 rounded-[24px] pl-12 pr-6 py-5 font-bold text-sm transition-all outline-none" 
                  placeholder="john.doe@institution.com"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-2 block ml-1">Inquiry Context</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  required
                  type="text" 
                  value={leadForm.subject}
                  onChange={(e) => setLeadForm({...leadForm, subject: e.target.value})}
                  className="w-full bg-gray-50/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/10 focus:bg-white dark:focus:bg-slate-900 rounded-[24px] pl-12 pr-6 py-5 font-bold text-sm transition-all outline-none" 
                  placeholder="e.g. PhD Program Inquiry"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-2 block ml-1">Detailed Interaction Notes</label>
              <textarea 
                rows={4}
                value={leadForm.message}
                onChange={(e) => setLeadForm({...leadForm, message: e.target.value})}
                className="w-full bg-gray-50/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary/10 focus:bg-white dark:focus:bg-slate-900 rounded-[32px] px-6 py-5 font-bold text-sm transition-all outline-none resize-none" 
                placeholder="Capture specific details about the prospect's needs..."
              />
            </div>
          </div>

          <div className="pt-8 flex items-center justify-between">
            <button type="button" onClick={() => setIsLeadModalOpen(false)} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors">
              Cancel Registration
            </button>
            <Button type="submit" className="bg-emerald-500 text-white rounded-[24px] px-10 py-6 h-auto font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all">
              Save Lead Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
