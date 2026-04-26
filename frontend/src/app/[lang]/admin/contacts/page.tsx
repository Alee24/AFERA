'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Mail, 
  Trash2, 
  CheckCircle, 
  Clock, 
  User,
  Star,
  Reply,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/lib/NotificationContext';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/contacts');
      setContacts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      showNotification('Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/contacts/${id}`, { status });
      showNotification('Message updated', 'success');
      fetchContacts();
      if (selectedContact?.id === id) setSelectedContact({ ...selectedContact, status });
    } catch (err) {
      showNotification('Failed to update message', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this message?')) return;
    try {
      await api.delete(`/contacts/${id}`);
      showNotification('Message deleted', 'success');
      fetchContacts();
      setSelectedContact(null);
    } catch (err) {
      showNotification('Failed to delete message', 'error');
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex gap-8">
      
      {/* Sidebar List */}
      <div className="w-[450px] flex flex-col space-y-6">
        <div className="flex items-center justify-between">
           <h1 className="text-3xl font-bold text-primary dark:text-white">Inbox</h1>
           <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary font-bold">
              {contacts.filter(c => c.status === 'unread').length}
           </div>
        </div>

        <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           <input 
             type="text" 
             placeholder="Search messages..." 
             className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-primary/10"
           />
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
           <div className="p-4 border-b border-gray-50 flex items-center space-x-2 overflow-x-auto">
              <button className="px-4 py-2 bg-primary/5 text-primary rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap">All Messages</button>
              <button className="px-4 py-2 text-gray-400 hover:bg-gray-50 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors">Unread</button>
              <button className="px-4 py-2 text-gray-400 hover:bg-gray-50 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors">Archived</button>
           </div>
           
           <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-800">
              {loading ? (
                <div className="p-10 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Mail Server...</div>
              ) : contacts.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No messages yet.</div>
              ) : contacts.map(contact => (
                <div 
                  key={contact.id} 
                  onClick={() => setSelectedContact(contact)}
                  className={`p-6 cursor-pointer transition-all border-l-4 ${
                    selectedContact?.id === contact.id ? 'bg-gray-50/80 border-primary' : 'hover:bg-gray-50/50 border-transparent'
                  } ${contact.status === 'unread' ? 'font-bold' : ''}`}
                >
                   <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-primary dark:text-white line-clamp-1">{contact.name}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">
                         {new Date(contact.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                   </div>
                   <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {contact.message}
                   </p>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Message Reader */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
         {selectedContact ? (
           <>
              {/* Toolbar */}
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                    <button onClick={() => handleUpdateStatus(selectedContact.id, 'unread')} className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 transition-all"><Star size={20} /></button>
                    <button onClick={() => handleUpdateStatus(selectedContact.id, 'archived')} className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 transition-all"><Archive size={20} /></button>
                    <button onClick={() => handleDelete(selectedContact.id)} className="p-3 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-2xl transition-all"><Trash2 size={20} /></button>
                 </div>
                 <div className="flex items-center space-x-2">
                    <button className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 transition-all"><ChevronLeft size={20} /></button>
                    <button className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 transition-all"><ChevronRight size={20} /></button>
                 </div>
              </div>

               {/* Header */}
               <div className="p-10 border-b border-gray-50">
                  <div className="flex items-start justify-between mb-8">
                     <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-accent text-white rounded-3xl flex items-center justify-center text-2xl font-black shadow-xl shadow-accent/20">
                           {selectedContact.name[0]}
                        </div>
                        <div>
                           <h2 className="text-2xl font-bold text-primary dark:text-white mb-1">{selectedContact.name}</h2>
                           <p className="text-sm text-gray-400 flex items-center">
                              <Mail size={14} className="mr-2" /> {selectedContact.email}
                           </p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-bold text-primary dark:text-white">
                           {new Date(selectedContact.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Received • System Portal</p>
                     </div>
                  </div>
                  
                  <div className="bg-primary/5 rounded-2xl p-6 border border-primary/5">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Subject</p>
                     <h4 className="text-xl font-bold text-primary">{selectedContact.subject}</h4>
                  </div>
               </div>

              {/* Body */}
              <div className="p-12 flex-1 overflow-y-auto">
                 <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedContact.message}
                 </p>
              </div>

              {/* Footer / Reply */}
              <div className="p-8 border-t border-gray-50 bg-gray-50/30">
                 <Button className="bg-primary text-white rounded-2xl px-10 py-5 flex items-center shadow-lg shadow-primary/20">
                    <Reply size={20} className="mr-3" /> Quick Reply
                 </Button>
              </div>
           </>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-200 mb-8">
                 <MessageSquare size={48} />
              </div>
              <h3 className="text-xl font-bold text-primary dark:text-white mb-2">Select a message to read</h3>
              <p className="text-gray-400 max-w-xs">View full inquiry details and respond directly from the dashboard.</p>
           </div>
         )}
      </div>

    </div>
  );
}
