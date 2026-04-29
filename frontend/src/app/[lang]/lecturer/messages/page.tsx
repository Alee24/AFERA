'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Search,
  MessageSquare,
  Loader2,
  User,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';

export default function StudentMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { showNotification } = useNotification();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUsers();
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      // Filter out admins or only show students for lecturers
      setUsers(res.data.filter((u: any) => u.id !== user?.id));
    } catch (err) {
      console.error('Failed to load user list');
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages');
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !content.trim()) return;
    setSending(true);
    try {
      await api.post('/messages', {
        receiver_id: selectedUser.id,
        content: content.trim()
      });
      setContent('');
      fetchMessages();
    } catch (err) {
      showNotification('Failed to deliver message', 'error');
    } finally {
      setSending(false);
    }
  };

  const conversation = messages.filter(m => 
    selectedUser && (
      (m.sender_id === user?.id && m.receiver_id === selectedUser.id) ||
      (m.sender_id === selectedUser.id && m.receiver_id === user?.id)
    )
  );

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-gray-400 animate-pulse">Establishing secure message feeds...</div>;

  return (
    <div className="space-y-10 h-[calc(100vh-100px)] flex flex-col">
      <div>
        <h1 className="text-4xl font-black text-primary dark:text-white tracking-tight">Student <span className="text-accent italic">Messages</span></h1>
        <p className="text-gray-500 mt-2 font-medium">Coordinate directly with assigned scholars or administration personnel.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0 overflow-hidden">
         {/* Contacts Sidebar */}
         <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-50 dark:border-slate-800">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-12 pr-4 h-12 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                  />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
               {users.map((u) => (
                 <div 
                   key={u.id}
                   onClick={() => setSelectedUser(u)}
                   className={`p-4 rounded-3xl cursor-pointer transition-all flex items-center space-x-4 border ${
                     selectedUser?.id === u.id 
                       ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' 
                       : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-slate-800 text-primary dark:text-white'
                   }`}
                 >
                    <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 text-primary dark:text-white rounded-2xl flex items-center justify-center font-bold uppercase shadow-sm">
                       {u.first_name?.[0]}{u.last_name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="font-bold truncate">{u.first_name} {u.last_name}</p>
                       <p className={`text-xs font-medium uppercase tracking-widest ${selectedUser?.id === u.id ? 'text-white/60' : 'text-gray-400'}`}>
                          {u.role}
                       </p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Chat Area */}
         <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 flex flex-col overflow-hidden">
            {selectedUser ? (
              <>
                <div className="p-6 border-b border-gray-50 dark:border-slate-800 flex items-center space-x-4 bg-gray-50/50 dark:bg-slate-800/20">
                   <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold uppercase">
                      {selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}
                   </div>
                   <div>
                      <h4 className="font-bold text-primary dark:text-white">{selectedUser.first_name} {selectedUser.last_name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedUser.email}</p>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-6">
                   {conversation.map((m, index) => {
                     const isMine = m.sender_id === user?.id;
                     return (
                       <div key={index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-md p-6 rounded-3xl text-sm font-medium shadow-sm ${
                            isMine 
                              ? 'bg-primary text-white rounded-br-none shadow-primary/10' 
                              : 'bg-gray-50 dark:bg-slate-800 text-primary dark:text-white rounded-bl-none'
                          }`}>
                             <p>{m.content}</p>
                             <p className={`text-[9px] font-bold uppercase tracking-widest mt-2 ${isMine ? 'text-white/60' : 'text-gray-400'}`}>
                                {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </p>
                          </div>
                       </div>
                     );
                   })}
                   <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-50 dark:border-slate-800 flex items-center space-x-4">
                   <input 
                     type="text"
                     value={content}
                     onChange={(e) => setContent(e.target.value)}
                     placeholder={`Message ${selectedUser.first_name}...`}
                     className="flex-1 px-6 h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                     required
                   />
                   <Button 
                     type="submit"
                     disabled={sending || !content.trim()}
                     className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center p-0 shadow-lg shadow-primary/20 hover:scale-[1.05] active:scale-[0.95] transition-all"
                   >
                      {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                   </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-gray-400">
                 <MessageSquare size={48} className="mb-4 stroke-1 opacity-50" />
                 <p className="font-bold text-lg">Your Conversations</p>
                 <p className="text-sm font-medium mt-1">Select a participant to initialize real-time dialogues.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
