'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  BookOpen, 
  Clock, 
  MapPin, 
  DollarSign,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/lib/NotificationContext';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const { showNotification } = useNotification();

  // Form State
  const [formData, setFormData] = useState({
    title_en: '',
    description_en: '',
    department: '',
    duration: '',
    price: 800,
    course_type: 'Certificate',
    modality: 'Online'
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      showNotification('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentCourse) {
        await api.put(`/courses/${currentCourse.id}`, formData);
        showNotification('Course updated successfully', 'success');
      } else {
        await api.post('/courses', {
          ...formData,
          title_fr: formData.title_en,
          title_pt: formData.title_en,
          description_fr: formData.description_en,
          description_pt: formData.description_en
        });
        showNotification('Course created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Operation failed';
      showNotification(msg, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      showNotification('Course deleted', 'success');
      fetchCourses();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete course';
      showNotification(msg, 'error');
    }
  };

  const openEdit = (course: any) => {
    setCurrentCourse(course);
    setFormData({
      title_en: course.title_en,
      description_en: course.description_en,
      department: course.department,
      duration: course.duration,
      price: course.price,
      course_type: course.course_type,
      modality: course.modality
    });
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setCurrentCourse(null);
    setFormData({
      title_en: '',
      description_en: '',
      department: '',
      duration: '',
      price: 800,
      course_type: 'Certificate',
      modality: 'Online'
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">Academic Programs</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage and update your university course catalog.</p>
        </div>
        <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 py-4 flex items-center shadow-lg shadow-primary/20">
          <Plus size={20} className="mr-2" /> Add New Program
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Total Programs', value: courses.length, icon: BookOpen, color: 'text-primary' },
           { label: 'Active Applications', value: '12', icon: Filter, color: 'text-accent' },
           { label: 'Average Tuition', value: '$800', icon: DollarSign, color: 'text-emerald-500' }
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800 flex items-center space-x-6">
              <div className="w-14 h-14 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                 <stat.icon size={24} className={stat.color} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                 <p className="text-2xl font-bold text-primary dark:text-white">{stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      {/* Courses List */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
           <h3 className="font-bold text-xl text-primary dark:text-white">Live Programs</h3>
           <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search programs..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/10"
              />
           </div>
        </div>
        
        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-8 py-5">Program Title</th>
                    <th className="px-8 py-5">Department</th>
                    <th className="px-8 py-5">Type</th>
                    <th className="px-8 py-5">Duration</th>
                    <th className="px-8 py-5">Tuition</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                 {loading ? (
                   <tr><td colSpan={6} className="text-center py-20 animate-pulse text-gray-400 font-bold uppercase tracking-widest">Loading Academic Data...</td></tr>
                 ) : courses.map((course) => (
                   <tr key={course.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-8 py-6">
                         <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                               <BookOpen size={18} />
                            </div>
                            <span className="font-bold text-primary dark:text-white max-w-xs truncate">{course.title_en}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-500">{course.department}</td>
                      <td className="px-8 py-6">
                         <span className="text-[10px] font-black text-accent bg-accent/10 px-3 py-1 rounded-full uppercase">{course.course_type}</span>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-500 font-medium">{course.duration}</td>
                      <td className="px-8 py-6 font-bold text-primary dark:text-white">${Math.round(course.price)}</td>
                      <td className="px-8 py-6 text-right space-x-2">
                         <button onClick={() => openEdit(course)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg shadow-sm text-gray-400 hover:text-primary transition-all">
                            <Edit size={18} />
                         </button>
                         <button onClick={() => handleDelete(course.id)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg shadow-sm text-gray-400 hover:text-red-500 transition-all">
                            <Trash2 size={18} />
                         </button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                 <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-primary dark:text-white">
                      {currentCourse ? 'Update Program' : 'Add New Program'}
                    </h3>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-400">
                       <Plus className="rotate-45" size={24} />
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Program Title (EN)</label>
                       <input 
                         required
                         type="text" 
                         className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10" 
                         placeholder="Enter program title..."
                         value={formData.title_en}
                         onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                       />
                    </div>
                    
                    <div className="md:col-span-2">
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Description (EN)</label>
                       <textarea 
                         required
                         className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 min-h-[100px]" 
                         placeholder="Describe the program objectives..."
                         value={formData.description_en}
                         onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                       />
                    </div>

                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Department</label>
                       <input 
                         required
                         type="text" 
                         className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10" 
                         placeholder="e.g. Infrastructure"
                         value={formData.department}
                         onChange={(e) => setFormData({...formData, department: e.target.value})}
                       />
                    </div>

                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Duration</label>
                       <input 
                         required
                         type="text" 
                         className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10" 
                         placeholder="e.g. 18 Months"
                         value={formData.duration}
                         onChange={(e) => setFormData({...formData, duration: e.target.value})}
                       />
                    </div>

                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Tuition Fee (USD)</label>
                       <input 
                         required
                         type="number" 
                         className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 font-bold" 
                         value={formData.price}
                         onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                       />
                    </div>

                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Format / Modality</label>
                       <select 
                         className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10"
                         value={formData.modality}
                         onChange={(e) => setFormData({...formData, modality: e.target.value})}
                       >
                          <option>Online</option>
                          <option>In-House</option>
                          <option>Hybrid</option>
                       </select>
                    </div>
                 </div>

                 <div className="pt-4">
                    <Button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 font-bold uppercase tracking-widest text-xs">
                       {currentCourse ? 'Save Changes' : 'Create Program'}
                    </Button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
