'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GraduationCap, BookOpen, Clock, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function Programs() {
  const [courses, setCourses] = useState<any[]>([]);
  const { i18n } = useTranslation('common');
  const lang = i18n.language || 'en';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/courses');
        setCourses(Array.isArray(res.data) ? res.data.slice(0, 3) : []);
      } catch (err) {
        console.error('Failed to fetch programs', err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <section className="py-24 bg-muted/50 dark:bg-slate-950">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-accent font-semibold tracking-wide uppercase mb-3">Our Academic Programs</h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-primary mb-6 leading-tight">
            Specialized Expertise for <br /> Infrastructure Leaders
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Afera Academy offers world-class certification and postgraduate programs tailored for African road maintenance professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto gap-8">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full hover:border-accent group bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center transition-transform group-hover:scale-110">
                      <GraduationCap size={24} className="text-primary" />
                    </div>
                    <span className="text-[10px] font-black text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
                       {course.course_type || 'Program'}
                    </span>
                  </div>
                  <CardTitle className="group-hover:text-accent transition-colors leading-tight text-xl">
                    {course[`title_${lang}`] || course.title_en || course.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-6 flex-1">
                   <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                     {course[`description_${lang}`] || course.description_en || course.description}
                   </p>
                   <div className="flex items-center space-x-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <div className="flex items-center"><Clock size={14} className="mr-1.5 text-accent" /> {course.duration}</div>
                      <div className="flex items-center"><BookOpen size={14} className="mr-1.5 text-accent" /> {course.modality}</div>
                   </div>
                </CardContent>
                <CardFooter className="pt-0 pb-8 px-6">
                  <Link href={`/${lang}/courses/${course.id}`} className="w-full">
                    <Button variant="outline" className="w-full border-gray-100 dark:border-slate-800 text-primary hover:bg-primary hover:text-white transition-all font-bold uppercase tracking-widest text-xs py-5 rounded-2xl">
                      View Program Details <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href={`/${lang}/courses`}>
            <Button variant="primary" size="lg" className="rounded-full shadow-lg shadow-primary/20">
              Browse Academic Catalog
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
