'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GraduationCap, BookOpen, Clock, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const STATIC_COURSES = [
  {
    id: 'masters-resource-mobilization',
    title_en: 'Advanced Resource Mobilization',
    title_fr: 'Mobilisation des ressources avancée',
    title_pt: 'Mobilização de Recursos Avançada',
    title_sw: 'Ukusanyaji wa Rasilimali wa Juu',
    description_en: 'Master the strategies for international resource mobilization for infrastructure projects.',
    description_fr: 'Maîtriser les stratégies de mobilisation de ressources internationales pour les projets d\'infrastructure.',
    description_pt: 'Dominar as estratégias de mobilização de recursos internacionais para projetos de infraestrutura.',
    description_sw: 'Bobea katika mikakati ya ukusanyaji wa rasilimali za kimataifa kwa miradi ya miundombinu.',
    price: 1200,
    duration: '12 Months',
    modality: 'Hybrid',
    course_type: 'Master Degree',
  },
  {
    id: 'certificate-rbm',
    title_en: 'Results-Based Management',
    title_fr: 'Gestion axée sur les résultats',
    title_pt: 'Gestão Baseada em Resultados',
    title_sw: 'Usimamizi Unaozingatia Matokeo',
    description_en: 'Implementing results-based frameworks in public sector infrastructure development.',
    description_fr: 'Mise en œuvre de cadres axés sur les résultats dans le développement des infrastructures du secteur public.',
    description_pt: 'Implementação de estruturas baseadas em resultados no desenvolvimento de infraestruturas do sector público.',
    description_sw: 'Utekelezaji wa mifumo inayozingatia matokeo katika maendeleo ya miundombinu ya sekta ya umma.',
    price: 850,
    duration: '6 Months',
    modality: 'Online',
    course_type: 'Certificate',
  }
];

export default function Programs() {
  const [courses, setCourses] = useState<any[]>(STATIC_COURSES);
  const { i18n } = useTranslation('common');
  const lang = i18n.language || 'en';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/courses');
        const dynamicCourses = Array.isArray(res.data) ? res.data : [];
        const filteredDynamic = dynamicCourses.filter(dc => 
          !STATIC_COURSES.some(sc => sc.title_en === dc.title_en)
        );
        setCourses([...STATIC_COURSES, ...filteredDynamic].slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch programs', err);
        setCourses(STATIC_COURSES);
      }
    };
    fetchCourses();
  }, []);

  return (
    <section className="py-24 bg-muted/50 dark:bg-slate-950">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-accent font-semibold tracking-wide uppercase mb-3">Our Academic Programs</h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
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
