'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useNotification } from '@/lib/NotificationContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { 
  User as UserIcon, 
  Globe, 
  Calendar, 
  Phone, 
  ArrowRight, 
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

export default function OnboardingPage() {
  const { lang } = useParams();
  const router = useRouter();
  const { showNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    nationality: '',
    gender: '',
    date_of_birth: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push(`/${lang}/login`);
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    setFormData(prev => ({
      ...prev,
      first_name: parsedUser.first_name || '',
      last_name: parsedUser.last_name || ''
    }));
  }, [lang, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/profile', formData);
      showNotification('Profile completed successfully! Welcome to Afera Innov Academy.', 'success');
      router.push(`/${lang}/dashboard`);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to update profile';
      showNotification(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 text-accent rounded-3xl mb-6 shadow-sm">
             <GraduationCap size={40} />
          </div>
          <h1 className="text-4xl font-bold text-primary dark:text-white mb-4">Complete Your Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
             Welcome, <span className="font-bold text-primary dark:text-accent">{formData.first_name}</span>! Please provide your details to finalize your academic record.
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl shadow-primary/5 p-8 md:p-12 border border-gray-100 dark:border-slate-800 space-y-10"
        >
          {/* Personal Info */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 mb-2">
               <div className="w-8 h-8 bg-primary/5 rounded-xl flex items-center justify-center text-primary dark:text-accent">
                  <UserIcon size={18} />
               </div>
               <h3 className="text-lg font-bold text-primary dark:text-white">Personal Biodata</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                <input 
                  type="text" 
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                  placeholder="First Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                <input 
                  type="text" 
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm appearance-none"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="date" 
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Contact & Origin */}
          <section className="space-y-6 pt-4">
            <div className="flex items-center space-x-3 mb-2">
               <div className="w-8 h-8 bg-primary/5 rounded-xl flex items-center justify-center text-primary dark:text-accent">
                  <Globe size={18} />
               </div>
               <h3 className="text-lg font-bold text-primary dark:text-white">Contact & Nationality</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nationality</label>
                <input 
                  type="text" 
                  value={formData.nationality}
                  onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                  placeholder="e.g. Kenya, Nigeria, South Africa"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                    placeholder="+254 700 000 000"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="pt-10">
             <Button 
               type="submit" 
               className="w-full py-5 text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center group"
               disabled={loading}
             >
                {loading ? 'Securing your record...' : (
                  <>Finalize Application <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" /></>
                )}
             </Button>
             <p className="text-center text-[10px] text-gray-400 mt-6 uppercase font-bold tracking-widest">
                Confidentiality Guaranteed • Academic Records Protection
             </p>
          </div>
        </motion.form>
      </div>
    </main>
  );
}
