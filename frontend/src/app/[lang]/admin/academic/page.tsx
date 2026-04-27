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
  FolderTree
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';

export default function AdminAcademicPage() {
  const [faculties, setFaculties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<any>(null);
  const [facultyName, setFacultyName] = useState('');
  const [facultyDesc, setFacultyDesc] = useState('');
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const res = await api.get('/academic/faculties');
      setFaculties(res.data);
    } catch (err) {
      showNotification('Failed to load academic structure', 'error');
    } finally {
      setLoading(false);
    }
  };

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
      setEditingFaculty(null);
      setFacultyName('');
      setFacultyDesc('');
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

  const handleAddDepartment = async (facultyId: string) => {
    const name = prompt('Enter Department Name:');
    if (!name) return;
    try {
      await api.post('/academic/departments', { faculty_id: facultyId, name });
      showNotification('Department added', 'success');
      fetchFaculties();
    } catch (err) {
      showNotification('Failed to add department', 'error');
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm('Delete this department?')) return;
    try {
      await api.delete(`/academic/departments/${id}`);
      showNotification('Department removed', 'success');
      fetchFaculties();
    } catch (err) {
      showNotification('Failed to remove department', 'error');
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
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
               <div className="p-10">
                  <div className="flex justify-between items-center mb-8">
                     <h3 className="text-2xl font-black text-primary dark:text-white">{editingFaculty ? 'Edit' : 'Create'} Faculty</h3>
                     <button onClick={() => { setIsModalOpen(false); setEditingFaculty(null); }} className="text-gray-400 hover:text-primary"><X size={24} /></button>
                  </div>
                  <div className="space-y-6">
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
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black text-primary dark:text-white tracking-tight">Academic <span className="text-accent italic">Infrastructure</span></h1>
          <p className="text-gray-500 mt-2 font-medium">Architecting the organizational structure of Afera Innov Academy.</p>
        </motion.div>
        <Button onClick={() => { setIsModalOpen(true); setEditingFaculty(null); setFacultyName(''); setFacultyDesc(''); }} className="bg-primary text-white rounded-[24px] px-8 h-16 font-bold shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
           <Plus size={20} className="mr-3" /> Create New Faculty
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-slate-900 p-8 rounded-[36px] shadow-sm border border-gray-50 dark:border-slate-800 group hover:shadow-xl transition-all">
               <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/5 rounded-[18px] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                     <stat.icon size={22} />
                  </div>
                  <p className="text-3xl font-black text-primary dark:text-white">{stat.count}</p>
               </div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
            </motion.div>
         ))}
      </div>

      {/* Main Hierarchy View */}
      <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-gray-50 dark:border-slate-800 shadow-sm overflow-hidden">
         <div className="p-10 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between bg-gray-50/30">
            <h3 className="text-xl font-black text-primary dark:text-white tracking-tight">Institutional Hierarchy</h3>
            <div className="flex items-center space-x-3">
               <div className="relative w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="Search structure..." className="w-full pl-11 pr-4 h-12 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/5 outline-none" />
               </div>
            </div>
         </div>

         <div className="p-10 space-y-8">
            {loading ? (
              <div className="text-center py-20 font-black text-gray-400 uppercase tracking-widest animate-pulse">Syncing Hierarchy...</div>
            ) : faculties.length === 0 ? (
              <div className="text-center py-20 text-gray-400 font-medium">No faculties defined yet. Start by creating your first faculty.</div>
            ) : faculties.map((faculty) => (
              <div key={faculty.id} className="group border border-gray-100 dark:border-slate-800 rounded-[40px] overflow-hidden hover:border-primary/30 transition-all bg-white dark:bg-slate-900/50">
                 <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                       <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-700 text-white rounded-[24px] flex items-center justify-center shadow-2xl shadow-primary/20">
                          <Building2 size={28} />
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-primary dark:text-white tracking-tight">{faculty.name}</h4>
                          <div className="flex items-center space-x-6 mt-1.5">
                             <span className="text-xs text-gray-400 font-bold flex items-center tracking-wide"><Box size={14} className="mr-2 text-accent" /> {faculty.Departments?.length || 0} Departments</span>
                             <span className="text-xs text-gray-400 font-bold flex items-center tracking-wide"><GraduationCap size={14} className="mr-2 text-primary" /> Programs Available</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center space-x-3">
                       <Button onClick={() => { setIsModalOpen(true); setEditingFaculty(faculty); setFacultyName(faculty.name); setFacultyDesc(faculty.description || ''); }} variant="ghost" className="w-12 h-12 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-2xl text-gray-400 hover:text-primary"><Edit size={20} /></Button>
                       <Button onClick={() => handleDeleteFaculty(faculty.id)} variant="ghost" className="w-12 h-12 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl text-red-400"><Trash2 size={20} /></Button>
                       <div className="w-px h-8 bg-gray-100 dark:bg-slate-800 mx-2"></div>
                       <Button onClick={() => handleAddDepartment(faculty.id)} className="bg-primary text-white hover:bg-primary-600 rounded-[18px] text-[10px] font-black uppercase tracking-widest px-6 h-12 shadow-xl shadow-primary/10">
                          Add Dept
                       </Button>
                    </div>
                 </div>
                 
                 {/* Departments Sub-list */}
                 <div className="px-12 pb-10 space-y-4 pt-4 bg-gray-50/30 dark:bg-slate-800/20">
                    {faculty.Departments?.length > 0 ? (
                      faculty.Departments.map((dept: any) => (
                        <div key={dept.id} className="flex items-center space-x-4">
                           <div className="w-8 h-8 border-l-2 border-b-2 border-gray-100 dark:border-slate-700 rounded-bl-xl"></div>
                           <div className="flex-1 bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-gray-50 dark:border-slate-800 flex items-center justify-between group/dept hover:shadow-lg transition-all">
                              <div>
                                 <span className="text-sm font-bold text-primary dark:text-white">{dept.name}</span>
                                 <span className="ml-3 text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active unit</span>
                              </div>
                              <button onClick={() => handleDeleteDepartment(dept.id)} className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover/dept:opacity-100 transition-all">
                                 <Trash2 size={14} />
                              </button>
                           </div>
                        </div>
                      ))
                    ) : (
                      <p className="ml-12 text-xs text-gray-400 italic">No departments registered under this faculty.</p>
                    )}
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Info Card */}
      <div className="bg-primary rounded-[48px] p-12 text-white relative overflow-hidden group">
         <div className="relative z-10 max-w-2xl">
            <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center mb-8">
               <FolderTree size={32} />
            </div>
            <h4 className="text-3xl font-black mb-6 tracking-tight">Institutional Architecture</h4>
            <p className="text-white/70 leading-relaxed text-lg font-medium">
               The infrastructure management system allows for high-granularity control over the university's organizational scale. 
               Define faculties, establish departments, and link programs to build a robust reporting hierarchy that scales with Afera Innov Academy's vision.
            </p>
         </div>
         <PlusCircle size={300} className="absolute -right-20 -bottom-20 text-white/5 group-hover:scale-110 transition-transform duration-700" />
      </div>
    </div>
  );
}
