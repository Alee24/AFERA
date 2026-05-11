'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Mail, 
  Trash2, 
  Star,
  Archive,
  Building2,
  Clock,
  Globe,
  User,
  Plus,
  FileText,
  PhoneCall,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/lib/NotificationContext';
import api from '@/lib/api';
import { motion } from 'framer-motion';

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity'>('activity');
  const [interactionTitle, setInteractionTitle] = useState('');
  const [interactionDetails, setInteractionDetails] = useState('');
  const [interactionType, setInteractionType] = useState('note');
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/contacts');
      setContacts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      showNotification('Failed to load contacts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectContact = async (contact: any) => {
    try {
      const res = await api.get(`/contacts/${contact.id}`);
      setSelectedContact(res.data);
      setActiveTab('activity');
    } catch (err) {
      showNotification('Failed to load contact details', 'error');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/contacts/${id}`, { status });
      showNotification('Contact status updated', 'success');
      fetchContacts();
      if (selectedContact?.id === id) setSelectedContact({ ...selectedContact, status });
    } catch (err) {
      showNotification('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this contact?')) return;
    try {
      await api.delete(`/contacts/${id}`);
      showNotification('Contact deleted', 'success');
      fetchContacts();
      setSelectedContact(null);
    } catch (err) {
      showNotification('Failed to delete contact', 'error');
    }
  };

  const handleAddInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;
    try {
      await api.post(`/contacts/${selectedContact.id}/interactions`, {
        type: interactionType,
        title: interactionTitle,
        details: interactionDetails
      });
      showNotification('Interaction logged successfully', 'success');
      setInteractionTitle('');
      setInteractionDetails('');
      handleSelectContact(selectedContact); // refresh
    } catch (err) {
      showNotification('Failed to log interaction', 'error');
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex gap-8">
      
      {/* Sidebar List */}
      <div className="w-[350px] flex flex-col space-y-6">
        <div className="flex items-center justify-between">
           <h1 className="text-3xl font-bold text-primary dark:text-white">CRM Contacts</h1>
           <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary font-bold">
              {contacts.length}
           </div>
        </div>

        <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           <input 
             type="text" 
             placeholder="Search contacts..." 
             className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-primary/10"
           />
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
           <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-800">
              {loading ? (
                <div className="p-10 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest text-xs">Loading CRM...</div>
              ) : contacts.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No contacts yet.</div>
              ) : contacts.map(contact => (
                <div 
                  key={contact.id} 
                  onClick={() => handleSelectContact(contact)}
                  className={`p-6 cursor-pointer transition-all border-l-4 ${
                    selectedContact?.id === contact.id ? 'bg-gray-50/80 border-primary' : 'hover:bg-gray-50/50 border-transparent'
                  }`}
                >
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold">
                         {contact.name[0]}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-primary dark:text-white line-clamp-1">{contact.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block mt-1">{contact.email}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* CRM Profile Layout */}
      <div className="flex-1 flex gap-8">
         {selectedContact ? (
           <>
              {/* Profile Details Sidebar */}
              <div className="w-[300px] flex flex-col space-y-6">
                 <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-sm p-8 text-center relative">
                    <button onClick={() => handleUpdateStatus(selectedContact.id, 'archived')} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-primary"><Star size={18} /></button>
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-accent text-white flex items-center justify-center text-3xl font-black mb-4 shadow-xl shadow-accent/20">
                       {selectedContact.name[0]}
                    </div>
                    <h2 className="text-xl font-bold text-primary dark:text-white">{selectedContact.name}</h2>
                    <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">Lead / Inquiry</p>
                 </div>

                 <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-4 bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 flex items-center">
                       <User size={16} className="text-primary mr-2" />
                       <h3 className="text-xs font-black uppercase tracking-widest text-primary dark:text-white">Contact Details</h3>
                    </div>
                    <div className="p-6 space-y-6">
                       <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                          <p className="text-sm font-medium text-primary dark:text-white">{selectedContact.email}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Source Subject</p>
                          <p className="text-sm font-medium text-primary dark:text-white">{selectedContact.subject}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Created</p>
                          <p className="text-sm font-medium text-primary dark:text-white">{new Date(selectedContact.created_at).toLocaleDateString()}</p>
                       </div>
                    </div>
                 </div>
                 
                 <Button onClick={() => handleDelete(selectedContact.id)} variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl h-12 font-bold w-full">
                   <Trash2 size={16} className="mr-2" /> Delete Contact
                 </Button>
              </div>

              {/* Activity & Overview Area */}
              <div className="flex-1 bg-white dark:bg-slate-900 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
                 <div className="flex border-b border-gray-100 dark:border-slate-800">
                    <button 
                      onClick={() => setActiveTab('overview')}
                      className={`px-8 py-5 text-sm font-bold border-b-2 transition-all ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-primary'}`}
                    >
                       Overview
                    </button>
                    <button 
                      onClick={() => setActiveTab('activity')}
                      className={`px-8 py-5 text-sm font-bold border-b-2 transition-all ${activeTab === 'activity' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-primary'}`}
                    >
                       Activity Log
                    </button>
                 </div>

                 {activeTab === 'overview' ? (
                   <div className="p-10 flex-1 overflow-y-auto">
                      <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
                         <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4">Original Inquiry Message</h3>
                         <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {selectedContact.message}
                         </p>
                      </div>
                   </div>
                 ) : (
                   <div className="flex-1 flex flex-col h-full overflow-hidden">
                      {/* Log Action Bar */}
                      <div className="p-6 bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                         <form onSubmit={handleAddInteraction} className="space-y-4">
                            <div className="flex items-center space-x-2">
                               {['note', 'conversation', 'event'].map(type => (
                                 <button 
                                   key={type}
                                   type="button"
                                   onClick={() => setInteractionType(type)}
                                   className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${interactionType === type ? 'bg-primary text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-primary'}`}
                                 >
                                    {type}
                                 </button>
                               ))}
                            </div>
                            <input 
                               required
                               type="text" 
                               value={interactionTitle}
                               onChange={(e) => setInteractionTitle(e.target.value)}
                               placeholder="Interaction Title (e.g., Intro Call)"
                               className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-sm focus:border-primary outline-none"
                            />
                            <div className="flex space-x-4">
                               <textarea 
                                 value={interactionDetails}
                                 onChange={(e) => setInteractionDetails(e.target.value)}
                                 placeholder="Log details here..."
                                 rows={2}
                                 className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4 font-medium text-sm focus:border-primary outline-none resize-none"
                               />
                               <Button type="submit" className="bg-primary text-white rounded-xl px-8 h-auto font-bold">
                                  Log Activity
                               </Button>
                            </div>
                         </form>
                      </div>

                      {/* Timeline */}
                      <div className="flex-1 overflow-y-auto p-10 space-y-8">
                         {selectedContact.Interactions && selectedContact.Interactions.length > 0 ? (
                           selectedContact.Interactions.map((interaction: any) => (
                             <div key={interaction.id} className="relative pl-8">
                                <div className="absolute left-0 top-0 bottom-[-32px] w-0.5 bg-gray-100 dark:bg-slate-800 last:bottom-0"></div>
                                <div className={`absolute left-[-5px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                                  interaction.type === 'note' ? 'bg-orange-400' : 
                                  interaction.type === 'conversation' ? 'bg-blue-500' : 'bg-emerald-500'
                                }`}></div>
                                
                                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative">
                                   <div className="flex justify-between items-start mb-2">
                                      <h4 className="text-sm font-bold text-primary dark:text-white">{interaction.title}</h4>
                                      <span className="text-[10px] text-gray-400 font-bold">
                                         {new Date(interaction.created_at).toLocaleString()}
                                      </span>
                                   </div>
                                   {interaction.details && (
                                     <p className="text-xs text-gray-500 leading-relaxed mt-2 whitespace-pre-wrap">{interaction.details}</p>
                                   )}
                                   <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                      <User size={12} className="mr-1" /> Logged by {interaction.author}
                                   </div>
                                </div>
                             </div>
                           ))
                         ) : (
                           <div className="text-center text-gray-400 font-bold py-10">No activities logged yet.</div>
                         )}
                      </div>
                   </div>
                 )}
              </div>
           </>
         ) : (
           <div className="flex-1 bg-white dark:bg-slate-900 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center p-20 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-200 mb-8">
                 <Building2 size={48} />
              </div>
              <h3 className="text-xl font-bold text-primary dark:text-white mb-2">Select a Contact</h3>
              <p className="text-gray-400 max-w-xs">View the detailed CRM profile and interaction history.</p>
           </div>
         )}
      </div>

    </div>
  );
}
