'use client';

import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function TermsOfService({ params }: { params: { lang: string } }) {
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
            <FileText size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary dark:text-white leading-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">
            Last Updated: July 6, 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-slate-800 space-y-10 text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, registering for an account, or purchasing academic courses on aferainnov.africa ("Platform"), you accept and agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you are prohibited from using the platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
              2. Student Registration & Profile Security
            </h2>
            <p>
              To access academic course content and dashboard panels, you must register a student account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, complete, and current profile information.</li>
              <li>Keep your password secure and confidential. We generate a temporary credentials sequence on account creation, which must be immediately updated upon first login under your <strong>Profile Settings</strong>.</li>
              <li>Take sole responsibility for all activity occurring under your account.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
              3. Course Fees, Billing & Scholarships
            </h2>
            <p>
              Course registration fees are detailed inside the course catalog. Invoices are dispatched to the student's dashboard upon successful enrollment. Tuition fees must be paid through the secure checkout gateways (Bank Transfer, M-Pesa, PayPal, or PesaPal). 
              Scholarship applications are subject to manual administrative verification and approval. No scholarship discount is automatically applied to payments without official registry authorization.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
              4. Code of Conduct & Intellectual Property
            </h2>
            <p>
              All curriculum designs, workshops, presentations, slides, and educational videos published on the Platform are protected by copyright laws. You are granted a limited, personal, non-transferable license to view presentation slides (via inline PDF viewers) and complete coursework. 
              Any duplication, public sharing, downloading of restricted materials, or academic plagiarism will result in immediate student suspension.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
              5. Governing Law
            </h2>
            <p>
              These terms are governed and construed in accordance with the laws of Kenya. Any legal actions or disputes relating to AFERA INNOV ACADEMY services shall be submitted to the competent courts of Nairobi.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
