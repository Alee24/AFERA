'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  AlertCircle,
  X,
  Send,
  Smartphone,
  Globe,
  Loader2,
  Puzzle,
  Type,
  Video,
  File,
  DollarSign
} from 'lucide-react';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export default function StudentDashboard() {
  const { user, updateUser } = useAuth();
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const { showNotification } = useNotification();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'finance' | 'resources' | 'profile' | 'grades' | 'messages'>('overview');
  const [grades, setGrades] = useState<any[]>([]);

  // Chat States
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<any>(null);
  const [chatContent, setChatContent] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Payment States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>('bank_transfer');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [paying, setPaying] = useState(false);
  
  // H5P Viewer States
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [isContentViewerOpen, setIsContentViewerOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [enrollRes, coursesRes, invoiceRes, resourceRes, gradesRes] = await Promise.all([
        api.get('/enrollments/my'),
        api.get('/courses'),
        api.get('/finance/my-invoices'),
        api.get('/resources/my'),
        api.get('/academic/my-grades')
      ]);
      setEnrollments(enrollRes.data);
      setAvailableCourses(coursesRes.data);
      setInvoices(invoiceRes.data);
      setResources(resourceRes.data);
      setGrades(gradesRes.data);
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to fetch dashboard data', 'error');
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
  const totalBalance = invoices.reduce((acc, inv) => acc + parseFloat(inv.total_amount), 0);
  const currentLang = i18n.language || 'en';

  const fetchChatUsers = async () => {
    try {
      const res = await api.get('/users');
      setChatUsers(res.data.filter((u: any) => u.id !== user?.id && (u.role === 'lecturer' || u.role === 'admin')));
    } catch (err) {
      console.error('Failed to load user list');
    }
  };

  const fetchChatMessages = async () => {
    try {
      const res = await api.get('/messages');
      setChatMessages(res.data);
    } catch (err) {
      console.error('Failed to load messages');
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatUser || !chatContent.trim()) return;
    setChatSending(true);
    try {
      await api.post('/messages', {
        receiver_id: selectedChatUser.id,
        content: chatContent.trim()
      });
      setChatContent('');
      fetchChatMessages();
    } catch (err) {
      showNotification('Failed to deliver message', 'error');
    } finally {
      setChatSending(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchChatUsers();
      fetchChatMessages();
      const interval = setInterval(fetchChatMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'messages') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, selectedChatUser, activeTab]);

  const gradePointsMap: Record<string, number> = {
    'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  const calculateGPA = (gradesList: any[]) => {
    if (!gradesList || gradesList.length === 0) return '0.00';
    let totalPoints = 0;
    let count = 0;
    for (const g of gradesList) {
      const gradeLetter = (g.grade || '').toUpperCase().trim();
      if (gradeLetter) {
        const points = gradePointsMap[gradeLetter] !== undefined ? gradePointsMap[gradeLetter] : 4.0;
        totalPoints += points;
        count++;
      }
    }
    return count > 0 ? (totalPoints / count).toFixed(2) : '0.00';
  };

  const dynamicGPA = calculateGPA(grades);

  const getAcademicStanding = (gpaVal: number) => {
    if (gpaVal >= 3.7) return 'Distinction';
    if (gpaVal >= 3.0) return 'Credit';
    if (gpaVal >= 2.0) return 'Pass';
    return 'Good Standing';
  };

  const completedUnits = grades.filter((g: any) => parseFloat(g.score) >= 50).length;
  const completedUnitsText = `${completedUnits.toString().padStart(2, '0')}/12`;

  const getPendingTasksCount = () => {
    let count = 0;
    const unpaidInvoices = invoices.filter((inv: any) => inv.status === 'pending');
    count += unpaidInvoices.length;
    
    const pendingEnrollments = enrollments.filter((e: any) => e.status === 'pending_approval' || e.status === 'pending');
    count += pendingEnrollments.length;
    
    if (user && user.role === 'student' && !user.StudentProfile?.nationality) {
      count += 1;
    }
    return count;
  };
  const pendingTasksText = `${getPendingTasksCount().toString().padStart(2, '0')} Items`;

  const downloadPDFInvoice = (inv: any) => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(5, 26, 49); 
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('Helvetica', 'bold');
      doc.text('AFERA INNOV ACADEMY', 15, 25);
      
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(16);
      doc.text('OFFICIAL ACADEMIC INVOICE', 15, 60);
      
      doc.setFontSize(11);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Invoice No: INV-${inv.id?.substring(0, 8).toUpperCase()}`, 15, 75);
      doc.text(`Due Date: ${new Date(inv.due_date).toLocaleDateString()}`, 15, 82);
      doc.text(`Status: ${inv.status.toUpperCase()}`, 15, 89);
      
      doc.setDrawColor(200, 200, 200);
      doc.line(15, 95, 195, 95);
      
      doc.setFontSize(12);
      doc.setFont('Helvetica', 'bold');
      doc.text('Billed To:', 15, 110);
      
      doc.setFontSize(11);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Scholar Name: ${user?.first_name} ${user?.last_name}`, 15, 118);
      doc.text(`Scholar ID: ${user?.StudentProfile?.admission_number || 'N/A'}`, 15, 125);
      doc.text(`Email: ${user?.email}`, 15, 132);
      
      doc.line(15, 140, 195, 140);
      doc.setFont('Helvetica', 'bold');
      doc.text('Description', 15, 150);
      doc.text('Amount Due', 160, 150);
      doc.line(15, 155, 195, 155);
      
      doc.setFont('Helvetica', 'normal');
      const course = inv.Enrollment?.Course;
      const programTitle = course?.[`title_${currentLang}`] || course?.title_en || 'Academic Program Enrolled';
      doc.text(programTitle, 15, 165);
      doc.text(`$${parseFloat(inv.total_amount).toLocaleString()}`, 160, 165);
      
      doc.line(15, 175, 195, 175);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Total Invoice:', 115, 190);
      doc.text(`$${parseFloat(inv.total_amount).toLocaleString()}`, 160, 190);
      
      doc.setFontSize(9);
      doc.setFont('Helvetica', 'italic');
      doc.setTextColor(150, 150, 150);
      doc.text('Thank you for trusting Afera Innov Academy.', 105, 250, { align: 'center' });
      doc.text('This is a computer-generated invoice, no signature required.', 105, 256, { align: 'center' });
      
      doc.save(`Invoice_${inv.id?.substring(0,8)}.pdf`);
    } catch (err) {
      showNotification('Failed to generate PDF invoice', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 pt-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 print:hidden">
        
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
               { id: 'grades', label: 'Grades', icon: GraduationCap },
               { id: 'resources', label: 'Resources', icon: Megaphone },
               { id: 'messages', label: 'Messages', icon: MessageSquare },
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

        {(!(user?.StudentProfile as any)?.nationality || !(user?.StudentProfile as any)?.gender || !(user?.StudentProfile as any)?.religion) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-red-700 dark:text-red-400">Profile Incomplete</h3>
                <p className="text-sm text-gray-500 font-medium">Please finalize your onboarding bio-data (Nationality, Religion, Gender) to unlock all features.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('profile')}
              className="px-6 py-3 bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 flex items-center"
            >
              Complete Profile <ChevronRight size={16} className="ml-1" />
            </button>
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
                      { label: 'Units Completed', value: completedUnitsText, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                      { label: 'Current Average', value: dynamicGPA !== '0.00' ? `${dynamicGPA} GPA` : 'N/A', icon: GraduationCap, color: 'text-accent', bg: 'bg-accent/5' },
                      { label: 'Pending Tasks', value: pendingTasksText, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' }
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
                                  <div className="flex gap-2">
                                     <Link href={`/${currentLang}/courses/${course?.id || '#'}`}>
                                        <Button variant="outline" size="sm" className="rounded-xl font-bold">Details</Button>
                                     </Link>
                                     {enrollment.status === 'enrolled' && (
                                       <Button variant="primary" size="sm" onClick={() => {
                                         if (modules.length > 0) {
                                           setSelectedModule(modules[0]);
                                           setIsContentViewerOpen(true);
                                         }
                                       }} className="rounded-xl font-bold">Start Learning</Button>
                                     )}
                                  </div>
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
                                               {enrollment.status === 'enrolled' && (
                                                 <button 
                                                   onClick={() => {
                                                     setSelectedModule(mod);
                                                     setIsContentViewerOpen(true);
                                                   }}
                                                   className="text-[9px] font-black text-primary dark:text-white uppercase tracking-widest flex items-center hover:text-accent transition-colors"
                                                 >
                                                    Enter Module <ChevronRight size={10} className="ml-1" />
                                                 </button>
                                               )}
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
                            const pendingInv = invoices.find(inv => inv.status === 'pending');
                            if (pendingInv) {
                              setSelectedInvoice(pendingInv);
                              setIsPaymentModalOpen(true);
                            } else {
                              showNotification('No pending invoices found', 'info');
                            }
                          }}
                          variant="accent" size="lg" className="rounded-2xl px-10 h-16 text-primary shadow-xl"
                        >
                           <CreditCard size={20} className="mr-3" /> Pay / Bank Transfer
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
                                    <div className="flex items-center space-x-3">
                                      {inv.status === 'pending' && (
                                        <Button 
                                          onClick={() => {
                                            setSelectedInvoice(inv);
                                            setIsPaymentModalOpen(true);
                                          }}
                                          className="h-10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest bg-primary text-white"
                                        >
                                          Pay Now
                                        </Button>
                                      )}
                                      <button 
                                        onClick={() => downloadPDFInvoice(inv)}
                                        className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-gray-400 hover:text-primary transition-all"
                                      >
                                         <Download size={18} />
                                      </button>
                                    </div>
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

              <AnimatePresence>
                {isPaymentModalOpen && selectedInvoice && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
                    >
                      <div className="p-8 bg-primary text-white flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-bold">Secure Checkout</h3>
                          <p className="text-xs opacity-60 font-medium">Invoice ID: {selectedInvoice.id.slice(0, 8)}</p>
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
                              { id: 'bank_transfer', name: 'Bank Transfer', icon: DollarSign, color: 'indigo' }
                            ].map((g) => (
                              <button 
                                key={g.id}
                                onClick={() => setPaymentMethod(g.id)}
                                className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                                  paymentMethod === g.id 
                                    ? `border-${g.color}-500 bg-${g.color}-50/50 dark:bg-${g.color}-900/10` 
                                    : 'border-gray-100 dark:border-slate-800 hover:border-gray-200'
                                }`}
                              >
                                <div className="flex items-center space-x-4">
                                  <div className={`w-10 h-10 bg-${g.color}-500 rounded-xl flex items-center justify-center text-white`}>
                                    <g.icon size={20} />
                                  </div>
                                  <span className="font-bold text-primary dark:text-white">{g.name}</span>
                                </div>
                                {paymentMethod === g.id && <CheckCircle2 size={20} className={`text-${g.color}-500`} />}
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
                              className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold text-primary dark:text-white"
                              placeholder="e.g. 254712345678"
                            />
                          </div>
                        )}

                        {paymentMethod === 'bank_transfer' && (
                          <div className="space-y-4 text-left">
                            <div className="bg-primary/5 dark:bg-slate-800/50 p-6 rounded-2xl border border-primary/10 dark:border-slate-700/50 space-y-3">
                              <p className="text-xs font-black text-primary dark:text-accent uppercase tracking-widest border-b border-primary/10 dark:border-slate-700 pb-2">KCB Bank Details</p>
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                  <span className="text-gray-400 font-semibold block text-[10px] uppercase">Account Name</span>
                                  <strong className="text-primary dark:text-white font-bold">ARMFA KENYA</strong>
                                </div>
                                <div>
                                  <span className="text-gray-400 font-semibold block text-[10px] uppercase">Account Number</span>
                                  <strong className="text-primary dark:text-white font-bold">128 419 0544</strong>
                                </div>
                                <div>
                                  <span className="text-gray-400 font-semibold block text-[10px] uppercase">Bank Name</span>
                                  <strong className="text-primary dark:text-white font-bold text-[10px]">KENYA COMMERCIAL BANK</strong>
                                </div>
                                <div>
                                  <span className="text-gray-400 font-semibold block text-[10px] uppercase">Swift Code</span>
                                  <strong className="text-primary dark:text-white font-bold">KCBLKENX</strong>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Transaction Reference / Receipt Code</label>
                              <input 
                                type="text" 
                                value={bankRef}
                                onChange={(e) => setBankRef(e.target.value)}
                                className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold text-primary dark:text-white"
                                placeholder="e.g. KCB12345678"
                              />
                            </div>
                          </div>
                        )}

                        <Button 
                          onClick={async () => {
                            try {
                              setPaying(true);
                              const res = await api.post('/payments/initiate', {
                                invoice_id: selectedInvoice.id,
                                gateway: paymentMethod,
                                phone: paymentMethod === 'mpesa' ? mpesaPhone : undefined,
                                reference: paymentMethod === 'bank_transfer' ? bankRef : undefined
                              });
                              showNotification(res.data.message, 'success');
                              if (res.data.url) window.location.href = res.data.url;
                              setIsPaymentModalOpen(false);
                              // Refresh dashboard data so that invoice status and payment badges update
                              fetchDashboardData();
                            } catch (err: any) {
                              showNotification(err.response?.data?.message || 'Payment initiation failed', 'error');
                            } finally {
                              setPaying(false);
                            }
                          }}
                          disabled={
                            !paymentMethod || 
                            paying || 
                            (paymentMethod === 'mpesa' && !mpesaPhone) || 
                            (paymentMethod === 'bank_transfer' && !bankRef.trim())
                          }
                          className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl"
                        >
                          {paying ? <Loader2 className="animate-spin" /> : `Complete Payment`}
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>


              {activeTab === 'grades' && (
                <motion.div 
                  key="grades"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                      <div>
                        <h3 className="text-2xl font-bold text-primary dark:text-white">Academic Performance</h3>
                        <p className="text-gray-500 text-sm mt-1">Detailed results for your enrolled units and programs.</p>
                      </div>
                      <Button 
                        onClick={() => window.print()}
                        variant="accent" 
                        className="rounded-2xl px-8 h-14 font-bold shadow-lg flex items-center"
                      >
                        <FileText size={18} className="mr-2" /> Download Transcript
                      </Button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-100 dark:border-slate-800">
                            <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Unit / Course</th>
                            <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Semester</th>
                            <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Type</th>
                            <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Score</th>
                            <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 text-center">Grade</th>
                            <th className="pb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                          {grades.length > 0 ? (
                            grades.map((grade: any) => (
                              <tr key={grade.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="py-6 px-4">
                                  <p className="font-bold text-primary dark:text-white">{grade.Assessment?.Class?.CourseUnit?.name || 'Unit'}</p>
                                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">
                                    {grade.Assessment?.Class?.CourseUnit?.Course?.course_code || 'CODE'} • {grade.Assessment?.Class?.CourseUnit?.Course?.title_en || 'Course'}
                                  </p>
                                </td>
                                <td className="py-6 px-4">
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Semester {grade.Assessment?.Class?.CourseUnit?.semester || 1}
                                  </span>
                                </td>
                                <td className="py-6 px-4">
                                  <span className="text-[10px] font-black text-primary dark:text-white bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-md uppercase tracking-wider">
                                    {grade.Assessment?.type || 'Exam'}
                                  </span>
                                </td>
                                <td className="py-6 px-4">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-black text-primary dark:text-white">{grade.score}%</span>
                                    <div className="w-16 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full ${parseFloat(grade.score) >= 70 ? 'bg-emerald-500' : parseFloat(grade.score) >= 50 ? 'bg-accent' : 'bg-red-500'}`} 
                                        style={{ width: `${grade.score}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-6 px-4 text-center">
                                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-black text-sm shadow-sm ${
                                    grade.grade.startsWith('A') ? 'bg-emerald-50 text-emerald-600' : 
                                    grade.grade.startsWith('B') ? 'bg-blue-50 text-blue-600' : 
                                    'bg-amber-50 text-amber-600'
                                  }`}>
                                    {grade.grade}
                                  </span>
                                </td>
                                <td className="py-6 px-4">
                                  <p className="text-xs text-gray-500 italic max-w-[200px] line-clamp-2">{grade.remarks}</p>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="py-20 text-center">
                                <div className="flex flex-col items-center">
                                  <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-300 mb-4">
                                    <GraduationCap size={32} />
                                  </div>
                                  <p className="text-gray-400 font-medium italic">No grades have been posted for your account yet.</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-[40px] border border-emerald-100 dark:border-emerald-800">
                        <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-[0.2em] mb-2">Cumulative GPA</p>
                        <h4 className="text-4xl font-black text-emerald-600">{dynamicGPA}</h4>
                        <p className="text-xs text-emerald-600/80 mt-2 font-medium">Top 10% of your class</p>
                     </div>
                     <div className="bg-accent/5 dark:bg-accent/10 p-8 rounded-[40px] border border-accent/10 dark:border-accent/20">
                        <p className="text-[10px] font-black text-accent/60 uppercase tracking-[0.2em] mb-2">Units Attempted</p>
                        <h4 className="text-4xl font-black text-primary dark:text-white">{grades.length}</h4>
                        <p className="text-xs text-gray-500 mt-2 font-medium">Out of 12 required units</p>
                     </div>
                     <div className="bg-primary p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Academic Standing</p>
                        <h4 className="text-3xl font-black relative z-10">In Good Standing</h4>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
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
                          .then((res) => {
                            showNotification('Profile updated successfully!', 'success');
                            if (res.data.user) updateUser(res.data.user);
                          })
                          .catch((err) => showNotification(err.response?.data?.message || 'Failed to update profile', 'error'));
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
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Religion</label>
                               <input 
                                 name="religion"
                                 defaultValue={(user?.StudentProfile as any)?.religion}
                                 className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold text-primary dark:text-white focus:ring-2 focus:ring-accent transition-all" 
                               />
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

              {activeTab === 'messages' && (
                <motion.div 
                  key="messages"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 h-[600px] flex flex-col print:hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 overflow-hidden bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
                     {/* Contacts Sidebar */}
                     <div className="lg:col-span-4 border-r border-gray-50 dark:border-slate-800 flex flex-col h-full overflow-hidden">
                        <div className="p-6 border-b border-gray-50 dark:border-slate-800">
                           <h4 className="font-bold text-primary dark:text-white mb-1">Academic Mentors</h4>
                           <p className="text-[10px] text-gray-400 font-medium">Select a lecturer or administrator to message.</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                           {chatUsers.map((u) => (
                             <div 
                               key={u.id}
                               onClick={() => setSelectedChatUser(u)}
                               className={`p-4 rounded-3xl cursor-pointer transition-all flex items-center space-x-4 border ${
                                 selectedChatUser?.id === u.id 
                                   ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' 
                                   : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-slate-800 text-primary dark:text-white'
                               }`}
                             >
                                <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 text-primary dark:text-white rounded-xl flex items-center justify-center font-bold uppercase shrink-0">
                                   {u.first_name?.[0]}{u.last_name?.[0]}
                                </div>
                                <div className="flex-grow min-w-0">
                                   <p className="font-bold text-sm truncate">{u.first_name} {u.last_name}</p>
                                   <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                     selectedChatUser?.id === u.id ? 'bg-white/20 text-white' : 'bg-primary/5 text-primary dark:text-accent'
                                   }`}>
                                      {u.role}
                                   </span>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>

                     {/* Chat Area */}
                     <div className="lg:col-span-8 flex flex-col h-full overflow-hidden">
                        {selectedChatUser ? (
                          <>
                            <div className="p-6 border-b border-gray-50 dark:border-slate-800 flex items-center space-x-4 bg-gray-50/50 dark:bg-slate-800/20 shrink-0">
                               <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold uppercase">
                                  {selectedChatUser.first_name?.[0]}{selectedChatUser.last_name?.[0]}
                               </div>
                               <div>
                                  <h4 className="font-bold text-sm text-primary dark:text-white">{selectedChatUser.first_name} {selectedChatUser.last_name}</h4>
                                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{selectedChatUser.email}</p>
                               </div>
                            </div>

                            <div className="flex-grow overflow-y-auto p-8 space-y-6">
                               {chatMessages
                                 .filter(m => 
                                   (m.sender_id === user?.id && m.receiver_id === selectedChatUser.id) ||
                                   (m.sender_id === selectedChatUser.id && m.receiver_id === user?.id)
                                 )
                                 .map((m, index) => {
                                   const isMine = m.sender_id === user?.id;
                                   return (
                                     <div key={index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-md p-5 rounded-3xl text-xs font-medium shadow-sm ${
                                          isMine 
                                            ? 'bg-primary text-white rounded-br-none shadow-primary/10' 
                                            : 'bg-gray-50 dark:bg-slate-800 text-primary dark:text-white rounded-bl-none'
                                        }`}>
                                           <p>{m.content}</p>
                                           <p className={`text-[8px] font-bold uppercase tracking-widest mt-2 ${isMine ? 'text-white/60' : 'text-gray-400'}`}>
                                              {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                           </p>
                                        </div>
                                     </div>
                                   );
                                 })}
                               <div ref={chatEndRef} />
                            </div>

                            <form onSubmit={handleSendChatMessage} className="p-6 border-t border-gray-50 dark:border-slate-800 flex items-center space-x-4 shrink-0">
                               <input 
                                 type="text"
                                 value={chatContent}
                                 onChange={(e) => setChatContent(e.target.value)}
                                 placeholder={`Message ${selectedChatUser.first_name}...`}
                                 className="flex-1 px-5 h-12 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-xs font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                 required
                                />
                               <Button 
                                 type="submit"
                                 disabled={chatSending || !chatContent.trim()}
                                 className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center p-0 shadow-lg shadow-primary/20 hover:scale-[1.05] active:scale-[0.95] transition-all shrink-0"
                               >
                                  {chatSending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                               </Button>
                            </form>
                          </>
                        ) : (
                          <div className="flex-grow flex flex-col items-center justify-center p-10 text-gray-400">
                             <MessageSquare size={48} className="mb-4 stroke-1 opacity-50 text-accent" />
                             <p className="font-bold text-sm text-primary dark:text-white">Your Conversations</p>
                             <p className="text-xs font-medium text-gray-400 mt-1">Select an academic mentor or administrator from the sidebar to chat.</p>
                          </div>
                        )}
                     </div>
                  </div>
                </motion.div>
              )}
           </AnimatePresence>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
             {/* Profile Card */}
             <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 text-center">
                <div className="relative inline-block mb-6 group">
                    <div className="w-24 h-24 rounded-[32px] bg-primary flex items-center justify-center text-white text-3xl font-black shadow-2xl relative z-10 overflow-hidden">
                       {(user as any)?.avatar_url ? (
                         <img src={(user as any).avatar_url} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                         user?.first_name?.[0] || 'S'
                       )}
                    </div>
                    <div className="absolute inset-0 bg-accent rounded-[32px] translate-x-2 translate-y-2 opacity-20"></div>
                    
                    <label className="absolute bottom-0 right-0 z-20 w-8 h-8 bg-accent text-primary rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-all">
                       <input 
                         type="file" 
                         accept="image/*" 
                         className="hidden" 
                         onChange={async (e) => {
                           const file = e.target.files?.[0];
                           if (file) {
                             const formData = new FormData();
                             formData.append('file', file);
                             try {
                               const res = await api.post('/upload', formData);
                               await api.put('/users/profile', { avatar_url: res.data.url });
                               updateUser({ ...(user as any), avatar_url: res.data.url });
                               showNotification('Profile picture updated!', 'success');
                             } catch (err) {
                               showNotification('Failed to upload image', 'error');
                             }
                           }
                         }}
                       />
                       <Download size={14} />
                    </label>
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
                   <button onClick={() => setActiveTab('messages')} className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl flex items-center justify-center">
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
       

       <div id="transcript-print" className="hidden print:block bg-white text-black p-12 min-h-screen relative">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none -rotate-45">
             <Image src="/LOGOMAIN.png" alt="Watermark" width={600} height={600} />
          </div>

          <div className="relative z-10">
             {/* Header */}
             <div className="flex justify-between items-start border-b-4 border-primary pb-8 mb-10">
                <div>
                   <Image src="/LOGOMAIN.png" alt="Afera Logo" width={220} height={60} className="mb-4" />
                   <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Innovation Centre & Academy</p>
                </div>
                <div className="text-right">
                   <h1 className="text-3xl font-black text-primary mb-1 uppercase tracking-tighter">Official Transcript</h1>
                   <p className="text-sm font-bold text-gray-500 italic">Academic Record of Achievement</p>
                   <div className="mt-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Document No</p>
                      <p className="text-sm font-bold font-mono">TRN-{new Date().getFullYear()}-{Math.floor(Math.random() * 100000)}</p>
                   </div>
                </div>
             </div>

             {/* Student Details */}
             <div className="grid grid-cols-2 gap-10 mb-12">
                <div className="space-y-4">
                   <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Student Identity</p>
                      <p className="text-2xl font-black text-primary uppercase">{user?.first_name} {user?.last_name}</p>
                      <p className="text-sm font-bold text-accent mt-1">Enrollment ID: {user?.StudentProfile?.admission_number || 'N/A'}</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nationality</p>
                      <p className="text-xs font-bold">{user?.StudentProfile?.nationality || 'N/A'}</p>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Gender</p>
                      <p className="text-xs font-bold">{user?.StudentProfile?.gender || 'N/A'}</p>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date of Birth</p>
                      <p className="text-xs font-bold">
                        {user?.StudentProfile?.date_of_birth 
                          ? new Date(user.StudentProfile.date_of_birth).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                          : 'N/A'}
                      </p>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Issue Date</p>
                      <p className="text-xs font-bold">{new Date().toLocaleDateString()}</p>
                   </div>
                </div>
             </div>

             {/* Results Table */}
             <div className="mb-12">
                <table className="w-full text-sm border-collapse">
                   <thead>
                      <tr className="bg-primary text-white">
                         <th className="py-4 px-6 text-left rounded-tl-2xl uppercase tracking-widest text-[10px] font-black">Unit Code & Description</th>
                         <th className="py-4 px-6 text-center uppercase tracking-widest text-[10px] font-black">Semester</th>
                         <th className="py-4 px-6 text-center uppercase tracking-widest text-[10px] font-black">Mark (%)</th>
                         <th className="py-4 px-6 text-center rounded-tr-2xl uppercase tracking-widest text-[10px] font-black">Grade</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {grades.length > 0 ? grades.map((g: any, i: number) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                           <td className="py-5 px-6">
                              <p className="font-bold text-primary leading-tight">{g.Assessment?.Class?.CourseUnit?.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                                {g.Assessment?.Class?.CourseUnit?.Course?.course_code} • {g.Assessment?.Class?.CourseUnit?.Course?.title_en}
                              </p>
                           </td>
                           <td className="py-5 px-6 text-center font-bold text-gray-600">Semester {g.Assessment?.Class?.CourseUnit?.semester}</td>
                           <td className="py-5 px-6 text-center font-black text-primary">{g.score}%</td>
                           <td className="py-5 px-6 text-center">
                              <span className="inline-block w-8 h-8 leading-8 bg-primary text-white rounded-lg font-black text-xs">
                                {g.grade}
                              </span>
                           </td>
                        </tr>
                      )) : (
                        <tr>
                           <td colSpan={4} className="py-10 text-center text-gray-400 italic">No academic records available for this period.</td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>

             {/* Summary Stats */}
             <div className="flex justify-between items-end">
                <div className="space-y-6">
                   <div className="flex space-x-12">
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cumulative GPA</p>
                         <p className="text-3xl font-black text-primary">{dynamicGPA} <span className="text-sm font-bold text-gray-400">/ 4.0</span></p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Academic Standing</p>
                         <p className="text-xl font-black text-emerald-600 uppercase italic">{getAcademicStanding(parseFloat(dynamicGPA))}</p>
                      </div>
                   </div>
                   <div className="bg-gray-900 text-white p-6 rounded-3xl inline-block">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Academic Validation</p>
                      <p className="text-xs leading-relaxed max-w-xs font-medium">This document is electronically generated and verified by Afera Academy Academic Registry. Verification available at verify.aferainnov.africa</p>
                   </div>
                </div>

                <div className="text-center space-y-4">
                   <div className="w-32 h-32 border-4 border-double border-gray-200 rounded-full flex items-center justify-center p-4 mx-auto relative">
                      <div className="w-full h-full border-2 border-dashed border-gray-100 rounded-full flex items-center justify-center">
                         <Image src="/LOGOMAIN.png" alt="Stamp" width={60} height={60} className="grayscale opacity-20" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="border-2 border-accent text-accent rounded px-2 py-1 rotate-12 text-[10px] font-black uppercase">Official Seal</div>
                      </div>
                   </div>
                   <div>
                      <div className="w-48 border-b-2 border-gray-300 mx-auto mb-1"></div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registrar of Academics</p>
                   </div>
                </div>
             </div>
          </div>
     </div>

      {/* Content Viewer Modal */}
      <AnimatePresence>
        {isContentViewerOpen && selectedModule && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 bg-primary text-white flex justify-between items-center shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-accent text-primary text-[8px] font-black uppercase rounded">Module {selectedModule.order}</span>
                    <h3 className="text-xl font-bold">{selectedModule.title_en || selectedModule.title}</h3>
                  </div>
                  <p className="text-xs opacity-60 font-medium">{selectedModule.description_en || selectedModule.description}</p>
                </div>
                <button onClick={() => setIsContentViewerOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-10 space-y-12">
                {selectedModule.Contents && selectedModule.Contents.length > 0 ? (
                  selectedModule.Contents.sort((a:any, b:any) => a.order - b.order).map((content: any, i: number) => (
                    <div key={content.id} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-accent/10 text-accent rounded-lg flex items-center justify-center">
                             {content.type === 'text' && <Type size={16} />}
                             {content.type === 'video' && <Video size={16} />}
                             {content.type === 'h5p' && <Puzzle size={16} />}
                             {content.type === 'document' && <FileText size={16} />}
                          </div>
                          <h4 className="text-lg font-bold text-primary dark:text-white">{content.title}</h4>
                       </div>

                       {content.type === 'text' && (
                         <div className="prose prose-lg dark:prose-invert max-w-none bg-gray-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-gray-100 dark:border-slate-800">
                            {content.content_en}
                         </div>
                       )}

                       {content.type === 'video' && (
                         <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-xl bg-black">
                            <iframe 
                              src={content.video_url?.includes('youtube.com') ? content.video_url.replace('watch?v=', 'embed/') : content.video_url}
                              className="w-full h-full border-none"
                              allowFullScreen
                            ></iframe>
                         </div>
                       )}

                       {content.type === 'h5p' && (
                         <div className="w-full rounded-3xl overflow-hidden shadow-xl bg-white min-h-[600px] border border-gray-100">
                            <div dangerouslySetInnerHTML={{ __html: content.h5p_embed }} />
                         </div>
                       )}

                       {content.type === 'document' && (
                         <div className="flex items-center justify-between p-6 bg-primary/5 rounded-3xl border border-primary/10">
                            <div className="flex items-center space-x-4">
                               <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                                  <File size={24} />
                               </div>
                               <div>
                                  <p className="font-bold text-primary dark:text-white">Downloadable Resource</p>
                                  <p className="text-xs text-gray-400">PDF / Documentation Asset</p>
                               </div>
                            </div>
                            <a href={content.file_url} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg">Download File</a>
                         </div>
                       )}
                       
                       {i < selectedModule.Contents.length - 1 && <hr className="border-gray-100 dark:border-slate-800" />}
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                     <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-300">
                        <BookOpen size={40} />
                     </div>
                     <div>
                        <h4 className="text-xl font-bold text-primary dark:text-white">No content yet</h4>
                        <p className="text-gray-500 max-w-xs mx-auto">This module hasn't been populated with learning materials yet.</p>
                     </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex justify-end shrink-0">
                 <Button onClick={() => setIsContentViewerOpen(false)} variant="primary" className="rounded-2xl px-10 h-14 shadow-xl">Close Viewer</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
