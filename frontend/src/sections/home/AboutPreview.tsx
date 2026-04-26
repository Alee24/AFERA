'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AboutPreview() {
  const { t } = useTranslation('common');

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/LOGO1.png"
                alt="Students collaborating"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-navy-900/10"></div>
            </div>
            
            {/* Floating Experience Card */}
            <div className="absolute -bottom-10 -right-10 hidden md:block bg-accent p-8 rounded-2xl shadow-xl text-white max-w-[200px]">
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-sm font-medium opacity-90">{t('about_preview.years_experience')}</div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-accent font-semibold tracking-wide uppercase mb-3">{t('about_preview.tagline')}</h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-primary leading-tight">
                {t('about_preview.title')}
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              {t('about_preview.desc1')}
            </p>

            <ul className="space-y-4">
              {[
                t('about_preview.bullet1'),
                t('about_preview.bullet2'),
                t('about_preview.bullet3'),
              ].map((item, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <CheckCircle2 className="text-accent shrink-0 mt-1" size={20} />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link href="/about">
                <Button variant="outline" size="lg" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white group">
                  {t('about_preview.learn_more')} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
