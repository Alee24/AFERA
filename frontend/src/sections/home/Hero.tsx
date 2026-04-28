'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, GraduationCap, Users, Globe, Play, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const heroImages = [
  { src: "/hero1.png", title: "Future Leaders", desc: "Empowering the next generation." },
  { src: "/hero2.jpg", title: "Innovative Learning", desc: "Experience education like never before." },
  { src: "/hero3.jpg", title: "Global Community", desc: "Connect with students worldwide." }
];

export default function Hero() {
  const { t, i18n } = useTranslation('common');
  const currentLang = i18n.language || 'en';
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setIndex((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  return (
    <div className="relative bg-white dark:bg-slate-950 min-h-[90vh] flex items-center pt-24 pb-12 lg:pt-0 lg:pb-0 overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50/50 -z-10 skew-x-[-10deg] translate-x-1/2"></div>
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content Section (Clean & Professional Whitespace) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2 text-accent font-bold tracking-widest text-xs uppercase"
              >
                <div className="w-8 h-[2px] bg-accent"></div>
                <span>Welcome to AFERA INNOV ACADEMY</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary dark:text-white leading-[1.1] tracking-tight font-serif"
              >
                Learn Today. <br />
                <span className="text-accent italic relative">
                  Lead Tomorrow.
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/30" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                    <path d="M1 11c30-6 60-9 198-1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg md:text-xl text-gray-500 max-w-xl leading-relaxed"
              >
                Discover a transformative educational experience that blends <span className="font-semibold text-primary dark:text-accent">on-campus excellence</span> with <span className="font-semibold text-primary dark:text-accent">online flexibility</span>.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap gap-5"
            >
              <Link href={`/${currentLang}/register`}>
                <button className="group relative overflow-hidden bg-primary text-white rounded-full px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                  <span className="relative z-10 flex items-center">
                    Apply Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
              </Link>
              
              <Link href={`/${currentLang}/courses`}>
                <button className="flex items-center text-primary font-bold uppercase tracking-wider text-sm hover:text-accent transition-colors py-4 px-2">
                  Explore Programs <ChevronRight className="ml-1 w-5 h-5" />
                </button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="pt-8 border-t border-gray-100 flex items-center space-x-10 grayscale opacity-40"
            >
              <div className="flex items-center space-x-2">
                <GraduationCap size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Accredited</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Global Alumni</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest">World Wide</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Section (Dynamic Image Transition Overlay) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            {/* Main Image Card */}
            <div className="relative aspect-[4/5] md:aspect-square w-full rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img 
                    src={heroImages[index].src} 
                    alt={heroImages[index].title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent"></div>
                </motion.div>
              </AnimatePresence>

              {/* Floating Slide Info */}
              <div className="absolute bottom-10 left-10 text-white z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-accent font-bold uppercase tracking-widest text-[10px] mb-1">Featured Slide</p>
                    <h3 className="text-2xl font-bold">{heroImages[index].title}</h3>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Controls */}
              <div className="absolute bottom-8 right-8 flex space-x-3 z-10">
                <button onClick={prevSlide} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-primary transition-all border border-white/20">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextSlide} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-primary transition-all border border-white/20">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Decorative Floating Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl -z-10"
            ></motion.div>
            
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center space-x-4 z-20">
              <div className="bg-accent p-3 rounded-2xl text-primary shadow-lg">
                <Play size={20} fill="currentColor" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Virtual Tour</p>
                <p className="text-sm font-bold text-primary">Explore Campus</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
