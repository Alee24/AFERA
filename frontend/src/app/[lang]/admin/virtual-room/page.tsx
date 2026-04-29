'use client';

import React, { useState } from 'react';
import { Video, Loader2, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/lib/NotificationContext';

export default function AdminVirtualRoom() {
  const [roomName, setRoomName] = useState('');
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) {
      showNotification('Please enter a valid classroom name', 'error');
      return;
    }
    const cleanRoom = roomName.trim().replace(/[^a-zA-Z0-9]/g, '_');
    setActiveRoom(`Afera_${cleanRoom}`);
    showNotification('Virtual session launched as Administrator!', 'success');
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div>
         <h1 className="text-4xl font-black text-primary dark:text-white tracking-tight">
            Administrator <span className="text-accent italic">Virtual Command</span>
         </h1>
         <p className="text-gray-500 mt-2 font-medium">Coordinate system conferences or drop into lecture sessions autonomously.</p>
      </div>

      {!activeRoom ? (
         <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-lg border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-6">
               <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
                  <Video size={32} />
               </div>
               <div>
                  <h3 className="text-2xl font-bold text-primary dark:text-white">Admin Module Deployment</h3>
                  <p className="text-sm text-gray-400 mt-1">Specify custom criteria to jump right into ongoing meeting spaces.</p>
               </div>

               <form onSubmit={handleLaunch} className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-gray-400">Target Session Name</label>
                     <input 
                       type="text"
                       value={roomName}
                       onChange={(e) => setRoomName(e.target.value)}
                       placeholder="e.g. Masterclass A"
                       className="w-full px-6 h-16 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                       required
                     />
                  </div>

                  <Button type="submit" className="w-full h-16 bg-accent text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-accent/20">
                     Override and Enter Broadcast
                  </Button>
               </form>
            </div>
            <div className="hidden md:block w-72 h-72 bg-gray-50 dark:bg-slate-800 rounded-[40px] relative overflow-hidden border border-gray-100 dark:border-slate-800">
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-gray-400">
                  <ShieldAlert size={48} className="mb-4 text-accent/30" />
                  <span className="text-xs font-bold uppercase tracking-widest text-accent/50">Admin Virtual Hub Ready</span>
               </div>
            </div>
         </div>
      ) : (
         <div className="space-y-6">
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
               <div className="flex items-center space-x-4">
                  <button onClick={() => setActiveRoom(null)} className="w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all">
                     <ArrowLeft size={18} />
                  </button>
                  <div>
                     <h4 className="font-bold text-primary dark:text-white">Admin Supervised Stream</h4>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{activeRoom}</p>
                  </div>
               </div>
               <Button onClick={() => setActiveRoom(null)} className="bg-red-50 text-red-500 h-10 px-4 rounded-xl text-xs font-bold border-none hover:bg-red-100">
                  Disconnect Hub
               </Button>
            </div>

            <div className="w-full h-[70vh] rounded-[40px] overflow-hidden shadow-2xl border border-primary/20 bg-black">
               <iframe 
                 src={`https://meet.jit.si/${activeRoom}`} 
                 className="w-full h-full"
                 allow="camera; microphone; fullscreen; display-capture; autoplay"
               />
            </div>
         </div>
      )}
    </div>
  );
}
