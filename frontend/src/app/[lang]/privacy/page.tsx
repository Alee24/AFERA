'use client';

import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy({ params }: { params: { lang: string } }) {
  const { t } = useTranslation('common');
  const lang = params.lang;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Navigation */}
        <Link href={`/${lang}`} className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-accent transition-colors uppercase tracking-widest mb-10">
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </Link>

        {/* Header Block */}
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-slate-800 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full translate-x-12 -translate-y-12"></div>
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary dark:text-white leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">
            Last Updated: July 6, 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-slate-800 space-y-10 text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
              1. Introduction & Scope
            </h2>
            <p>
              AFERA INNOV ACADEMY ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy details how we collect, process, and protect your personal information when you register for admission, access the Student Portal, or utilize our integrated Moodle Learning Management System (LMS) at aferainnov.africa.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
              2. Information We Collect
            </h2>
            <p>
              We collect information that you directly provide when registering an account, completing your student profile, or participating in courses. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Identity:</strong> Full name, gender, nationality, religion, and date of birth.</li>
              <li><strong>Contact Information:</strong> Institutional or personal email address, phone number, and physical address.</li>
              <li><strong>Academic Details:</strong> Enrollment history, grade points, course modules, transcript logs, and class participation records.</li>
              <li><strong>Technical Metadata:</strong> IP address, device specifications, browser cookies, and platform navigation patterns.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
              3. Data Usage & Moodle LMS Integration
            </h2>
            <p>
              Your data is processed to administer academic admission, track student progress, coordinate billing, and secure the LMS. 
              The AFERA Innov Student Portal connects directly with our Moodle LMS. This single sign-on (SSO) integration ensures that your portal credentials grant immediate access to course materials. We do not sell or lease student information to third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
              4. Data Retention & Protection
            </h2>
            <p>
              We implement state-of-the-art security practices, including database encryption, bcrypt password hashing, and Transport Layer Security (TLS/HTTPS). Student records, grades, and transcripts are archived permanently in our secure database registries to ensure verify.aferainnov.africa can validate your academic credentials indefinitely.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
              5. Your Rights
            </h2>
            <p>
              You have the right to request access to your personal files, request correction of inaccurate records, or seek academic support by raising an enquiry under the <strong>Messages</strong> portal tab or emailing admissions@aferainnov.africa.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
