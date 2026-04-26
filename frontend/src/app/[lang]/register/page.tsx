'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/lib/NotificationContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { User as UserIcon, Mail, Lock, BookOpen, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { t, i18n } = useTranslation('common');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [program, setProgram] = useState("Specialized master's degree in resource Mobilization and Financing of Road Infrastructure Maintenance");
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password, program, role: 'student' });
      showNotification('Application submitted successfully! You can now log in to check your status.', 'success');
      router.push(`/${i18n.language}/login`);
    } catch (err: any) {
      // Strict requirement: show actual errors
      const errMsg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      showNotification(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-white dark:bg-slate-800 rounded-2xl shadow-premium overflow-hidden flex flex-col md:flex-row-reverse border border-gray-100 dark:border-slate-700">
        
        {/* Right Side - Form */}
        <div className="w-full md:w-[55%] p-8 sm:p-12">
          <div className="mb-8">
            <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-bold tracking-wider text-accent uppercase mb-3">
              Admissions Open
            </span>
            <h2 className="text-3xl font-bold text-primary dark:text-white mb-2">Application Portal</h2>
            <p className="text-gray-500 dark:text-gray-400">Start your journey with AFERA INNOV ACADEMY today.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-11 pr-3 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  className="block w-full pl-11 pr-3 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Program of Interest</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
                <select 
                  className="block w-full pl-11 pr-3 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all appearance-none"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                >
                  <option value="Specialized master's degree in resource Mobilization and Financing of Road Infrastructure Maintenance">Specialized Master's Degree (Resource Mobilization)</option>
                  <option value="Results-Based Management for Road Fund Professionals in Africa">Results-Based Management Certificate</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Create Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="password" 
                  className="block w-full pl-11 pr-3 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <Button type="submit" variant="accent" className="w-full py-3 mt-4" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                  Submitting Application...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Submit Application <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center mt-4">
              By applying, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 text-center">
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Already have an account? <Link href="/login" className="font-bold text-primary hover:text-accent transition-colors">Sign In here</Link>
            </p>
          </div>
        </div>

        {/* Left Side - Image */}
        <div className="hidden md:block w-full md:w-[45%] relative bg-primary">
          <Image 
            src="/hero1.png" 
            alt="University Registration" 
            fill 
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-10 text-white">
            <div className="w-12 h-1 bg-accent mb-6 rounded-full"></div>
            <h3 className="text-3xl font-bold mb-4 leading-tight">Shape Your Future With Us</h3>
            <p className="text-gray-200">Join a vibrant community of innovators, leaders, and creators. Your journey to excellence starts with a single step.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
