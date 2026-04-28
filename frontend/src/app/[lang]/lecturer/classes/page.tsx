'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  Save,
  Loader2,
  ArrowLeft,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function LecturerClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>({}); // { studentId: 'present' | 'absent' }
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get('/lecturer/classes');
      setClasses(res.data);
    } catch (err) {
      showNotification('Failed to load classes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClass = async (c: any) => {
    setSelectedClass(c);
    setFetchingStudents(true);
    try {
      const res = await api.get(`/lecturer/classes/${c.id}/students`);
      setStudents(res.data);
      // Initialize attendance
      const initialAttendance: any = {};
      res.data.forEach((s: any) => initialAttendance[s.id] = 'present');
      setAttendance(initialAttendance);
    } catch (err) {
      showNotification('Failed to load students', 'error');
    } finally {
      setFetchingStudents(false);
    }
  };

  const handleMarkAttendance = async () => {
    setMarking(true);
    try {
      const records = Object.keys(attendance).map(studentId => ({
        student_id: studentId,
        status: attendance[studentId]
      }));
      await api.post('/lecturer/attendance', {
        class_id: selectedClass.id,
        date: new Date().toISOString().split('T')[0],
        records
      });
      showNotification('Attendance marked successfully!', 'success');
      setSelectedClass(null);
    } catch (err) {
      showNotification('Failed to mark attendance', 'error');
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <div>Loading Classes...</div>;

  return (
    <div className="space-y-10">
      <AnimatePresence mode="wait">
        {!selectedClass ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl font-black text-primary dark:text-white tracking-tight">Assigned <span className="text-accent italic">Classes</span></h1>
              <p className="text-gray-500 mt-2 font-medium">Select a class to manage students, attendance, and coursework.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {classes.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => handleSelectClass(c)}
                  className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="p-10 bg-primary/5 border-b border-primary/10 flex items-center space-x-6 group-hover:bg-primary transition-all">
                    <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-primary group-hover:text-primary shadow-sm font-black text-xl uppercase">
                      {c.CourseUnit?.name?.[0] || 'U'}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary dark:text-white group-hover:text-white">{c.CourseUnit?.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 group-hover:text-white/60">{c.class_name}</p>
                    </div>
                  </div>
                  <div className="p-10 space-y-6">
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Students</span>
                       <span className="font-black text-primary dark:text-white">Active</span>
                    </div>
                    <div className="flex -space-x-3 overflow-hidden">
                       {[1, 2, 3, 4].map(i => (
                         <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">ST</div>
                       ))}
                       <div className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-primary text-white text-[10px] font-bold">+12</div>
                    </div>
                    <Button className="w-full h-12 bg-gray-50 dark:bg-slate-800 text-primary dark:text-white hover:bg-primary hover:text-white transition-all rounded-2xl font-bold uppercase tracking-widest text-[10px]">
                       Manage Class
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="flex items-center space-x-4">
               <button onClick={() => setSelectedClass(null)} className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all">
                  <ArrowLeft size={20} />
               </button>
               <div>
                 <h2 className="text-2xl font-black text-primary dark:text-white">{selectedClass.CourseUnit?.name}</h2>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{selectedClass.class_name}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               {/* Student Attendance List */}
               <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-10">
                     <h3 className="text-xl font-bold text-primary dark:text-white">Mark Attendance <span className="text-gray-400 font-normal ml-2">({new Date().toLocaleDateString()})</span></h3>
                     <div className="flex space-x-2">
                        <Button 
                          onClick={() => {
                            const allPresent: any = {};
                            students.forEach(s => allPresent[s.id] = 'present');
                            setAttendance(allPresent);
                          }}
                          className="h-10 px-4 text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 rounded-xl"
                        >
                           All Present
                        </Button>
                     </div>
                  </div>

                  <div className="space-y-4">
                     {fetchingStudents ? (
                       <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
                     ) : students.map((s) => (
                       <div key={s.id} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-800 rounded-3xl transition-all">
                          <div className="flex items-center space-x-4">
                             <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-primary font-black uppercase shadow-sm">
                                {s.User?.first_name?.[0]}{s.User?.last_name?.[0]}
                             </div>
                             <div>
                                <p className="font-bold text-primary dark:text-white">{s.User?.first_name} {s.User?.last_name}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.admission_number}</p>
                             </div>
                          </div>
                          <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                             <button 
                               onClick={() => setAttendance({...attendance, [s.id]: 'present'})}
                               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                 attendance[s.id] === 'present' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'
                               }`}
                             >
                                Present
                             </button>
                             <button 
                               onClick={() => setAttendance({...attendance, [s.id]: 'absent'})}
                               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                 attendance[s.id] === 'absent' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'
                               }`}
                             >
                                Absent
                             </button>
                          </div>
                       </div>
                     ))}
                  </div>

                  <div className="mt-10 pt-10 border-t border-gray-50 dark:border-slate-800">
                     <Button 
                       onClick={handleMarkAttendance}
                       disabled={marking || students.length === 0}
                       className="w-full h-16 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                     >
                        {marking ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                        Submit Attendance Records
                     </Button>
                  </div>
               </div>

               {/* Unit Resources / Actions */}
               <div className="lg:col-span-4 space-y-8">
                  <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
                     <h3 className="text-xl font-bold text-primary dark:text-white mb-8">Unit Resources</h3>
                     <div className="space-y-4">
                        <Button className="w-full h-14 justify-start bg-gray-50 dark:bg-slate-800 text-primary dark:text-white rounded-2xl font-bold px-6 border-none hover:bg-primary hover:text-white group">
                           <BookOpen className="mr-4 text-gray-400 group-hover:text-white" size={20} />
                           Upload Lecture Notes
                        </Button>
                        <Button className="w-full h-14 justify-start bg-gray-50 dark:bg-slate-800 text-primary dark:text-white rounded-2xl font-bold px-6 border-none hover:bg-primary hover:text-white group">
                           <GraduationCap className="mr-4 text-gray-400 group-hover:text-white" size={20} />
                           Manage Assessments
                        </Button>
                     </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/10 p-10 rounded-[40px] border border-amber-100 dark:border-amber-900/20">
                     <h3 className="text-lg font-black text-amber-800 dark:text-amber-200 mb-4">Class Performance</h3>
                     <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">
                           <span>Avg. Attendance</span>
                           <span>92%</span>
                        </div>
                        <div className="w-full h-3 bg-amber-200/50 rounded-full overflow-hidden">
                           <div className="w-[92%] h-full bg-amber-500 rounded-full"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
