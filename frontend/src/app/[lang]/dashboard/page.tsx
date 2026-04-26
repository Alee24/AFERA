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
  PlusCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';
import Image from 'next/image';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation('common');
  const { showNotification } = useNotification();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [enrollRes, coursesRes] = await Promise.all([
        api.get('/enrollments/my'),
        api.get('/courses')
      ]);
      setEnrollments(enrollRes.data);
      setAvailableCourses(coursesRes.data);
    } catch (err) {
      showNotification('Failed to fetch dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    try {
      await api.post(`/courses/${courseId}/enroll`);
      showNotification('Successfully enrolled in course!', 'success');
      fetchDashboardData(); // Refresh data
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Enrollment failed';
      showNotification(msg, 'error');
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 pt-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold text-primary dark:text-white">
              Welcome back, <span className="text-accent italic">{user?.name || 'Student'}</span>!
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Ready to continue your learning journey?</p>
          </motion.div>

          <div className="flex items-center space-x-4">
             <button className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 relative">
                <Bell size={20} className="text-gray-400" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
             </button>
             <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-2 pr-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-bold">
                  {user?.name?.[0] || 'S'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-primary dark:text-white leading-none">{user?.name || 'Student'}</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">Lvl 1 Scholar</p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               {[
                 { label: 'Completed', value: '4 Courses', icon: CheckCircleIcon, color: 'text-emerald-500' },
                 { label: 'In Progress', value: '2 Courses', icon: Clock, color: 'text-amber-500' },
                 { label: 'Average Grade', value: 'A-', icon: GraduationCap, color: 'text-primary' }
               ].map((stat, i) => (
                 <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-50 dark:border-slate-800 flex items-center space-x-4">
                    <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                      <stat.icon size={20} className={stat.color} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                      <p className="text-lg font-bold text-primary dark:text-white">{stat.value}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* My Courses Section */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-gray-50 dark:border-slate-800">
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold text-primary dark:text-white">My Active Courses</h3>
                 <button className="text-xs font-bold text-accent hover:underline uppercase tracking-widest">View All</button>
               </div>

               <div className="space-y-6">
                 {loading ? (
                   [1, 2].map(i => <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-2xl"></div>)
                 ) : enrollments.flatMap(e => e.Program?.Courses || []).length > 0 ? (
                    enrollments.flatMap(e => e.Program?.Courses || []).map((course: any, i) => (
                      <div key={i} className="group flex flex-col sm:flex-row items-center bg-gray-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-transparent hover:border-accent/20 hover:bg-white transition-all cursor-pointer">
                        <div className="w-full sm:w-24 h-24 sm:h-16 bg-primary/10 rounded-xl mb-4 sm:mb-0 sm:mr-6 flex items-center justify-center overflow-hidden text-primary font-bold">
                           <BookOpen size={24} />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                           <h4 className="font-bold text-primary dark:text-white group-hover:text-accent transition-colors">{course.title_en || 'Course Title'}</h4>
                           <p className="text-xs text-gray-400 mt-1">Status: Active &bull; Code: {course.course_code || 'N/A'}</p>
                           <div className="mt-3 w-full max-w-[200px] h-1.5 bg-gray-200 rounded-full overflow-hidden mx-auto sm:mx-0">
                              <div className="h-full bg-accent" style={{ width: '45%' }}></div>
                           </div>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center space-x-3">
                           {/* LMS Link Integration */}
                           {course.title_en?.includes('Results-Based Management') && (
                              <a 
                                href="https://aferaacademy.africa/course/view.php?id=26" 
                                target="_blank" 
                                className="px-4 py-2 bg-accent/10 text-accent font-bold text-xs rounded-xl hover:bg-accent hover:text-white transition-all whitespace-nowrap"
                              >
                                Go to Learning Portal
                              </a>
                           )}
                           {course.title_en?.includes('Resource Mobilization') && (
                              <a 
                                href="https://aferaacademy.africa/course/view.php?id=34" 
                                target="_blank" 
                                className="px-4 py-2 bg-accent/10 text-accent font-bold text-xs rounded-xl hover:bg-accent hover:text-white transition-all whitespace-nowrap"
                              >
                                Go to Learning Portal
                              </a>
                           )}
                           
                           <button className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-primary hover:bg-primary hover:text-white transition-all">
                              <PlayCircle size={20} />
                           </button>
                        </div>
                      </div>
                    ))
                 ) : (
                   <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <GraduationCap size={40} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 font-medium">You haven't enrolled in any courses yet.</p>
                      <button className="mt-4 text-accent font-bold uppercase text-xs tracking-widest hover:underline">Explore Programs Below</button>
                   </div>
                 )}
               </div>
            </div>

            {/* Available Courses Section */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-gray-50 dark:border-slate-800">
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold text-primary dark:text-white">Available Courses</h3>
                 <button className="text-xs font-bold text-accent hover:underline uppercase tracking-widest">Browse Catalog</button>
               </div>

               <div className="space-y-6">
                 {loading ? (
                   [1, 2].map(i => <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-2xl"></div>)
                 ) : availableCourses.length > 0 ? (
                    availableCourses.map((course: any, i) => {
                      const isEnrolled = enrollments.some(e => e.Program?.Courses?.some((c: any) => c.id === course.id));
                      return (
                      <div key={course.id} className="group flex flex-col sm:flex-row items-center bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-4 rounded-2xl hover:shadow-md transition-all">
                        <div className="flex-1 text-center sm:text-left sm:pr-4">
                           <h4 className="font-bold text-primary dark:text-white">{course.title_en}</h4>
                           <p className="text-xs text-gray-500 mt-1 line-clamp-2">{course.description_en || 'No description available.'}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">{course.credits || 3} Credits</p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                           {isEnrolled ? (
                              <button disabled className="px-6 py-2.5 bg-gray-100 text-gray-400 font-bold text-sm rounded-xl cursor-not-allowed">
                                 Enrolled
                              </button>
                           ) : (
                              <button 
                                onClick={() => handleEnroll(course.id)}
                                disabled={enrollingId === course.id}
                                className="px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-accent transition-colors flex items-center"
                              >
                                {enrollingId === course.id ? 'Processing...' : (
                                  <>
                                    <PlusCircle size={16} className="mr-2" /> Enroll
                                  </>
                                )}
                              </button>
                           )}
                        </div>
                      </div>
                    )})
                 ) : (
                   <p className="text-gray-500 text-center">No available courses at the moment.</p>
                 )}
               </div>
            </div>
          </div>

          {/* Sidebar Content (Right 1/3) */}
          <div className="space-y-8">
            
            {/* Quick Actions */}
            <div className="bg-primary p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-xl font-bold mb-2">Academic Support</h3>
                 <p className="text-primary-foreground/70 text-sm mb-6 leading-relaxed">Need help with your courses or registration? Our mentors are online.</p>
                 <button className="w-full py-4 bg-accent text-primary font-bold rounded-2xl hover:bg-white transition-all shadow-lg flex items-center justify-center">
                    <MessageSquare size={18} className="mr-2" /> Live Chat Support
                 </button>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl"></div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-gray-50 dark:border-slate-800">
               <h3 className="text-lg font-bold text-primary dark:text-white mb-6">Upcoming Events</h3>
               <div className="space-y-6">
                 {[
                   { date: 'Jul 28', event: 'Webinar: Future of AI', type: 'Live' },
                   { date: 'Aug 05', event: 'Summer Exams Begin', type: 'Academic' },
                   { date: 'Aug 12', event: 'Alumni Networking', type: 'Social' }
                 ].map((ev, i) => (
                    <div key={i} className="flex items-start space-x-4">
                       <div className="flex-shrink-0 w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-xl flex flex-col items-center justify-center border border-gray-100">
                          <span className="text-[10px] font-black text-primary uppercase leading-none">{ev.date.split(' ')[0]}</span>
                          <span className="text-sm font-bold text-primary">{ev.date.split(' ')[1]}</span>
                       </div>
                       <div>
                          <p className="text-sm font-bold text-primary dark:text-white">{ev.event}</p>
                          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{ev.type}</span>
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

function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
