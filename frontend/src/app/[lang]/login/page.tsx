'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { useNotification } from '@/lib/NotificationContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { t, i18n } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt started...', { email });
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      console.log('Login response received:', res.data);
      
      const { user, token } = res.data;
      login(user, token);
      showNotification('Login successful! Welcome back.', 'success');
      
      // Use role-based routing
      let target = 'dashboard'; // student default
      if (user.role === 'admin') target = 'admin';
      if (user.role === 'lecturer') target = 'lecturer';
      
      const currentLang = i18n.language || 'en';
      console.log(`Redirecting to: /${currentLang}/${target}`);
      router.push(`/${currentLang}/${target}`);
    } catch (err: any) {
      console.error('Login error:', err);
      const errMsg = err.response?.data?.message || err.message || 'An error occurred during login.';
      showNotification(errMsg, 'error');
      // Fallback for invisible notifications
      if (typeof window !== 'undefined') {
        console.log('SHOWING ERROR:', errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white dark:bg-slate-800 rounded-2xl shadow-premium overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-slate-700">
        
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-primary dark:text-white mb-2">{t('common.login', 'Login')}</h2>
            <p className="text-gray-500 dark:text-gray-400">Access your student or faculty account.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-bold text-accent hover:text-primary transition-colors">Forgot password?</a>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Sign In <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account? <Link href="/register" className="font-bold text-accent hover:text-primary transition-colors">Apply Now</Link>
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:block w-full md:w-1/2 relative bg-primary">
          <Image 
            src="/hero-user-1.jpg" 
            alt="Students" 
            fill 
            className="object-cover opacity-80 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Welcome Back</h3>
            <p className="text-gray-200">Continue your journey with AFERA INNOV ACADEMY. Log in to access your dashboard, courses, and resources.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
