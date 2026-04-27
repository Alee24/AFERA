'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar,
  BookOpen,
  MapPin,
  ChevronRight,
  UserPlus,
  Download,
  GraduationCap,
  X,
  PlusCircle,
  Save,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/lib/NotificationContext';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isGradesModalOpen, setIsGradesModalOpen] = useState(false);
  const [academicStructure, setAcademicStructure] = useState<any[]>([]);
  const [currentGrades, setCurrentGrades] = useState<any[]>([]);
  const [submittingGrade, setSubmittingGrade] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // In our system, students are users with the student role and a student profile
      const res = await api.get('/users');
      const studentUsers = res.data.filter((u: any) => u.role === 'student');
      setStudents(studentUsers);
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to load student directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAcademicStructure = async () => {
    try {
      const res = await api.get('/academic/structure');
      setAcademicStructure(res.data);
    } catch (err) {
      showNotification('Failed to load academic structure', 'error');
    }
  };

  const handleManageGrades = async (student: any) => {
    setSelectedStudent(student);
    setIsGradesModalOpen(true);
    if (academicStructure.length === 0) fetchAcademicStructure();
    
    try {
      const res = await api.get(`/academic/students/${student.StudentProfile.id}/grades`);
      setCurrentGrades(res.data);
    } catch (err) {
      showNotification('Failed to load student grades', 'error');
    }
  };

  const handleUpdateGrade = async (assessmentId: string, score: string, grade: string, remarks: string) => {
    if (!selectedStudent) return;
    setSubmittingGrade(true);
    try {
      await api.post('/academic/grades', {
        student_id: selectedStudent.StudentProfile.id,
        assessment_id: assessmentId,
        score,
        grade,
        remarks
      });
      showNotification('Grade updated successfully', 'success');
      // Refresh grades
      const res = await api.get(`/academic/students/${selectedStudent.StudentProfile.id}/grades`);
      setCurrentGrades(res.data);
    } catch (err) {
      showNotification('Failed to update grade', 'error');
    } finally {
      setSubmittingGrade(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">Student Directory</h1>
          <p className="text-gray-500 mt-2 font-medium">Managing 248 active scholars across 12 African nations.</p>
        </div>
        <div className="flex items-center space-x-3">
           <Button variant="outline" className="rounded-2xl border-gray-100 bg-white shadow-sm px-6">
              <Download size={18} className="mr-2" /> Export CSV
           </Button>
           <Button className="bg-primary text-white rounded-2xl px-8 shadow-lg shadow-primary/20">
              <UserPlus size={18} className="mr-2" /> Enroll New Student
           </Button>
        </div>
      </div>

      {/* Advanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { label: 'Active Scholars', value: students.length, icon: GraduationCap, color: 'text-primary' },
           { label: 'Online Learners', value: '184', icon: BookOpen, color: 'text-accent' },
           { label: 'Pending Graduation', value: '12', icon: Calendar, color: 'text-emerald-500' }
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-sm flex items-center space-x-6">
              <div className="w-14 h-14 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                 <stat.icon size={26} className={stat.color} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                 <p className="text-2xl font-bold text-primary dark:text-white">{stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      {/* Directory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search scholars by name, ID or email..." 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10"
              />
           </div>
           <div className="flex items-center space-x-3">
              <Button variant="outline" className="rounded-xl border-gray-50 px-5">
                 <Filter size={18} className="mr-2" /> Filter
              </Button>
              <select className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm px-4 py-2.5 focus:ring-2 focus:ring-primary/10">
                 <option>All Programs</option>
                 <option>Master's Degree</option>
                 <option>Professional Cert</option>
              </select>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-10 py-6">Student Information</th>
                    <th className="px-10 py-6">Academic Program</th>
                    <th className="px-10 py-6">Admission No.</th>
                    <th className="px-10 py-6">Nationality</th>
                    <th className="px-10 py-6 text-right">Profile</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                 {loading ? (
                   <tr><td colSpan={5} className="text-center py-24 animate-pulse font-bold text-gray-400 uppercase tracking-widest">Accessing Student Records...</td></tr>
                 ) : students.length === 0 ? (
                   <tr><td colSpan={5} className="text-center py-24 text-gray-400">No students enrolled yet.</td></tr>
                 ) : students.map((student) => (
                   <tr key={student.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-10 py-6">
                         <div className="flex items-center space-x-4">
                            <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-sm">
                               {student.first_name?.[0]}{student.last_name?.[0]}
                            </div>
                            <div>
                               <p className="font-bold text-primary dark:text-white">{student.first_name} {student.last_name}</p>
                               <p className="text-xs text-gray-400 mt-0.5">{student.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-6">
                         <div className="flex flex-col">
                            <span className="text-sm font-bold text-primary dark:text-white line-clamp-1">
                               {student.StudentProfile?.Enrollments?.[0]?.Program?.name || 'Program Not Assigned'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Cohort 2026</span>
                         </div>
                      </td>
                      <td className="px-10 py-6">
                         <span className="text-xs font-mono font-bold text-primary dark:text-white bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700">
                            {student.StudentProfile?.admission_number || 'Pending'}
                         </span>
                      </td>
                      <td className="px-10 py-6">
                         <div className="flex items-center text-gray-500 text-sm font-medium">
                            <MapPin size={14} className="mr-2 text-accent" />
                            {student.StudentProfile?.nationality || 'Not Specified'}
                         </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                         <button 
                           onClick={() => handleManageGrades(student)}
                           className="p-3 bg-gray-50 text-gray-400 hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm group/btn"
                         >
                            <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                         </button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* Advanced Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
         <div className="bg-accent rounded-[40px] p-10 text-white flex items-center justify-between group overflow-hidden relative">
            <div className="relative z-10">
               <h4 className="text-xl font-bold mb-2">Mass Communication</h4>
               <p className="text-white/70 text-sm max-w-xs mb-6">Broadcast emails or notifications to specific program cohorts.</p>
               <Button className="bg-white text-accent hover:bg-gray-100 rounded-2xl px-8">Compose Message</Button>
            </div>
            <Mail size={160} className="absolute -right-10 -bottom-10 text-white/10 group-hover:scale-110 transition-transform duration-700" />
         </div>

         <div className="bg-emerald-600 rounded-[40px] p-10 text-white flex items-center justify-between group overflow-hidden relative">
            <div className="relative z-10">
               <h4 className="text-xl font-bold mb-2">Graduation Audit</h4>
               <p className="text-white/70 text-sm max-w-xs mb-6">Review academic credits and finalize graduation eligibility.</p>
               <Button className="bg-white text-emerald-600 hover:bg-gray-100 rounded-2xl px-8">Start Audit</Button>
            </div>
            <GraduationCap size={160} className="absolute -right-10 -bottom-10 text-white/10 group-hover:scale-110 transition-transform duration-700" />
         </div>
      </div>

      {/* Grades Management Modal */}
      <AnimatePresence>
        {isGradesModalOpen && selectedStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[90vh] rounded-[48px] shadow-2xl overflow-hidden border border-white/20 flex flex-col"
            >
               <div className="p-10 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/30">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-primary text-white rounded-[24px] flex items-center justify-center font-black text-xl">
                      {selectedStudent.first_name[0]}{selectedStudent.last_name[0]}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-primary dark:text-white leading-tight">Manage Academic Grades</h3>
                      <p className="text-gray-500 font-medium">{selectedStudent.first_name} {selectedStudent.last_name} • {selectedStudent.StudentProfile?.admission_number}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsGradesModalOpen(false)} 
                    className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm"
                  >
                    <X size={24} />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-10 space-y-10">
                  {/* Academic Structure Explorer */}
                  {academicStructure.map((program) => (
                    <div key={program.id} className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-px flex-1 bg-gray-100 dark:bg-slate-800"></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{program.name}</span>
                        <div className="h-px flex-1 bg-gray-100 dark:bg-slate-800"></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {program.Courses?.map((course: any) => (
                          course.CourseUnits?.map((unit: any) => (
                            unit.Classes?.map((cls: any) => (
                              <div key={cls.id} className="bg-gray-50/50 dark:bg-slate-800/30 rounded-[32px] p-8 border border-gray-100 dark:border-slate-800 group hover:border-primary/20 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                  <div>
                                    <h5 className="font-bold text-primary dark:text-white leading-snug">{unit.name}</h5>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{course.course_code} • Sem {unit.semester}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] font-black text-accent uppercase tracking-widest">{cls.academic_year}</span>
                                  </div>
                                </div>

                                {/* Grade Input Form */}
                                <GradeEntryForm 
                                  classId={cls.id}
                                  studentId={selectedStudent.StudentProfile.id}
                                  existingGrades={currentGrades}
                                  onSave={handleUpdateGrade}
                                  submitting={submittingGrade}
                                />
                              </div>
                            ))
                          ))
                        ))}
                      </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Sub-component for Grade Entry
function GradeEntryForm({ classId, studentId, existingGrades, onSave, submitting }: any) {
  const [score, setScore] = useState('');
  const [grade, setGrade] = useState('');
  const [remarks, setRemarks] = useState('');
  const [activeAssessment, setActiveAssessment] = useState<any>(null);
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    fetchAssessments();
  }, [classId]);

  const fetchAssessments = async () => {
    try {
      const res = await api.get(`/academic/classes/${classId}/assessments`);
      setAssessments(res.data);
      if (res.data.length > 0) {
        setActiveAssessment(res.data[0]);
        // Find existing grade
        const existing = existingGrades.find((g: any) => g.assessment_id === res.data[0].id);
        if (existing) {
          setScore(existing.score);
          setGrade(existing.grade);
          setRemarks(existing.remarks || '');
        }
      }
    } catch (err) {}
  };

  const handleAutoGrade = (val: string) => {
    const s = parseFloat(val);
    setScore(val);
    if (s >= 70) setGrade('A');
    else if (s >= 60) setGrade('B');
    else if (s >= 50) setGrade('C');
    else if (s >= 40) setGrade('D');
    else setGrade('E');
  };

  return (
    <div className="space-y-4">
      {assessments.length === 0 ? (
        <Button 
          variant="outline" 
          className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest"
          onClick={async () => {
            const res = await api.post('/academic/assessments', { 
              class_id: classId, 
              type: 'Exam', 
              total_marks: 100 
            });
            setAssessments([res.data]);
            setActiveAssessment(res.data);
          }}
        >
          <PlusCircle size={14} className="mr-2" /> Create Exam Assessment
        </Button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Mark (%)</label>
            <input 
              type="number" 
              value={score} 
              onChange={e => handleAutoGrade(e.target.value)}
              className="w-full h-12 bg-white dark:bg-slate-800 border-none rounded-xl px-4 font-bold text-sm"
              placeholder="0-100"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Grade</label>
            <input 
              type="text" 
              value={grade} 
              onChange={e => setGrade(e.target.value)}
              className="w-full h-12 bg-white dark:bg-slate-800 border-none rounded-xl px-4 font-bold text-sm text-center"
              placeholder="A, B, C..."
            />
          </div>
          <div className="col-span-2 space-y-1.5">
             <input 
              type="text" 
              value={remarks} 
              onChange={e => setRemarks(e.target.value)}
              className="w-full h-12 bg-white dark:bg-slate-800 border-none rounded-xl px-4 text-xs font-medium"
              placeholder="Add lecturer remarks..."
            />
          </div>
          <Button 
            disabled={submitting}
            onClick={() => onSave(activeAssessment.id, score, grade, remarks)}
            className="col-span-2 h-12 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-[10px]"
          >
            {submitting ? <Loader2 className="animate-spin" size={16} /> : <><Save size={14} className="mr-2" /> Update Result</>}
          </Button>
        </div>
      )}
    </div>
  );
}
