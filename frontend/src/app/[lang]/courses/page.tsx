'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Clock, GraduationCap, ChevronRight, BookOpen, DollarSign, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function CoursesPage({ params }: { params: any }) {
  const resolvedParams = React.use(params);
  const lang = resolvedParams.lang;
  const { t, i18n } = useTranslation('common');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }

    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/courses');
        setCourses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch courses', err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [lang, i18n]);

  const currentLang = lang || 'en';

  return (
    <main className="pt-24 min-h-screen bg-gray-50/50 pb-20">
      
      {/* Header Section */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block rounded-full bg-white/10 border border-white/20 px-4 py-1 text-xs font-bold tracking-widest text-accent uppercase mb-6"
          >
            Afera Academy Programs
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-8 leading-tight font-serif"
          >
            Specialized Academic <br /> & Professional Catalog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Equipping infrastructure professionals with world-class expertise in resource mobilization and results-based management.
          </motion.p>
        </div>

        {/* Decorative Background Pattern */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-[-15deg] translate-x-1/4"></div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {loading ? (
             [1, 2].map(i => (
               <div key={i} className="bg-white rounded-[40px] h-96 animate-pulse shadow-sm"></div>
             ))
           ) : courses.map((course: any, i: number) => (
             <motion.div 
               key={course.id}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col group h-full"
             >
                {/* Visual Header */}
                <div className="h-48 bg-primary relative flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent/20 opacity-90"></div>
                   <GraduationCap size={80} className="text-white/20 absolute -right-4 -bottom-4 rotate-12" />
                   <BookOpen size={48} className="text-accent relative z-10" />
                </div>

                <div className="p-8 md:p-10 flex-1 flex flex-col">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">{course.course_type || 'Degree Program'}</span>
                      <div className="flex items-center text-primary font-bold">
                         <span className="text-xs mr-1">$</span>
                         <span className="text-xl">{Math.round(course.price || 800)}</span>
                      </div>
                   </div>

                   <h3 className="text-2xl font-bold text-primary mb-4 leading-tight group-hover:text-accent transition-colors">
                     {course[`title_${currentLang}`] || course.title_en || course.title}
                   </h3>

                   <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                      <div className="flex items-center"><Clock size={14} className="mr-1.5 text-accent" /> {course.duration}</div>
                      <div className="flex items-center"><Globe size={14} className="mr-1.5 text-accent" /> {course.modality}</div>
                   </div>

                   <p className="text-gray-500 text-sm mb-8 flex-1 leading-relaxed line-clamp-3">
                     {course[`description_${currentLang}`] || course.description_en || course.description}
                   </p>

                   <Link href={`/${currentLang}/courses/${course.id}`} className="mt-auto">
                      <Button variant="primary" className="w-full py-4 text-xs font-bold uppercase tracking-widest rounded-2xl group-hover:bg-accent transition-colors flex items-center justify-center">
                         Explore Program <ChevronRight size={16} className="ml-1" />
                      </Button>
                   </Link>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Support Section */}
        <div className="mt-20 text-center bg-white rounded-[40px] p-12 shadow-sm border border-gray-100">
           <h3 className="text-2xl font-bold text-primary mb-4">Not sure which program is right for you?</h3>
           <p className="text-gray-500 max-w-xl mx-auto mb-8">Our academic advisors are here to help you choose the best path for your professional growth.</p>
           <Link href={`/${currentLang}/contact`}>
              <Button variant="outline" className="rounded-2xl px-10 border-primary text-primary hover:bg-primary hover:text-white transition-all font-bold uppercase tracking-widest text-xs">
                Contact Academic Advisor
              </Button>
           </Link>
        </div>

      </section>
    </main>
  );
}
