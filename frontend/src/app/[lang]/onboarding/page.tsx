'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useNotification } from '@/lib/NotificationContext';
import { useAuth } from '@/lib/AuthContext';
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
  GraduationCap,
  Briefcase,
  MapPin,
  Heart,
  Mail,
  Lock
} from 'lucide-react';

export default function OnboardingPage() {
  const { lang } = useParams();
  const { isAuthenticated, user: authUser, login } = useAuth();
  const router = useRouter();
  const { showNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    nationality: '',
    gender: '',
    date_of_birth: '',
    institution: '',
    job_title: '',
    qualification: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!isAuthenticated) {
        // 1. Create student account
        await api.post('/auth/register', {
          name: `${formData.first_name} ${formData.last_name}`,
          email: formData.email,
          password: formData.password,
          role: 'student'
        });
        
        // 2. Authenticate
        const authRes = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        
        const { user, token } = authRes.data;
        login(user, token);
      }

      // 3. Store full profile payload
      await api.put('/users/profile', formData);

      showNotification('Account and profile setup completed successfully!', 'success');
      router.push(`/${lang}/dashboard`);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Could not finalize enrollment details';
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
          {/* Account Credentials */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 mb-2">
               <div className="w-8 h-8 bg-primary/5 rounded-xl flex items-center justify-center text-primary dark:text-accent">
                  <Mail size={18} />
               </div>
               <h3 className="text-lg font-bold text-primary dark:text-white">Account Credentials</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

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

          {/* Professional Details */}
          <section className="space-y-6 pt-4">
            <div className="flex items-center space-x-3 mb-2">
               <div className="w-8 h-8 bg-primary/5 rounded-xl flex items-center justify-center text-primary dark:text-accent">
                  <Briefcase size={18} />
               </div>
               <h3 className="text-lg font-bold text-primary dark:text-white">Professional Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Institution / Employer</label>
                <input 
                  type="text" 
                  value={formData.institution}
                  onChange={(e) => setFormData({...formData, institution: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                  placeholder="e.g. Kenya Roads Board, FER Guinea"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Job Title / Role</label>
                <input 
                  type="text" 
                  value={formData.job_title}
                  onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                  placeholder="e.g. Senior Engineer, Finance Manager"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Highest Academic Qualification</label>
              <input 
                type="text" 
                value={formData.qualification}
                onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                placeholder="e.g. Master in Civil Engineering, PhD, B.Sc. Accounting"
                required
              />
            </div>
          </section>

          {/* Address & Emergency */}
          <section className="space-y-6 pt-4">
            <div className="flex items-center space-x-3 mb-2">
               <div className="w-8 h-8 bg-primary/5 rounded-xl flex items-center justify-center text-primary dark:text-accent">
                  <MapPin size={18} />
               </div>
               <h3 className="text-lg font-bold text-primary dark:text-white">Mailing Address</h3>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Residential / Official Address</label>
              <textarea 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm resize-none h-24"
                placeholder="Full mailing address details..."
                required
              />
            </div>
          </section>

          <section className="space-y-6 pt-4">
            <div className="flex items-center space-x-3 mb-2">
               <div className="w-8 h-8 bg-primary/5 rounded-xl flex items-center justify-center text-primary dark:text-accent">
                  <Heart size={18} />
               </div>
               <h3 className="text-lg font-bold text-primary dark:text-white">Emergency Contact</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Contact Name</label>
                <input 
                  type="text" 
                  value={formData.emergency_contact_name}
                  onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                  placeholder="Full name of emergency contact"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Contact Phone</label>
                <input 
                  type="tel" 
                  value={formData.emergency_contact_phone}
                  onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                  placeholder="Phone number"
                  required
                />
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
