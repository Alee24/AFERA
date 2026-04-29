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
  CheckSquare
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function LecturerAttendance() {
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
      showNotification('Failed to load assigned classes', 'error');
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
      showNotification('Failed to load students for this class', 'error');
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

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-gray-400 animate-pulse">Syncing class records...</div>;

  return (
    <div className="space-y-10">
      <AnimatePresence mode="wait">
        {!selectedClass ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl font-black text-primary dark:text-white tracking-tight">Class <span className="text-accent italic">Attendance</span></h1>
              <p className="text-gray-500 mt-2 font-medium">Select a class to log daily attendance for your active units.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {classes.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => handleSelectClass(c)}
                  className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="p-8 bg-primary/5 border-b border-primary/10 flex items-center space-x-6 group-hover:bg-primary transition-all">
                    <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-primary group-hover:text-primary shadow-sm font-black text-lg">
                      {c.CourseUnit?.name?.[0] || 'U'}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary dark:text-white group-hover:text-white">{c.CourseUnit?.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 group-hover:text-white/60">{c.class_name}</p>
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <Button className="w-full h-12 bg-gray-50 dark:bg-slate-800 text-primary dark:text-white hover:bg-primary hover:text-white transition-all rounded-2xl font-bold uppercase tracking-widest text-[10px]">
                       <CheckSquare size={16} className="mr-2" /> Log Attendance
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
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

            <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-bold text-primary dark:text-white">Mark Attendance <span className="text-gray-400 font-normal ml-2">({new Date().toLocaleDateString()})</span></h3>
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

               <div className="space-y-4">
                  {fetchingStudents ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
                  ) : students.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 font-medium italic">No students assigned to this class.</p>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
