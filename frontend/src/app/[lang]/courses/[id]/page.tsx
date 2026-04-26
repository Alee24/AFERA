'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Clock, 
  BookOpen, 
  CheckCircle, 
  ArrowRight, 
  ChevronLeft, 
  Globe, 
  MapPin, 
  DollarSign,
  GraduationCap,
  Award,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function CourseDetailsPage() {
  const { lang, id } = useParams();
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang as string);
    }

    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/api/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error('Failed to fetch course details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [lang, id, i18n]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-24 bg-white">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 text-center px-4 bg-white">
      <h2 className="text-3xl font-bold text-primary mb-4">Course Not Found</h2>
      <p className="text-gray-500 mb-8">The program you are looking for might have been moved or renamed.</p>
      <Link href={`/${lang}/courses`}>
        <Button variant="primary">Back to Academic Catalog</Button>
      </Link>
    </div>
  );

  const currentLang = (lang as string) || 'en';
  const title = course[`title_${currentLang}`] || course.title_en || course.title || 'Specialized Program';
  const description = course[`description_${currentLang}`] || course.description_en || course.description || '';

  return (
    <main className="pt-24 min-h-screen bg-gray-50/50 pb-20 overflow-hidden">
      
      {/* Hero Header */}
      <section className="bg-primary pt-20 pb-40 text-white relative">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <Link 
            href={`/${lang}/courses`} 
            className="inline-flex items-center text-accent font-bold uppercase tracking-widest text-xs mb-8 hover:translate-x-[-4px] transition-transform"
          >
            <ChevronLeft size={16} className="mr-1" /> Back to Catalog
          </Link>
          
          <div className="max-w-4xl">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-accent/20 text-accent border border-accent/30 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest mb-6"
            >
              {course.course_type || 'Specialized Program'}
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8"
            >
              {title}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm font-semibold opacity-90"
            >
              <div className="flex items-center">
                <Clock size={20} className="text-accent mr-3" />
                <div>
                   <p className="text-[10px] uppercase text-gray-400">Duration</p>
                   <p>{course.duration}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin size={20} className="text-accent mr-3" />
                <div>
                   <p className="text-[10px] uppercase text-gray-400">Format</p>
                   <p>{course.modality}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Award size={20} className="text-accent mr-3" />
                <div>
                   <p className="text-[10px] uppercase text-gray-400">Level</p>
                   <p>{course.department}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users size={20} className="text-accent mr-3" />
                <div>
                   <p className="text-[10px] uppercase text-gray-400">Audience</p>
                   <p>Professionals</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Wave Background */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gray-50/50" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold text-primary mb-8">Program Overview</h2>
              <div className="prose prose-lg text-gray-600 max-w-none mb-10 leading-relaxed">
                {description}
              </div>

              <h3 className="text-xl font-bold text-primary mb-6">Learning Outcomes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Advanced financial modeling for road projects",
                  "Deep understanding of PPP legal frameworks",
                  "Strategic asset management principles",
                  "Resource mobilization in developing economies",
                  "Results-based management applications",
                  "Performance monitoring and evaluation"
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-3 bg-gray-50 p-4 rounded-2xl">
                    <CheckCircle className="text-accent w-5 h-5 flex-shrink-0 mt-1" />
                    <span className="text-sm font-medium text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modules Section */}
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100">
               <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-bold text-primary">Curriculum Structure</h2>
                  <span className="text-xs font-bold bg-primary/5 text-primary px-4 py-2 rounded-full uppercase tracking-widest">
                    {course.Modules?.length || 0} Modules
                  </span>
               </div>
               
               <div className="space-y-6">
                 {course.Modules?.map((mod: any, i: number) => (
                   <div key={mod.id} className="group relative pl-8 border-l-2 border-gray-100 hover:border-accent transition-colors pb-8 last:pb-0">
                      <div className="absolute top-0 -left-[9px] w-4 h-4 rounded-full bg-white border-2 border-gray-200 group-hover:border-accent group-hover:bg-accent transition-all"></div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                         <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Module {mod.order || i+1}</p>
                            <h4 className="text-lg font-bold text-primary mb-2">{mod[`title_${currentLang}`] || mod.title}</h4>
                            <p className="text-sm text-gray-500 max-w-xl">{mod[`description_${currentLang}`] || mod.description}</p>
                         </div>
                         <div className="text-right flex-shrink-0">
                            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg uppercase tracking-wider">{mod.duration_weeks} Weeks</span>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Enrollment Sidebar */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-gray-100 sticky top-32">
                <div className="text-center mb-8">
                   <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Program Tuition</p>
                   <div className="flex items-center justify-center space-x-1 text-primary">
                      <DollarSign size={32} className="text-accent" />
                      <span className="text-5xl font-black">{Math.round(course.price || 800)}</span>
                      <span className="text-xl font-bold text-gray-400 ml-2">USD</span>
                   </div>
                </div>

                <div className="space-y-6 mb-10">
                   <div className="flex items-center justify-between text-sm py-4 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">Application Fee</span>
                      <span className="text-primary font-bold">Included</span>
                   </div>
                   <div className="flex items-center justify-between text-sm py-4 border-b border-gray-50">
                      <span className="text-gray-500 font-medium">Learning Materials</span>
                      <span className="text-primary font-bold">Included</span>
                   </div>
                   <div className="flex items-center justify-between text-sm py-4">
                      <span className="text-gray-500 font-medium">Certification</span>
                      <span className="text-primary font-bold text-accent">Verified Gold</span>
                   </div>
                </div>

                <Link href={`/${lang}/register?program=${encodeURIComponent(title)}`}>
                   <Button variant="primary" className="w-full py-5 text-sm font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center group">
                      Apply For Admission <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                   </Button>
                </Link>

                <p className="text-center text-[10px] text-gray-400 mt-6 leading-relaxed">
                   Admission is competitive. Secure your spot by completing the initial application phase.
                </p>

                <div className="mt-10 pt-8 border-t border-gray-50 space-y-4">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                         <Users size={20} />
                      </div>
                      <div className="text-left">
                         <p className="text-xs font-bold text-primary leading-none">Limited Cohort</p>
                         <p className="text-[10px] text-gray-400 mt-1 uppercase">25 Seats Available</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </section>
    </main>
  );
}
