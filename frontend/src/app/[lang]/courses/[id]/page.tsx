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
  Users,
  Smartphone,
  X,
  CheckCircle2,
  Loader2,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { useNotification } from '@/lib/NotificationContext';

export default function CourseDetailsPage() {
  const { lang, id } = useParams();
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const STATIC_COURSE_DETAILS: Record<string, any> = {
    'masters-resource-mobilization': {
      id: 'masters-resource-mobilization',
      title_en: 'Specialized Master’s Degree in Resource Mobilization, Financing and Maintenance',
      title_fr: 'Master Spécialisé en Mobilisation de Ressources, Financement et Maintenance',
      title_pt: 'Mestrado Especializado em Mobilização de Recursos, Financiamento e Manutenção',
      title_sw: 'Shahada ya Uzamili ya Kitaalamu katika Ukusanyaji wa Rasilimali na Ufadhili',
      description_en: 'This pan-African, high-level postgraduate programme is designed to develop elite professionals capable of transforming road infrastructure systems across Africa through policy, finance, and engineering.',
      description_fr: 'Ce programme de troisième cycle de haut niveau est conçu pour former des professionnels d\'élite capables de transformer les systèmes d\'infrastructure routière en Afrique.',
      description_pt: 'Este programa de pós-graduação de alto nível foi concebido para desenvolver profissionais de elite capazes de transformar os sistemas de infra-estruturas rodoviárias em África.',
      description_sw: 'Mpango huu wa kiwango cha juu wa uzamili umeundwa ili kuendeleza wataalamu wasomi wenye uwezo wa kubadilisha mifumo ya miundombinu ya barabara kote Afrika.',
      price: "Starting Soon",
      duration: '2 Years (4 Semesters)',
      modality: 'Hybrid (Online + In-person)',
      department: 'Infrastructure Management',
      course_type: 'Master’s Degree',
      outcomes: [
        "Master infrastructure financing models and PPPs",
        "Design sustainable resource mobilization strategies",
        "Apply advanced road maintenance technologies",
        "Lead institutional transformation and policy reform",
        "Implement climate-resilient maintenance policies",
        "Deliver real-world impact through applied research"
      ],
      Modules: [
        { order: 1, title: 'Governance & Institutional Frameworks', duration_weeks: 16, description: 'Road infrastructure governance, legal frameworks, and transport economics.' },
        { order: 2, title: 'Resource Mobilization & Financing', duration_weeks: 16, description: 'PPPs, innovative financing (Fintech, Green Funds), and donor engagement.' },
        { order: 3, title: 'Maintenance, Technology & Sustainability', duration_weeks: 16, description: 'Climate resilience, Asset Management Systems (HDM-4), and field visits.' },
        { order: 4, title: 'Research & Professional Project', duration_weeks: 16, description: 'Master’s dissertation and oral defense before an expert jury.' }
      ],
      partners: [
        "CESAG (Dakar)", "CBK-IMS (Nairobi)", "KIHBT (Nairobi)", "ENSTP (Yaoundé)", "World Bank", "AfDB", "European Union"
      ]
    },
    'certificate-rbm': {
      id: 'certificate-rbm',
      title_en: 'Specialist Certification in Results-Based Management (RBM)',
      title_fr: 'Certification de spécialiste en gestion axée sur les résultats (GAR)',
      title_pt: 'Certificação de Especialista em Gestão Baseada em Resultados (RBM)',
      title_sw: 'Udhibitisho wa Mtaalam katika Usimamizi Unaozingatia Matokeo (RBM)',
      description_en: 'This flagship programme equips professionals in the road sector with practical tools to design, implement, and manage RBM systems—a critical approach for improving performance, accountability, and sustainability in road infrastructure management across Africa.',
      description_fr: 'Ce programme phare équipe les professionnels du secteur routier d\'outils pratiques pour concevoir, mettre en œuvre et gérer des systèmes de GAR—une approche critique pour améliorer la performance, la responsabilité et la durabilité.',
      description_pt: 'Este programa emblemático equipa os profissionais do sector rodoviário com ferramentas práticas para conceber, implementar e gerir sistemas de RBM.',
      description_sw: 'Mpango huu mkuu huwapa wataalamu katika sekta ya barabara zana za vitendo za kubuni, kutekeleza, na kusimamia mifumo ya RBM.',
      price: "Starting Soon",
      duration: '13 Weeks + Seminar',
      modality: 'Hybrid (Online + Residential)',
      department: 'Infrastructure Management',
      course_type: 'Professional Certificate',
      outcomes: [
        "Apply RBM principles in real institutional contexts",
        "Conduct situational and stakeholder analysis",
        "Design logical frameworks and results chains",
        "Build SMART performance indicators",
        "Develop and manage monitoring & evaluation systems",
        "Translate strategy into performance contracts"
      ],
      Modules: [
        { order: 1, title: 'RBM Foundations', duration_weeks: 2, description: 'Core concepts, historical context, and the shift from inputs to results.' },
        { order: 2, title: 'Situational & Stakeholder Analysis', duration_weeks: 2, description: 'Identifying gaps and mapping the road maintenance ecosystem.' },
        { order: 3, title: 'Logical Frameworks & Results Chains', duration_weeks: 2, description: 'Building the visual map of impact and accountability.' },
        { order: 4, title: 'Risk Management', duration_weeks: 1, description: 'Mitigating internal and external threats to infrastructure goals.' },
        { order: 5, title: 'Operational Planning', duration_weeks: 2, description: 'Translating high-level strategy into actionable work plans.' },
        { order: 6, title: 'Performance Indicators (SMART)', duration_weeks: 2, description: 'Designing data-driven metrics for road quality and funding.' },
        { order: 7, title: 'Monitoring & Evaluation Systems', duration_weeks: 2, description: 'Techniques for real-time tracking and strategic reporting.' },
        { order: 8, title: 'RBM Implementation (Residential)', duration_weeks: 1, description: 'Final project presentation and networking seminar in person.' }
      ],
      fee_structure: [
        { profile: 'Staff from ARMFA member Funds', range: '1,800 — 2,400', conditions: 'Discounted rate, quota by country' },
        { profile: 'Ministry officials', range: '2,400 — 3,000', conditions: 'Based on institutional MoU' },
        { profile: 'External participants', range: '3,000 — 3,600', conditions: 'Full fee, subject to places available' }
      ]
    }
  };

  const { isAuthenticated, user } = useAuth();
  const { showNotification } = useNotification();
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  // Payment States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState('');

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang as string);
    }

    const fetchCourse = async () => {
      // Check static data first
      if (typeof id === 'string' && STATIC_COURSE_DETAILS[id]) {
        setCourse(STATIC_COURSE_DETAILS[id]);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
        
        // Check if user is already enrolled
        if (isAuthenticated && res.data.Enrollments) {
          const enrolled = res.data.Enrollments.some((e: any) => e.student_id === user?.id);
          setIsEnrolled(enrolled);
        }
      } catch (err) {
        console.error('Failed to fetch course details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [lang, id, i18n, isAuthenticated, user]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push(`/${lang}/register?program=${encodeURIComponent(title)}`);
      return;
    }

    setEnrolling(true);
    try {
      const res = await api.post(`/courses/${course.id}/enroll`);
      if (res.data.invoice) {
        setSelectedInvoice(res.data.invoice);
        setIsPaymentModalOpen(true);
      } else {
        showNotification('Enrolled successfully!', 'success');
        setIsEnrolled(true);
      }
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Enrollment failed', 'error');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-24 bg-white dark:bg-slate-900">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 text-center px-4 bg-white dark:bg-slate-900">
      <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">Course Not Found</h2>
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
    <main className="pt-24 min-h-screen bg-gray-50/50 dark:bg-slate-950 pb-20 overflow-hidden">
      
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
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gray-50/50 dark:bg-slate-950" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-slate-800">
              <h2 className="text-3xl font-bold text-primary dark:text-white mb-8">Program Overview</h2>
              <div className="prose prose-lg text-gray-600 dark:text-gray-400 max-w-none mb-10 leading-relaxed">
                {description}
              </div>
 
              <h3 className="text-xl font-bold text-primary dark:text-white mb-6">Learning Outcomes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(course.outcomes || [
                  "Advanced financial modeling for road projects",
                  "Deep understanding of PPP legal frameworks",
                  "Strategic asset management principles",
                  "Resource mobilization in developing economies",
                  "Results-based management applications",
                  "Performance monitoring and evaluation"
                ]).map((item: string, i: number) => (
                  <div key={i} className="flex items-start space-x-3 bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl">
                    <CheckCircle className="text-accent w-5 h-5 flex-shrink-0 mt-1" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Fees Section */}
            {course.fee_structure && (
              <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                <h2 className="text-3xl font-bold text-primary dark:text-white mb-2">Investment & Fees</h2>
                <p className="text-gray-500 mb-10 text-sm">Learner fees are differentiated by profile to ensure accessibility across ARMFA membership:</p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest border border-primary/10">Profile</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest border border-primary/10 whitespace-nowrap">Fee range (USD)</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest border border-primary/10">Conditions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {course.fee_structure.map((item: any, idx: number) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50/20 dark:bg-slate-800/20'}>
                          <td className="px-6 py-5 text-sm font-bold text-primary dark:text-white border border-gray-100 dark:border-slate-800">{item.profile}</td>
                          <td className="px-6 py-5 text-sm font-black text-accent border border-gray-100 dark:border-slate-800 whitespace-nowrap">{item.range}</td>
                          <td className="px-6 py-5 text-xs text-gray-500 font-medium border border-gray-100 dark:border-slate-800 leading-relaxed italic">{item.conditions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8 p-6 bg-accent/5 rounded-2xl border border-accent/10 flex items-start space-x-4">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-accent shrink-0">
                    <CheckCircle size={20} />
                  </div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
                    <span className="font-bold text-primary dark:text-white uppercase tracking-tighter">Note:</span> Fees include training, digital materials, platform access, and accommodation during residential seminars. International travel costs are not included.
                  </p>
                </div>
              </div>
            )}
 
            {/* Modules Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-slate-800">
               <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-bold text-primary dark:text-white">Curriculum Structure</h2>
                  <span className="text-xs font-bold bg-primary/5 text-primary dark:text-white px-4 py-2 rounded-full uppercase tracking-widest">
                    {course.Modules?.length || 0} Modules
                  </span>
               </div>
               
               <div className="space-y-6">
                 {course.Modules?.map((mod: any, i: number) => (
                   <div key={mod.id} className="group relative pl-8 border-l-2 border-gray-100 dark:border-slate-800 hover:border-accent transition-colors pb-8 last:pb-0">
                      <div className="absolute top-0 -left-[9px] w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 group-hover:border-accent group-hover:bg-accent transition-all"></div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                         <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Module {mod.order || i+1}</p>
                            <h4 className="text-lg font-bold text-primary dark:text-white mb-2">{mod[`title_${currentLang}`] || mod.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl">{mod[`description_${currentLang}`] || mod.description}</p>
                         </div>
                         <div className="text-right flex-shrink-0">
                            <span className="text-xs font-bold text-gray-400 bg-gray-50 dark:bg-slate-800 px-3 py-1 rounded-lg uppercase tracking-wider">{mod.duration_weeks} Weeks</span>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Enrollment Sidebar */}
          <div className="lg:col-span-1">
             <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-2xl border border-gray-100 dark:border-slate-800 sticky top-32">
                <div className="text-center mb-8">
                   <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Program Status</p>
                   <div className="flex items-center justify-center">
                      <span className="text-2xl font-black bg-accent/10 text-accent px-6 py-2 rounded-2xl uppercase tracking-[0.1em] shadow-sm">Starting Soon</span>
                   </div>
                </div>

                <div className="space-y-6 mb-10">
                   <div className="flex items-center justify-between text-sm py-4 border-b border-gray-50 dark:border-slate-800">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Application Fee</span>
                      <span className="text-primary dark:text-white font-bold">Included</span>
                   </div>
                   <div className="flex items-center justify-between text-sm py-4 border-b border-gray-50 dark:border-slate-800">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Learning Materials</span>
                      <span className="text-primary dark:text-white font-bold">Included</span>
                   </div>
                   <div className="flex items-center justify-between text-sm py-4">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Certification</span>
                      <span className="text-primary dark:text-white font-bold text-accent">Verified Gold</span>
                   </div>
                </div>

                {isEnrolled ? (
                  <div className="w-full py-5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
                    <CheckCircle size={20} />
                    <span>Already Applied</span>
                  </div>
                ) : (
                  <Button 
                    onClick={handleEnroll}
                    variant="primary" 
                    className="w-full py-5 text-sm font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center group"
                    disabled={enrolling}
                  >
                    {enrolling ? (
                      <div className="flex items-center">
                        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        {isAuthenticated ? 'Enroll Now' : 'Apply For Admission'} 
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                )}

                <p className="text-center text-[10px] text-gray-400 mt-6 leading-relaxed">
                   Admission is competitive. Secure your spot by completing the initial application phase.
                </p>

                <div className="mt-10 pt-8 border-t border-gray-50 dark:border-slate-800 space-y-4">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                         <Users size={20} />
                      </div>
                      <div className="text-left">
                         <p className="text-xs font-bold text-primary dark:text-white leading-none">Limited Cohort</p>
                         <p className="text-[10px] text-gray-400 mt-1 uppercase">25 Seats Available</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </section>
      {/* Payment Checkout Modal */}
      {isPaymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden">
            <div className="p-8 bg-primary text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Secure Checkout</h3>
                <p className="text-xs opacity-60 font-medium">Invoice ID: {selectedInvoice.id?.slice(0, 8)}</p>
              </div>
              <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 flex justify-between items-center">
                <span className="font-bold text-gray-500">Amount Due</span>
                <span className="text-2xl font-black text-primary dark:text-white">${parseFloat(selectedInvoice.total_amount).toLocaleString()}</span>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Select Gateway</p>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'mpesa', name: 'M-Pesa STK Push', icon: Smartphone, color: 'emerald' },
                    { id: 'paypal', name: 'PayPal Global', icon: Globe, color: 'blue' },
                    { id: 'pesapal', name: 'PesaPal v3', icon: CreditCard, color: 'orange' }
                  ].map((g) => (
                    <button 
                      key={g.id}
                      type="button"
                      onClick={() => setPaymentMethod(g.id)}
                      className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                        paymentMethod === g.id 
                          ? 'border-accent bg-accent/5' 
                          : 'border-gray-100 dark:border-slate-800 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <g.icon size={20} />
                        </div>
                        <span className="font-bold text-primary dark:text-white">{g.name}</span>
                      </div>
                      {paymentMethod === g.id && <CheckCircle2 size={20} className="text-accent" />}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'mpesa' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">M-Pesa Phone Number</label>
                  <input 
                    type="text" 
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold"
                    placeholder="e.g. 254712345678"
                  />
                </div>
              )}

              <Button 
                onClick={async () => {
                  try {
                    setPaying(true);
                    const res = await api.post('/payments/initiate', {
                      invoice_id: selectedInvoice.id,
                      gateway: paymentMethod,
                      phone: mpesaPhone
                    });
                    showNotification(res.data.message, 'success');
                    if (res.data.url) window.location.href = res.data.url;
                    setIsPaymentModalOpen(false);
                    setIsEnrolled(true);
                  } catch (err: any) {
                    showNotification(err.response?.data?.message || 'Payment initiation failed', 'error');
                  } finally {
                    setPaying(false);
                  }
                }}
                disabled={!paymentMethod || paying || (paymentMethod === 'mpesa' && !mpesaPhone)}
                className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl"
              >
                {paying ? <Loader2 className="animate-spin" /> : `Complete Payment`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
