'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import GoogleTranslate from './GoogleTranslate';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/lib/AuthContext';
import { LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';

const navLinks = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'courses', href: '/courses' },
  { key: 'workshops', href: '/workshops' },
  { key: 'contact', href: '/contact' },
];

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'pt', label: 'PT' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation('common');
  const { user, logout, isAuthenticated } = useAuth();

  const changeLanguage = (lng: string) => {
    const segments = pathname.split('/');
    if (segments.length > 1) {
      segments[1] = lng;
    }
    const newPath = segments.join('/');
    router.push(newPath);
    i18n.changeLanguage(lng);
    setLangMenuOpen(false);
  };

  const currentLang = i18n.language || 'en';

  return (
    <nav className="fixed top-0 z-50 w-full bg-white shadow-sm dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 h-20 flex items-center">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href={`/${currentLang}`} className="flex items-center space-x-3 group">
            <Image 
              src="/LOGOMAIN.png" 
              alt="AFERA INNOV ACADEMY" 
              width={160} 
              height={40} 
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const fullHref = link.href === '/' ? `/${currentLang}` : `/${currentLang}${link.href}`;
              const isActive = pathname === fullHref || (pathname.startsWith(`/${currentLang}${link.href}`) && link.href !== '/');
              return (
                <Link
                  key={link.key}
                  href={fullHref}
                  className={cn(
                    "text-xs font-bold tracking-wider uppercase transition-colors hover:text-primary relative py-2",
                    isActive ? "text-primary dark:text-white" : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {t(`navbar.${link.key}`)}
                  {isActive && (
                    <motion.div 
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" 
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-5">
            
            {/* Google Translate Widget */}
            <GoogleTranslate />

            {/* Theme Toggle */}
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link href={`/${currentLang}/${user?.role === 'admin' ? 'admin' : 'dashboard'}`}>
                  <button className="flex items-center justify-center space-x-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-primary dark:text-white rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all">
                    <LayoutDashboard size={14} />
                    <span>{t('navbar.dashboard', 'Dashboard')}</span>
                  </button>
                </Link>
                <button 
                  onClick={logout}
                  className="flex items-center justify-center p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link href={`/${currentLang}/login`}>
                <button className="flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-md">
                  <span>{t('navbar.login', 'Login')}</span>
                  <ArrowRight size={14} />
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary dark:text-white focus:outline-none p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 dark:bg-slate-900 dark:border-slate-800 absolute top-full left-0 w-full shadow-xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navLinks.map((link) => {
                const fullHref = link.href === '/' ? `/${currentLang}` : `/${currentLang}${link.href}`;
                return (
                  <Link
                    key={link.key}
                    href={fullHref}
                    onClick={() => setIsOpen(false)}
                    className="block text-sm font-bold tracking-wider uppercase text-primary dark:text-white hover:text-accent border-b border-gray-50 dark:border-slate-800 pb-3"
                  >
                    {t(`navbar.${link.key}`)}
                  </Link>
                );
              })}
              
              <div className="py-4 border-b border-gray-50 dark:border-slate-800">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Select Language</p>
                <GoogleTranslate />
              </div>

              <div className="pt-4 flex flex-col space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link href={`/${currentLang}/${user?.role === 'admin' ? 'admin' : 'dashboard'}`} onClick={() => setIsOpen(false)}>
                      <button className="w-full flex items-center justify-center space-x-2 bg-primary text-white rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider shadow-md">
                        <LayoutDashboard size={16} />
                        <span>{t('navbar.dashboard', 'Dashboard')}</span>
                      </button>
                    </Link>
                    <button 
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="w-full flex items-center justify-center space-x-2 border border-red-200 text-red-500 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider"
                    >
                      <LogOut size={16} />
                      <span>{t('navbar.logout', 'Logout')}</span>
                    </button>
                  </>
                ) : (
                  <Link href={`/${currentLang}/login`} onClick={() => setIsOpen(false)}>
                    <button className="w-full flex items-center justify-center space-x-2 bg-primary text-white rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider shadow-md">
                      <span>{t('navbar.login', 'Login')}</span>
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
