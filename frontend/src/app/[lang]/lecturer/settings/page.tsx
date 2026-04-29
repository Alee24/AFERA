'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Save, 
  Loader2, 
  Lock,
  Mail,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';

export default function LecturerSettings() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    preferred_language: 'en'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        preferred_language: user.preferred_language || 'en'
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.put('/users/profile', formData);
      updateUser(formData);
      showNotification('Profile parameters saved safely', 'success');
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    setSavingPassword(true);
    try {
      // Endpoint is usually custom or standard profile updates
      await api.put('/users/profile', { password: passwordData.newPassword });
      showNotification('Credentials updated successfully', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showNotification('Password modification failed', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-primary dark:text-white tracking-tight">Profile <span className="text-accent italic">Settings</span></h1>
        <p className="text-gray-500 mt-2 font-medium">Update academic details securely.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Profile Information */}
         <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
            <h3 className="text-xl font-bold text-primary dark:text-white mb-8 flex items-center">
               <User className="mr-3 text-accent" size={24} /> Basic Information
            </h3>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-gray-400">First Name</label>
                     <input 
                       type="text"
                       value={formData.first_name}
                       onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                       className="w-full px-6 h-16 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-gray-400">Last Name</label>
                     <input 
                       type="text"
                       value={formData.last_name}
                       onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                       className="w-full px-6 h-16 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Phone Number</label>
                  <input 
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-6 h-16 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Language Preference</label>
                  <select 
                    value={formData.preferred_language}
                    onChange={(e) => setFormData({...formData, preferred_language: e.target.value})}
                    className="w-full px-6 h-16 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-sm focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                  >
                     <option value="en">English (US)</option>
                     <option value="fr">Français (FR)</option>
                     <option value="pt">Português (BR)</option>
                  </select>
               </div>

               <Button 
                 type="submit"
                 disabled={savingProfile}
                 className="w-full h-16 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
               >
                  {savingProfile ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                  Save Core Profiles
               </Button>
            </form>
         </div>

         {/* Password Security */}
         <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
            <h3 className="text-xl font-bold text-primary dark:text-white mb-8 flex items-center">
               <Lock className="mr-3 text-accent" size={24} /> Account Security
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">New Password</label>
                  <input 
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-6 h-16 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    required
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Confirm New Password</label>
                  <input 
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full px-6 h-16 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    required
                  />
               </div>

               <Button 
                 type="submit"
                 disabled={savingPassword}
                 className="w-full h-16 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
               >
                  {savingPassword ? <Loader2 className="animate-spin mr-2" /> : <Lock className="mr-2" />}
                  Change Credentials
               </Button>
            </form>
         </div>
      </div>
    </div>
  );
}
