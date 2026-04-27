'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  Clock, 
  GraduationCap, 
  LayoutDashboard, 
  MessageSquare, 
  Bell,
  Search,
  Settings,
  ChevronRight,
  PlayCircle,
  PlusCircle,
  CreditCard,
  FileText,
  Megaphone,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation('common');
  const { showNotification } = useNotification();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'finance' | 'resources' | 'profile'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [enrollRes, coursesRes, invoiceRes, resourceRes] = await Promise.all([
        api.get('/enrollments/my'),
        api.get('/courses'),
        api.get('/finance/my-invoices'),
        api.get('/resources/my')
      ]);
      setEnrollments(enrollRes.data);
      setAvailableCourses(coursesRes.data);
      setInvoices(invoiceRes.data);
      setResources(resourceRes.data);
    } catch (err) {
      showNotification('Failed to fetch dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      showNotification('Successfully enrolled in course!', 'success');
      fetchDashboardData();
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Enrollment failed', 'error');
    }
  };

  const courses = enrollments.flatMap(e => e.Program?.Courses || []);
  const totalBalance = enrollments.reduce((sum, e) => sum + (parseFloat(e.fee_amount) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 pt-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Modern Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-primary dark:text-white flex items-center">
              Welcome back, <span className="text-accent italic ml-2">{user?.first_name || 'Student'}</span>
              <span className="ml-3 px-3 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full border border-accent/20">Active Scholar</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Your academic journey is 65% complete. Keep it up!</p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex p-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
             {[
               { id: 'overview', label: 'Overview', icon: LayoutDashboard },
               { id: 'courses', label: 'My Units', icon: BookOpen },
               { id: 'finance', label: 'Finance', icon: CreditCard },
               { id: 'resources', label: 'Resources', icon: Megaphone },
               { id: 'profile', label: 'Profile', icon: Settings }
             ].map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                   activeTab === tab.id 
                   ? 'bg-primary text-white shadow-lg' 
                   : 'text-gray-400 hover:text-primary hover:bg-gray-50'
                 }`}
               >
                 <tab.icon size={16} />
                 <span>{tab.label}</span>
               </button>
             ))}
          </div>
        </div>

        {/* Application Status Banner (Phase 1) */}
        {enrollments.some(e => e.status === 'pending_approval') && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-6 bg-accent/10 border border-accent/20 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white animate-pulse">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-primary dark:text-white">Application Under Review</h3>
                <p className="text-sm text-gray-500 font-medium">Your submission is currently being processed by the admissions committee. We'll notify you once approved!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-black text-accent uppercase tracking-widest bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-sm border border-accent/10">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
              Processing Admissions
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Workspace */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  {/* Performance Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { label: 'Units Completed', value: '08/12', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                      { label: 'Current Average', value: '4.8 GPA', icon: GraduationCap, color: 'text-accent', bg: 'bg-accent/5' },
                      { label: 'Pending Tasks', value: '03 Items', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-gray-50 dark:border-slate-800 group hover:shadow-xl transition-all">
                        <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
                          <stat.icon size={24} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-primary dark:text-white">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Active Learning (Dynamic from enrollments) */}
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold text-primary dark:text-white">Continuous Learning</h3>
                      <button onClick={() => setActiveTab('courses')} className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline">Manage All Units</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {enrollments.length > 0 ? (
                         enrollments.filter(e => e.status === 'enrolled').slice(0, 2).map((enrollment, idx) => {
                           const course = enrollment.Course;
                           const currentLang = i18n.language || 'en';
                           const title = course?.[`title_${currentLang}`] || course?.title_en || 'Specialized Program';
                           
                           return (
                             <div key={enrollment.id} className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-transparent hover:border-accent/20 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                   <div className={`w-10 h-10 ${idx === 0 ? 'bg-primary' : 'bg-accent'} rounded-xl flex items-center justify-center text-white`}>
                                      <PlayCircle size={20} />
                                   </div>
                                   <span className="px-2 py-1 bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase rounded-md">
                                      {idx === 0 ? '65%' : '0%'} In Progress
                                   </span>
                                </div>
                                <h4 className="font-bold text-primary dark:text-white mb-2 line-clamp-1">{title}</h4>
                                <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full mb-6">
                                   <div className={`h-full ${idx === 0 ? 'bg-emerald-500' : 'bg-accent'} rounded-full`} style={{ width: idx === 0 ? '65%' : '5%' }}></div>
                                </div>
                                <a 
                                  href="https://aferaacademy.africa/login/index.php" 
                                  target="_blank"
                                  className="w-full flex items-center justify-center py-3 bg-white dark:bg-slate-900 text-primary dark:text-white rounded-xl text-xs font-bold border border-gray-100 dark:border-slate-700 hover:bg-accent hover:text-white transition-all shadow-sm"
                                >
                                  <ExternalLink size={14} className="mr-2" /> Resume in LMS
                                </a>
                             </div>
                           );
                         })
                       ) : (
                         <div className="col-span-2 py-10 text-center border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-[32px]">
                            <p className="text-gray-400 font-medium text-sm">You haven't enrolled in any programs yet.</p>
                            <Button variant="accent" size="sm" className="mt-4" onClick={() => router.push(`/${i18n.language}/courses`)}>Explore Catalog</Button>
                         </div>
                       )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'courses' && (
                <motion.div 
                  key="courses"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-primary dark:text-white mb-8">Registered Programs & Units</h3>
                    
                    {enrollments.length > 0 ? (
                      <div className="space-y-10">
                        {enrollments.map((enrollment) => {
                          const course = enrollment.Course;
                          const currentLang = i18n.language || 'en';
                          const title = course?.[`title_${currentLang}`] || course?.title_en || 'Specialized Program';
                          const modules = course?.Modules || [];
                          
                          return (
                            <div key={enrollment.id} className="space-y-6">
                               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-primary/5 rounded-[32px] border border-primary/10">
                                  <div className="flex items-center space-x-4">
                                     <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                                        <GraduationCap size={24} />
                                     </div>
                                     <div>
                                        <h4 className="text-lg font-bold text-primary dark:text-white">{title}</h4>
                                        <div className="flex items-center mt-1">
                                           <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                             enrollment.status === 'enrolled' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                           }`}>
                                              {enrollment.status.replace('_', ' ')}
                                           </span>
                                           <span className="mx-2 text-gray-300">|</span>
                                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{modules.length} Modules Total</span>
                                        </div>
                                     </div>
                                  </div>
                                  <Link href={`/${currentLang}/courses/${course?.id || '#'}`}>
                                     <Button variant="outline" size="sm" className="rounded-xl font-bold">View Program Info</Button>
                                  </Link>
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 md:pl-8">
                                  {modules.length > 0 ? (
                                    modules.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((mod: any, idx: number) => (
                                      <div key={mod.id} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all flex items-start space-x-4">
                                         <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-xs font-black text-gray-400 shrink-0">
                                            {idx + 1}
                                         </div>
                                         <div className="flex-grow">
                                            <h5 className="font-bold text-primary dark:text-white text-sm mb-1">{mod[`title_${currentLang}`] || mod.title_en}</h5>
                                            <p className="text-[10px] text-gray-400 font-medium mb-3 line-clamp-1">{mod[`description_${currentLang}`] || 'Course module content'}</p>
                                            <div className="flex items-center justify-between">
                                               <span className="text-[9px] font-black text-accent uppercase tracking-widest">{mod.duration_weeks} Weeks</span>
                                               <button className="text-[9px] font-black text-primary dark:text-white uppercase tracking-widest flex items-center hover:text-accent transition-colors">
                                                  Details <ChevronRight size={10} className="ml-1" />
                                               </button>
                                            </div>
                                         </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="col-span-2 py-6 text-center bg-gray-50 dark:bg-slate-800 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                                       <p className="text-xs text-gray-400 font-medium italic">Detailed modules for this program will be released soon.</p>
                                    </div>
                                  )}
                               </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-[40px]">
                         <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <BookOpen size={40} />
                         </div>
                         <h4 className="text-xl font-bold text-primary dark:text-white mb-2">No Active Units</h4>
                         <p className="text-gray-500 max-w-sm mx-auto mb-8">You are not currently enrolled in any academic programs. Visit our catalog to start your journey.</p>
                         <Button variant="primary" onClick={() => router.push(`/${i18n.language}/courses`)}>Browse Academic Catalog</Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'finance' && (
                <motion.div 
                  key="finance"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-primary p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                     <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                           <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-2">Total Program Investment</p>
                           <h2 className="text-5xl font-black">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                           <div className="flex items-center mt-4 text-emerald-400 font-bold text-sm">
                              <CheckCircle2 size={16} className="mr-2" /> All invoices generated for your profile
                           </div>
                        </div>
                        <Button 
                          onClick={() => {
                            const ref = prompt('Enter M-Pesa Transaction Reference:');
                            if (ref) {
                              const pendingInv = invoices.find(inv => inv.status === 'pending');
                              if (pendingInv) {
                                api.put(`/finance/mock-pay/${pendingInv.id}`)
                                  .then(() => {
                                    showNotification('Payment successful!', 'success');
                                    fetchDashboardData();
                                  })
                                  .catch(() => showNotification('Payment failed', 'error'));
                              } else {
                                showNotification('No pending invoices found', 'info');
                              }
                            }
                          }}
                          variant="accent" size="lg" className="rounded-2xl px-10 h-16 text-primary shadow-xl"
                        >
                           <CreditCard size={20} className="mr-3" /> Pay Online
                        </Button>
                     </div>
                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
                     <h3 className="text-xl font-bold text-primary dark:text-white mb-8">Academic Invoices</h3>
                     <div className="space-y-4">
                        {invoices.length > 0 ? (
                          invoices.map((inv, i) => {
                            const course = inv.Enrollment?.Course;
                            const currentLang = i18n.language || 'en';
                            const programTitle = course?.[`title_${currentLang}`] || course?.title_en || 'Specialized Program';
                            
                            return (
                              <div key={inv.id} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-800 rounded-3xl border border-transparent hover:border-gray-200 transition-all">
                                 <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-primary dark:text-white shadow-sm">
                                       <FileText size={20} />
                                    </div>
                                    <div>
                                       <p className="font-bold text-primary dark:text-white">{programTitle}</p>
                                       <p className="text-xs text-gray-400 font-medium">Due: {new Date(inv.due_date).toLocaleDateString()}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center space-x-6">
                                    <div className="text-right">
                                       <p className="font-black text-primary dark:text-white">${parseFloat(inv.total_amount).toLocaleString()}</p>
                                       <span className={`text-[10px] font-black uppercase tracking-widest ${
                                         inv.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'
                                       }`}>
                                          {inv.status}
                                       </span>
                                    </div>
                                    <button 
                                      onClick={() => window.print()}
                                      className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-gray-400 hover:text-primary transition-all"
                                    >
                                       <Download size={18} />
                                    </button>
                                 </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="py-10 text-center border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-3xl">
                             <p className="text-gray-400 font-medium text-xs">No invoices found for your account yet.</p>
                          </div>
                        )}
                     </div>
                  </div>
                </motion.div>
              )}

               {activeTab === 'resources' && (
                <motion.div 
                  key="resources"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                   {/* Announcements */}
                   <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
                      <h3 className="text-xl font-bold text-primary dark:text-white mb-8 flex items-center">
                        <Megaphone size={24} className="mr-3 text-accent" /> Academy Announcements
                      </h3>
                      <div className="space-y-6">
                        {[
                          { title: 'End of Semester Registration', date: '2 days ago', priority: 'High', content: 'Please ensure you register your units for the next semester by Friday.' },
                          { title: 'Workshop: AI in Infrastructure', date: '5 days ago', priority: 'Medium', content: 'Join us for a specialized workshop on AI applications in road maintenance.' }
                        ].map((ann, i) => (
                          <div key={i} className="p-6 bg-accent/5 rounded-[32px] border border-accent/10 relative overflow-hidden group">
                             <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                   <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${ann.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                      {ann.priority} Priority
                                   </span>
                                   <span className="text-[10px] font-bold text-gray-400">{ann.date}</span>
                                </div>
                                <h4 className="font-bold text-primary dark:text-white mb-2">{ann.title}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">{ann.content}</p>
                             </div>
                             <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 -translate-y-1/2 translate-x-1/2 rounded-full group-hover:scale-150 transition-transform"></div>
                          </div>
                        ))}
                      </div>
                   </div>

                   {/* Notes & Materials */}
                   <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
                      <h3 className="text-xl font-bold text-primary dark:text-white mb-8">Course Notes & Materials</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {resources.length > 0 ? (
                           resources.map((res, i) => {
                             const currentLang = i18n.language || 'en';
                             const title = res[`title_${currentLang}`] || res.title_en;
                             return (
                               <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl group cursor-pointer hover:bg-primary hover:text-white transition-all">
                                  <div className="flex items-center space-x-3">
                                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                       res.resource_type === 'syllabus' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary group-hover:bg-white/20 group-hover:text-white'
                                     }`}>
                                        <FileText size={18} />
                                     </div>
                                     <div className="flex-grow min-w-0">
                                        <p className="text-xs font-bold truncate">{title}</p>
                                        <p className="text-[9px] opacity-60 font-medium uppercase tracking-widest">{res.resource_type}</p>
                                     </div>
                                  </div>
                                  <a href={res.file_url} target="_blank" download className="p-2 rounded-lg hover:bg-white/20 transition-all">
                                     <Download size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </a>
                               </div>
                             );
                           })
                         ) : (
                           <div className="col-span-2 py-10 text-center border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-[32px]">
                              <p className="text-gray-400 font-medium text-xs italic">Academic resources will appear here once uploaded by your instructors.</p>
                           </div>
                         )}
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                   <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-10">
                         <h3 className="text-2xl font-bold text-primary dark:text-white">Profile Settings</h3>
                         <span className="px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full border border-accent/20">Afera Scholar ID: {user?.id?.slice(0,8)}</span>
                      </div>
                      
                      <form className="space-y-8" onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const data = Object.fromEntries(formData.entries());
                        api.put('/users/profile', data)
                          .then(() => showNotification('Profile updated successfully!', 'success'))
                          .catch(() => showNotification('Failed to update profile', 'error'));
                      }}>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                               <input 
                                 name="first_name"
                                 defaultValue={user?.first_name}
                                 className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold text-primary dark:text-white focus:ring-2 focus:ring-accent transition-all" 
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                               <input 
                                 name="last_name"
                                 defaultValue={user?.last_name}
                                 className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold text-primary dark:text-white focus:ring-2 focus:ring-accent transition-all" 
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                               <input 
                                 name="phone"
                                 defaultValue={user?.phone}
                                 className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold text-primary dark:text-white focus:ring-2 focus:ring-accent transition-all" 
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nationality</label>
                               <input 
                                 name="nationality"
                                 defaultValue={user?.StudentProfile?.nationality}
                                 className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold text-primary dark:text-white focus:ring-2 focus:ring-accent transition-all" 
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                               <select 
                                 name="gender"
                                 defaultValue={user?.StudentProfile?.gender}
                                 className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold text-primary dark:text-white focus:ring-2 focus:ring-accent transition-all"
                               >
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                               <input 
                                 name="date_of_birth"
                                 type="date"
                                 defaultValue={user?.StudentProfile?.date_of_birth}
                                 className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold text-primary dark:text-white focus:ring-2 focus:ring-accent transition-all" 
                               />
                            </div>
                         </div>
                         
                         <div className="pt-6">
                            <Button type="submit" variant="primary" className="w-full md:w-auto px-12 h-14 rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-primary/20">
                               Save Changes
                            </Button>
                         </div>
                      </form>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
             {/* Profile Card */}
             <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 text-center">
                <div className="relative inline-block mb-6">
                   <div className="w-24 h-24 rounded-[32px] bg-primary flex items-center justify-center text-white text-3xl font-black shadow-2xl relative z-10">
                      {user?.first_name?.[0] || 'S'}
                   </div>
                   <div className="absolute inset-0 bg-accent rounded-[32px] translate-x-2 translate-y-2 opacity-20"></div>
                </div>
                <h3 className="text-xl font-bold text-primary dark:text-white">{user?.first_name} {user?.last_name}</h3>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Enrollment No: AFR-2026-901</p>
                
                <div className="mt-8 pt-8 border-t border-gray-50 dark:border-slate-800 space-y-4">
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-medium">Academic Status</span>
                      <span className="font-bold text-emerald-500">In Good Standing</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-medium">Credits Earned</span>
                      <span className="font-bold text-primary dark:text-white">24 / 36</span>
                   </div>
                </div>
             </div>

             {/* Support Module */}
             <div className="bg-accent p-8 rounded-[40px] text-primary shadow-xl shadow-accent/20 relative overflow-hidden">
                <div className="relative z-10">
                   <h3 className="text-lg font-black mb-2 uppercase tracking-tight">Need Support?</h3>
                   <p className="text-primary/70 text-xs font-bold mb-6 leading-relaxed">Our mentors are online to help with your academic journey.</p>
                   <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl flex items-center justify-center">
                      <MessageSquare size={16} className="mr-2" /> Start Chat
                   </button>
                </div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 translate-y-1/2 translate-x-1/2 rounded-full"></div>
             </div>

             {/* Academic Calendar Highlight */}
             <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
                <h3 className="text-lg font-bold text-primary dark:text-white mb-6">Upcoming</h3>
                <div className="space-y-6">
                  {[
                    { day: '28', month: 'JUL', event: 'AI Ethics Webinar', category: 'Live' },
                    { day: '05', month: 'AUG', event: 'Semester Exams', category: 'Academic' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-4">
                       <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center border border-gray-100 dark:border-slate-700">
                          <span className="text-[8px] font-black text-accent leading-none mb-0.5">{item.month}</span>
                          <span className="text-sm font-black text-primary dark:text-white leading-none">{item.day}</span>
                       </div>
                       <div>
                          <p className="text-xs font-bold text-primary dark:text-white">{item.event}</p>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.category}</span>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

