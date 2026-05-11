'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Building2, 
  GraduationCap, 
  Edit,
  Trash2,
  Box,
  X,
  PlusCircle,
  FolderTree,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';
import Modal from '@/components/Modal';

export default function AdminAcademicPage() {
  const { showNotification } = useNotification();
  const [faculties, setFaculties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Faculty State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<any>(null);
  const [facultyName, setFacultyName] = useState('');
  const [facultyDesc, setFacultyDesc] = useState('');
  
  // Department State
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [deptName, setDeptName] = useState('');
  const [deptDesc, setDeptDesc] = useState('');
  const [deptHod, setDeptHod] = useState('');
  const [targetFacultyId, setTargetFacultyId] = useState('');

  // Program State
  const [isProgModalOpen, setIsProgModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState<any>(null);
  const [progName, setProgName] = useState('');
  const [progDesc, setProgDesc] = useState('');
  const [targetDeptId, setTargetDeptId] = useState('');

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const res = await api.get('/academic/faculties');
      setFaculties(res.data);
    } catch (err) {
      showNotification('Failed to load academic structure', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Faculty Handlers
  const handleSaveFaculty = async () => {
    try {
      if (editingFaculty) {
        await api.put(`/academic/faculties/${editingFaculty.id}`, { name: facultyName, description: facultyDesc });
        showNotification('Faculty updated successfully', 'success');
      } else {
        await api.post('/academic/faculties', { name: facultyName, description: facultyDesc });
        showNotification('Faculty created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchFaculties();
    } catch (err) {
      showNotification('Failed to save faculty', 'error');
    }
  };

  const handleDeleteFaculty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this faculty? All associated departments will be affected.')) return;
    try {
      await api.delete(`/academic/faculties/${id}`);
      showNotification('Faculty deleted', 'success');
      fetchFaculties();
    } catch (err) {
      showNotification('Failed to delete faculty', 'error');
    }
  };

  // Department Handlers
  const handleSaveDepartment = async () => {
    try {
      const payload = { name: deptName, description: deptDesc, head_of_department: deptHod, faculty_id: targetFacultyId };
      if (editingDept) {
        await api.put(`/academic/departments/${editingDept.id}`, payload);
        showNotification('Department updated', 'success');
      } else {
        await api.post('/academic/departments', payload);
        showNotification('Department created', 'success');
      }
      setIsDeptModalOpen(false);
      fetchFaculties();
    } catch (err) {
      showNotification('Failed to save department', 'error');
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm('Delete this department? All programs will be orphaned.')) return;
    try {
      await api.delete(`/academic/departments/${id}`);
      showNotification('Department removed', 'success');
      fetchFaculties();
    } catch (err) {
      showNotification('Failed to remove department', 'error');
    }
  };

  // Program Handlers
  const handleSaveProgram = async () => {
    try {
      const payload = { name: progName, description: progDesc, department_id: targetDeptId };
      if (editingProg) {
        await api.put(`/academic/programs/${editingProg.id}`, payload);
        showNotification('Program updated', 'success');
      } else {
        await api.post('/academic/programs', payload);
        showNotification('Program created', 'success');
      }
      setIsProgModalOpen(false);
      fetchFaculties();
    } catch (err) {
      showNotification('Failed to save program', 'error');
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm('Delete this academic program?')) return;
    try {
      await api.delete(`/academic/programs/${id}`);
      showNotification('Program removed', 'success');
      fetchFaculties();
    } catch (err) {
      showNotification('Failed to remove program', 'error');
    }
  };

  const stats = [
    { label: 'Faculties', count: faculties.length.toString().padStart(2, '0'), icon: Building2 },
    { label: 'Departments', count: faculties.reduce((acc, f) => acc + (f.Departments?.length || 0), 0).toString().padStart(2, '0'), icon: Box },
    { label: 'Degree Levels', count: '03', icon: ShieldCheck },
    { label: 'Active Programs', count: faculties.reduce((acc, f) => acc + (f.Departments?.reduce((dAcc: any, d: any) => dAcc + (d.Programs?.length || 0), 0) || 0), 0).toString().padStart(2, '0'), icon: GraduationCap }
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Faculty Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingFaculty ? 'Edit Faculty' : 'Create Faculty'}>
         <div className="p-10 space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Faculty Name</label>
               <input value={facultyName} onChange={e => setFacultyName(e.target.value)} type="text" className="w-full h-16 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold" placeholder="e.g. Faculty of Engineering" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Description</label>
               <textarea value={facultyDesc} onChange={e => setFacultyDesc(e.target.value)} className="w-full h-32 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl p-6 font-bold" placeholder="Brief faculty overview..." />
            </div>
            <Button onClick={handleSaveFaculty} className="w-full h-16 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-primary/20">Save Institutional Unit</Button>
         </div>
      </Modal>

      {/* Department Modal */}
      <Modal isOpen={isDeptModalOpen} onClose={() => setIsDeptModalOpen(false)} title={editingDept ? 'Edit Department' : 'Create Department'}>
         <div className="p-10 space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Department Name</label>
               <input value={deptName} onChange={e => setDeptName(e.target.value)} type="text" className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold" placeholder="e.g. Infrastructure Management" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Head of Department (HOD)</label>
               <input value={deptHod} onChange={e => setDeptHod(e.target.value)} type="text" className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold" placeholder="e.g. Dr. John Smith" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Dept Overview</label>
               <textarea value={deptDesc} onChange={e => setDeptDesc(e.target.value)} className="w-full h-24 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl p-6 font-bold text-sm" placeholder="Define departmental modules..." />
            </div>
            <Button onClick={handleSaveDepartment} className="w-full h-16 bg-accent text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-accent/20">Sync Academic Unit</Button>
         </div>
      </Modal>

      {/* Program Modal */}
      <Modal isOpen={isProgModalOpen} onClose={() => setIsProgModalOpen(false)} title={editingProg ? 'Edit Program' : 'Issue New Program'}>
         <div className="p-10 space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Program / Degree Title</label>
               <input value={progName} onChange={e => setProgName(e.target.value)} type="text" className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold" placeholder="e.g. BSc. Sustainable Infrastructure" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Program Overview</label>
               <textarea value={progDesc} onChange={e => setProgDesc(e.target.value)} className="w-full h-32 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl p-6 font-bold text-sm" placeholder="Curriculum summary..." />
            </div>
            <Button onClick={handleSaveProgram} className="w-full h-16 bg-emerald-500 text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-emerald-500/20">Authorize Program</Button>
         </div>
      </Modal>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black text-primary dark:text-white tracking-tight">Academic <span className="text-accent italic">Infrastructure</span></h1>
          <p className="text-gray-500 mt-2 font-medium">Architecting the organizational structure of Afera Innov Academy.</p>
        </motion.div>
        <Button onClick={() => { setEditingFaculty(null); setFacultyName(''); setFacultyDesc(''); setIsModalOpen(true); }} className="bg-primary text-white rounded-[24px] px-8 h-16 font-bold shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
           <Plus size={20} className="mr-3" /> Create New Faculty
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[36px] shadow-sm border border-gray-50 dark:border-slate-800 group hover:shadow-xl transition-all">
               <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/5 rounded-[18px] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                     <stat.icon size={22} />
                  </div>
                  <p className="text-3xl font-black text-primary dark:text-white">{stat.count}</p>
               </div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
         ))}
      </div>

      {/* Main Hierarchy View */}
      <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-gray-50 dark:border-slate-800 shadow-sm overflow-hidden">
         <div className="p-10 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between bg-gray-50/30">
            <h3 className="text-xl font-black text-primary dark:text-white tracking-tight">Institutional Hierarchy</h3>
            <div className="relative w-64">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <input type="text" placeholder="Search structure..." className="w-full pl-11 pr-4 h-12 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none" />
            </div>
         </div>

         <div className="p-10 space-y-8">
            {loading ? (
              <div className="text-center py-20 font-black text-gray-400 uppercase tracking-widest animate-pulse">Syncing Hierarchy...</div>
            ) : faculties.map((faculty) => (
              <div key={faculty.id} className="border border-gray-100 dark:border-slate-800 rounded-[40px] overflow-hidden bg-white dark:bg-slate-900/50">
                 <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                       <div className="w-16 h-16 bg-primary text-white rounded-[24px] flex items-center justify-center shadow-xl">
                          <Building2 size={28} />
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-primary dark:text-white tracking-tight">{faculty.name}</h4>
                          <div className="flex items-center space-x-6 mt-1.5">
                             <span className="text-xs text-gray-400 font-bold flex items-center"><Box size={14} className="mr-2 text-accent" /> {faculty.Departments?.length || 0} Departments</span>
                             <span className="text-xs text-gray-400 font-bold flex items-center"><GraduationCap size={14} className="mr-2 text-primary" /> {faculty.Departments?.reduce((acc: any, d: any) => acc + (d.Programs?.length || 0), 0) || 0} Programs</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center space-x-3">
                       <Button onClick={() => { setEditingFaculty(faculty); setFacultyName(faculty.name); setFacultyDesc(faculty.description || ''); setIsModalOpen(true); }} variant="ghost" className="w-12 h-12 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-2xl text-gray-400 hover:text-primary"><Edit size={20} /></Button>
                       <Button onClick={() => handleDeleteFaculty(faculty.id)} variant="ghost" className="w-12 h-12 hover:bg-red-50 text-red-400 rounded-2xl"><Trash2 size={20} /></Button>
                       <Button onClick={() => { setTargetFacultyId(faculty.id); setEditingDept(null); setDeptName(''); setDeptDesc(''); setDeptHod(''); setIsDeptModalOpen(true); }} className="bg-primary text-white rounded-[18px] text-[10px] font-black uppercase tracking-widest px-6 h-12 ml-4">
                          Add Dept
                       </Button>
                    </div>
                 </div>
                 
                 <div className="px-12 pb-10 space-y-6 pt-4 bg-gray-50/30 dark:bg-slate-800/20">
                    {faculty.Departments?.map((dept: any) => (
                      <div key={dept.id} className="space-y-4">
                         <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-gray-50 dark:border-slate-800 group/dept">
                            <div className="flex items-center space-x-4">
                               <div className="w-2 h-2 bg-accent rounded-full"></div>
                               <div>
                                  <div className="flex items-center space-x-3">
                                     <span className="text-sm font-black text-primary dark:text-white uppercase tracking-tight">{dept.name}</span>
                                     <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-widest">Active unit</span>
                                  </div>
                                  <p className="text-[10px] text-gray-400 font-medium mt-1">HOD: <span className="text-gray-600 dark:text-gray-300 font-bold">{dept.head_of_department || 'Unassigned'}</span></p>
                               </div>
                            </div>
                            <div className="flex items-center space-x-2">
                               <Button onClick={() => { setTargetDeptId(dept.id); setEditingProg(null); setProgName(''); setProgDesc(''); setIsProgModalOpen(true); }} className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest px-4 h-9 transition-all">
                                  Add Program
                               </Button>
                               <button onClick={() => { setEditingDept(dept); setDeptName(dept.name); setDeptDesc(dept.description || ''); setDeptHod(dept.head_of_department || ''); setTargetFacultyId(faculty.id); setIsDeptModalOpen(true); }} className="p-2 text-gray-400 hover:text-primary"><Edit size={16} /></button>
                               <button onClick={() => handleDeleteDepartment(dept.id)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                            </div>
                         </div>
                         
                         {/* Programs Sub-list */}
                         <div className="ml-12 space-y-3">
                            {dept.Programs?.map((prog: any) => (
                              <div key={prog.id} className="flex items-center justify-between bg-white/50 dark:bg-slate-950/30 p-4 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                                 <div className="flex items-center space-x-3">
                                    <Bookmark size={14} className="text-emerald-500" />
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{prog.name}</span>
                                 </div>
                                 <div className="flex items-center space-x-1">
                                    <button onClick={() => { setEditingProg(prog); setProgName(prog.name); setProgDesc(prog.description || ''); setTargetDeptId(dept.id); setIsProgModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-primary"><Edit size={14} /></button>
                                    <button onClick={() => handleDeleteProgram(prog.id)} className="p-1.5 text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Info Card */}
      <div className="bg-primary rounded-[48px] p-12 text-white relative overflow-hidden">
         <div className="relative z-10 max-w-2xl">
            <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center mb-8">
               <FolderTree size={32} />
            </div>
            <h4 className="text-3xl font-black mb-6 tracking-tight">Institutional Architecture</h4>
            <p className="text-white/70 leading-relaxed text-lg font-medium">
               The infrastructure management system allows for high-granularity control over the university's organizational scale. 
               Define faculties, establish departments, and link programs to build a robust reporting hierarchy.
            </p>
         </div>
      </div>
    </div>
  );
}
