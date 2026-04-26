'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '@/sections/home/Hero';
import AboutPreview from '@/sections/home/AboutPreview';
import Programs from '@/sections/home/Programs';
import Tuition from '@/sections/home/Tuition';
import News from '@/sections/home/News';
import Partners from '@/sections/home/Partners';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = React.use(params);
  const lang = resolvedParams.lang;
  const { i18n } = useTranslation('common');

  React.useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return (
    <main className="overflow-x-hidden">
      {/* Hero Section */}
      <Hero />

      {/* About Preview */}
      <AboutPreview />

      {/* Programs Preview */}
      <Programs />

      {/* Tuition & Financial Aid */}
      <Tuition />

      {/* Latest News */}
      <News />

      {/* Final Call to Action */}
      <section className="py-20 bg-accent text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join thousands of students who are already shaping their future at AFERA INNOV ACADEMY. Applications for the next semester are now open.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="primary" size="lg" className="bg-white text-accent hover:bg-gray-100">
              Apply for Admission
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              Download Prospectus
            </Button>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <Partners />
    </main>
  );
}
