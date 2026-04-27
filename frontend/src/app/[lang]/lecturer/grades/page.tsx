'use client';

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Save, 
  Loader2, 
  CheckCircle2, 
  Search,
  FileText,
  ChevronRight,
  ArrowLeft,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function LecturerGrades() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [gradeInputs, setGradeInputs] = useState<any>({}); // { studentId: score }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddAssessment, setShowAddAssessment] = useState(false);
  const [newAssessment, setNewAssessment] = useState({ title: '', type: 'exam', max_score: 100 });
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
    try {
      const assessRes = await api.get(`/academic/classes/${c.id}/assessments`);
      setAssessments(assessRes.data);
      const studentRes = await api.get(`/lecturer/classes/${c.id}/students`);
      setStudents(studentRes.data);
    } catch (err) {
      showNotification('Failed to load class data', 'error');
    }
  };

  const handleSelectAssessment = (a: any) => {
    setSelectedAssessment(a);
    // Initialize grade inputs from existing grades if needed (future refinement)
    const initialGrades: any = {};
    students.forEach(s => initialGrades[s.id] = '');
    setGradeInputs(initialGrades);
  };

  const handleAddAssessment = async () => {
    try {
      const res = await api.post('/academic/assessments', {
        ...newAssessment,
        class_id: selectedClass.id
      });
      setAssessments([...assessments, res.data]);
      setShowAddAssessment(false);
      showNotification('Assessment created!', 'success');
    } catch (err) {
      showNotification('Failed to create assessment', 'error');
    }
  };

  const handleSaveGrades = async () => {
    setSaving(true);
    try {
      const gradePromises = Object.keys(gradeInputs).map(studentId => {
        if (!gradeInputs[studentId]) return null;
        return api.post('/academic/grades', {
          student_id: studentId,
          assessment_id: selectedAssessment.id,
          score: gradeInputs[studentId]
        });
      }).filter(p => p !== null);

      await Promise.all(gradePromises);
      showNotification('Grades updated successfully!', 'success');
      setSelectedAssessment(null);
    } catch (err) {
      showNotification('Failed to update grades', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-10">
      <AnimatePresence mode="wait">
        {!selectedClass ? (
          <motion.div key="classes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h1 className="text-4xl font-black text-primary dark:text-white tracking-tight">Grade <span className="text-accent italic">Management</span></h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {classes.map(c => (
                 <div key={c.id} onClick={() => handleSelectClass(c)} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 cursor-pointer hover:shadow-xl transition-all">
                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm">
                       <FileText size={20} />
                    </div>
                    <h4 className="font-bold text-primary dark:text-white">{c.CourseUnit?.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{c.class_name}</p>
                 </div>
               ))}
            </div>
          </motion.div>
        ) : !selectedAssessment ? (
          <motion.div key="assessments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-4">
                  <button onClick={() => setSelectedClass(null)} className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-sm">
                     <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-2xl font-black text-primary dark:text-white">Assessments <span className="text-gray-400 font-normal ml-2">({selectedClass.class_name})</span></h2>
               </div>
               <Button onClick={() => setShowAddAssessment(true)} className="h-12 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] px-6 shadow-lg shadow-primary/20">
                  <Plus size={18} className="mr-2" /> New Assessment
               </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {assessments.map(a => (
                 <div key={a.id} onClick={() => handleSelectAssessment(a)} className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 cursor-pointer hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-8">
                       <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl flex items-center justify-center text-emerald-500 font-black">
                          {a.type === 'exam' ? 'EX' : 'AS'}
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Active</span>
                    </div>
                    <h4 className="text-xl font-bold text-primary dark:text-white mb-2">{a.title}</h4>
                    <p className="text-xs text-gray-400 font-medium">Max Score: {a.max_score} Points</p>
                    <div className="mt-8 pt-8 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between group-hover:text-primary">
                       <span className="text-[10px] font-black uppercase tracking-widest">Enter Grades</span>
                       <ChevronRight size={18} />
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="grading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-20">
            <div className="flex items-center space-x-4">
               <button onClick={() => setSelectedAssessment(null)} className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary shadow-sm transition-all">
                  <ArrowLeft size={20} />
               </button>
               <div>
                  <h2 className="text-2xl font-black text-primary dark:text-white">{selectedAssessment.title}</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Grading Students • Max {selectedAssessment.max_score}</p>
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
               <div className="space-y-4">
                  {students.map(s => (
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
                       <div className="flex items-center space-x-4">
                          <input 
                            type="number" 
                            max={selectedAssessment.max_score}
                            value={gradeInputs[s.id]}
                            onChange={(e) => setGradeInputs({...gradeInputs, [s.id]: e.target.value})}
                            className="w-24 h-14 bg-white dark:bg-slate-900 border-none rounded-2xl px-4 text-center font-black text-xl shadow-sm focus:ring-2 focus:ring-primary/20"
                            placeholder="0"
                          />
                          <span className="text-gray-400 font-bold text-sm">/ {selectedAssessment.max_score}</span>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-10 pt-10 border-t border-gray-50 dark:border-slate-800">
                  <Button onClick={handleSaveGrades} disabled={saving} className="w-full h-16 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                     {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                     Commit Grades to Academic Record
                  </Button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Assessment Modal */}
      <AnimatePresence>
        {showAddAssessment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden">
               <div className="p-10 bg-primary text-white">
                  <h3 className="text-2xl font-black uppercase tracking-tight">New Assessment</h3>
                  <p className="text-xs font-bold text-white/60 tracking-widest uppercase mt-2">Class: {selectedClass.class_name}</p>
               </div>
               <div className="p-10 space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Assessment Title</label>
                     <input type="text" value={newAssessment.title} onChange={e => setNewAssessment({...newAssessment, title: e.target.value})} className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold" placeholder="e.g. Mid-Term Exam" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Type</label>
                        <select value={newAssessment.type} onChange={e => setNewAssessment({...newAssessment, type: e.target.value as any})} className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-4 font-bold">
                           <option value="exam">Exam</option>
                           <option value="assignment">Assignment</option>
                           <option value="quiz">Quiz</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Max Score</label>
                        <input type="number" value={newAssessment.max_score} onChange={e => setNewAssessment({...newAssessment, max_score: parseInt(e.target.value)})} className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-4 font-bold text-center" />
                     </div>
                  </div>
                  <div className="pt-6 flex space-x-4">
                     <Button onClick={() => setShowAddAssessment(false)} className="flex-1 h-14 bg-gray-100 text-gray-500 rounded-2xl font-bold uppercase tracking-widest text-[10px]">Cancel</Button>
                     <Button onClick={handleAddAssessment} className="flex-1 h-14 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">Create Assessment</Button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
