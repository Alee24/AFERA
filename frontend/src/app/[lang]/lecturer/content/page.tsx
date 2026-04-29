'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search,
  Plus,
  Loader2,
  FileText,
  Save,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';
import { motion } from 'framer-motion';

export default function LecturerContent() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      showNotification('Failed to fetch syllabus definitions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) {
      showNotification('Please select a course first', 'error');
      return;
    }
    setSaving(true);
    try {
      await api.post(`/courses/${selectedCourse.id}/modules`, {
        title,
        content,
        order: 1
      });
      showNotification('Syllabus module created successfully!', 'success');
      setTitle('');
      setContent('');
      // Refresh course list
      fetchCourses();
      setSelectedCourse(null);
    } catch (err) {
      showNotification('Error creating module framework', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-gray-400 animate-pulse">Syncing Course Structure...</div>;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-primary dark:text-white tracking-tight">Course <span className="text-accent italic">Content</span></h1>
        <p className="text-gray-500 mt-2 font-medium">Create modular lecture notes, assessments, and reference guides.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
            <h3 className="text-xl font-bold text-primary dark:text-white mb-6">Select Program</h3>
            <div className="space-y-3">
               {courses.map((c) => (
                 <div 
                   key={c.id} 
                   onClick={() => setSelectedCourse(c)}
                   className={`p-6 rounded-3xl cursor-pointer transition-all border ${
                     selectedCourse?.id === c.id 
                       ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' 
                       : 'bg-gray-50 dark:bg-slate-800 border-transparent hover:border-gray-200 text-primary dark:text-white'
                   }`}
                 >
                    <p className="font-bold">{c.name}</p>
                    <p className={`text-[10px] uppercase font-black tracking-widest mt-1 ${selectedCourse?.id === c.id ? 'text-white/60' : 'text-gray-400'}`}>
                      Code: {c.code}
                    </p>
                 </div>
               ))}
            </div>
         </div>

         <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800">
            <h3 className="text-xl font-bold text-primary dark:text-white mb-10">
              {selectedCourse ? `Build Content for ${selectedCourse.name}` : 'New Module Framework'}
            </h3>

            <form onSubmit={handleAddModule} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Module Title</label>
                  <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Chapter 1: Computational Foundations"
                    className="w-full px-6 h-16 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    required
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Content / Handout Details</label>
                  <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe core reading assignments, resource links, and instructions..."
                    rows={8}
                    className="w-full p-6 bg-gray-50 dark:bg-slate-800 border-none rounded-3xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none resize-none"
                    required
                  />
               </div>

               <Button 
                 type="submit"
                 disabled={saving || !selectedCourse}
                 className="w-full h-16 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none transition-all"
               >
                  {saving ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" />}
                  Publish Content Module
               </Button>
            </form>
         </div>
      </div>
    </div>
  );
}
