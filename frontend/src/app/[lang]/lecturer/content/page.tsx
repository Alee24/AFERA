'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search,
  Plus,
  Loader2,
  FileText,
  Save,
  Trash2,
  Layers,
  Edit,
  Video,
  Settings,
  Puzzle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function LecturerContent() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Builder state
  const [modules, setModules] = useState<any[]>([]);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  
  // New Module form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [h5pContent, setH5pContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get('/lecturer/classes');
      setClasses(res.data.classes || res.data || []);
    } catch (err) {
      showNotification('Failed to fetch assigned classes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadModules = async (classItem: any) => {
    setSelectedClass(classItem);
    setEditMode(false);
    setLoading(true);
    try {
      // Assuming course_id is what modules attach to
      const courseId = classItem.CourseUnit?.course_id || classItem.course_id;
      if (!courseId) {
         setModules([]);
         setLoading(false);
         return;
      }
      const res = await api.get(`/courses/${courseId}`);
      setModules(res.data?.Modules || []);
    } catch (err) {
      showNotification('Failed to load course modules', 'error');
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;
    
    const courseId = selectedClass.CourseUnit?.course_id || selectedClass.course_id;
    if (!courseId) {
       showNotification('Class does not have an associated main course', 'error');
       return;
    }
    
    setSaving(true);
    try {
      const res = await api.post(`/courses/${courseId}/modules`, {
        title_en: title,
        description_en: content,
        document_url: documentUrl,
        h5p_content: h5pContent,
        video_url: videoUrl,
        order: modules.length + 1
      });
      showNotification('Module published successfully!', 'success');
      setModules([...modules, res.data]);
      setTitle('');
      setContent('');
      setDocumentUrl('');
      setH5pContent('');
      setVideoUrl('');
    } catch (err) {
      showNotification('Error creating module framework', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
     if (!confirm('Are you sure you want to delete this module?')) return;
     const courseId = selectedClass.CourseUnit?.course_id || selectedClass.course_id;
     try {
       await api.delete(`/courses/${courseId}/modules/${moduleId}`);
       setModules(modules.filter((m) => m.id !== moduleId));
       showNotification('Module deleted', 'info');
     } catch(err) {
       showNotification('Failed to delete module', 'error');
     }
  };

  if (loading && classes.length === 0) return <div className="h-screen flex items-center justify-center font-bold text-gray-400 animate-pulse">Syncing Course Structure...</div>;

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
         <div>
           <h1 className="text-4xl font-black text-primary dark:text-white tracking-tight">Course <span className="text-accent italic">Content</span></h1>
           <p className="text-gray-500 mt-2 font-medium">Create modular lecture notes, assessments, and reference guides.</p>
         </div>
         {selectedClass && (
            <Button 
               onClick={() => setEditMode(!editMode)} 
               className={`rounded-2xl px-6 h-12 font-bold uppercase tracking-widest text-xs transition-all ${
                 editMode ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-primary text-white hover:bg-primary/90'
               }`}
            >
               {editMode ? 'Turn Editing Off' : 'Turn Editing On'}
            </Button>
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Sidebar: Class Selection */}
         <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 h-fit">
            <h3 className="text-xl font-bold text-primary dark:text-white mb-6">Your Units</h3>
            <div className="space-y-3">
               {classes.map((c) => (
                 <div 
                   key={c.id} 
                   onClick={() => loadModules(c)}
                   className={`p-5 rounded-3xl cursor-pointer transition-all border ${
                     selectedClass?.id === c.id 
                       ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' 
                       : 'bg-gray-50 dark:bg-slate-800 border-transparent hover:border-gray-200 text-primary dark:text-white'
                   }`}
                 >
                    <p className="font-bold leading-tight">{c.CourseUnit?.name || `Class #${c.id}`}</p>
                    <p className={`text-[10px] uppercase font-black tracking-widest mt-2 ${selectedClass?.id === c.id ? 'text-white/60' : 'text-gray-400'}`}>
                      {c.schedule || 'Unscheduled'}
                    </p>
                 </div>
               ))}
               {classes.length === 0 && (
                 <p className="text-xs text-gray-400 italic">No classes assigned yet.</p>
               )}
            </div>
         </div>

         {/* Main Content Area */}
         <div className="lg:col-span-9 bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 min-h-[500px]">
            {!selectedClass ? (
               <div className="flex flex-col items-center justify-center h-full text-center opacity-50 py-20">
                  <BookOpen size={64} className="text-gray-300 mb-6" />
                  <h3 className="text-2xl font-bold text-primary dark:text-white">Select a unit</h3>
                  <p className="text-gray-400 mt-2">Choose a class from the left sidebar to view or edit content.</p>
               </div>
            ) : (
               <div className="space-y-10">
                  <div className="border-b border-gray-100 dark:border-slate-800 pb-6">
                     <h2 className="text-3xl font-black text-primary dark:text-white">{selectedClass.CourseUnit?.name}</h2>
                     <p className="text-sm text-gray-500 font-medium mt-2">Manage all interactive content, H5P activities, and resources below.</p>
                  </div>

                  {/* Modules Display */}
                  <div className="space-y-6">
                     {modules.length === 0 && !editMode && (
                        <div className="text-center py-20 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-3xl">
                           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No content modules available</p>
                           <Button onClick={() => setEditMode(true)} variant="outline" className="mt-4 rounded-xl">Enable Editing to Add Content</Button>
                        </div>
                     )}

                     {modules.map((mod, index) => (
                        <div key={mod.id} className="border border-gray-100 dark:border-slate-800 rounded-[32px] overflow-hidden transition-all bg-gray-50/30 dark:bg-slate-950/30">
                           <div 
                              className="p-6 md:p-8 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50"
                              onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                           >
                              <div className="flex items-center space-x-4">
                                 <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                                    <Layers size={20} />
                                 </div>
                                 <div>
                                    <span className="text-[10px] text-accent font-black uppercase tracking-widest">Topic {index + 1}</span>
                                    <h4 className="text-xl font-bold text-primary dark:text-white mt-1">{mod.title_en}</h4>
                                 </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                 {editMode && (
                                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                                       <button className="p-2 text-gray-400 hover:text-primary transition-colors"><Settings size={18} /></button>
                                       <button onClick={() => handleDeleteModule(mod.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                    </div>
                                 )}
                                 {expandedModule === mod.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                              </div>
                           </div>

                           <AnimatePresence>
                              {expandedModule === mod.id && (
                                 <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-gray-100 dark:border-slate-800 overflow-hidden"
                                 >
                                    <div className="p-6 md:p-8 bg-white dark:bg-slate-900 space-y-8">
                                       {mod.description_en && (
                                          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                                             <p>{mod.description_en}</p>
                                          </div>
                                       )}

                                       {mod.video_url && (
                                          <div className="rounded-3xl overflow-hidden aspect-video bg-black border border-gray-100 dark:border-slate-800">
                                             <iframe src={mod.video_url} className="w-full h-full" allowFullScreen></iframe>
                                          </div>
                                       )}

                                       {mod.h5p_content && (
                                          <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                                             <div className="flex items-center space-x-2 mb-4">
                                                <Puzzle className="text-accent" size={20} />
                                                <h5 className="font-bold text-primary dark:text-white">Interactive H5P Activity</h5>
                                             </div>
                                             <div className="aspect-[4/3] w-full bg-white dark:bg-slate-950 rounded-2xl overflow-hidden" dangerouslySetInnerHTML={{ __html: mod.h5p_content }} />
                                          </div>
                                       )}

                                       {mod.document_url && (
                                          <a href={mod.document_url} target="_blank" rel="noreferrer" className="flex items-center p-4 bg-primary/5 rounded-2xl text-primary hover:bg-primary/10 transition-colors w-fit">
                                             <FileText size={20} className="mr-3" />
                                             <span className="font-bold">Download Handout / Resource</span>
                                          </a>
                                       )}

                                       {editMode && (
                                          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-800">
                                             <Button variant="outline" className="rounded-xl text-xs uppercase tracking-widest font-bold"><Plus size={14} className="mr-2" /> Add Resource</Button>
                                          </div>
                                       )}
                                    </div>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                     ))}
                  </div>

                  {/* Add New Module Form (Only visible in Edit Mode) */}
                  {editMode && (
                     <div className="mt-12 bg-gray-50/50 dark:bg-slate-800/50 p-8 rounded-[40px] border border-gray-100 dark:border-slate-700">
                        <h3 className="text-xl font-bold text-primary dark:text-white mb-8 flex items-center">
                           <Plus className="mr-2 text-accent" /> Append New Content Block
                        </h3>
                        <form onSubmit={handleAddModule} className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Module Title</label>
                              <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Chapter 1: Computational Foundations"
                                className="w-full px-6 h-16 bg-white dark:bg-slate-900 border-none rounded-2xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                required
                              />
                           </div>

                           <div className="space-y-2">
                              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Content / Handout Details</label>
                              <textarea 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Describe core reading assignments, resource links, and instructions..."
                                rows={6}
                                className="w-full p-6 bg-white dark:bg-slate-900 border-none rounded-3xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none resize-none"
                                required
                              />
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Document URL</label>
                                <input 
                                  type="text"
                                  value={documentUrl}
                                  onChange={(e) => setDocumentUrl(e.target.value)}
                                  placeholder="Upload file URL..."
                                  className="w-full px-6 h-14 bg-white dark:bg-slate-900 border-none rounded-2xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                />
                             </div>

                             <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Embed Video</label>
                                <input 
                                  type="text"
                                  value={videoUrl}
                                  onChange={(e) => setVideoUrl(e.target.value)}
                                  placeholder="YouTube/Vimeo link..."
                                  className="w-full px-6 h-14 bg-white dark:bg-slate-900 border-none rounded-2xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                />
                             </div>

                             <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">H5P Embed Code</label>
                                <input 
                                  type="text"
                                  value={h5pContent}
                                  onChange={(e) => setH5pContent(e.target.value)}
                                  placeholder="<iframe>...</iframe>"
                                  className="w-full px-6 h-14 bg-white dark:bg-slate-900 border-none rounded-2xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                />
                             </div>
                           </div>

                           <Button 
                             type="submit"
                             disabled={saving}
                             className="w-full h-16 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none transition-all"
                           >
                              {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                              Publish Content Module
                           </Button>
                        </form>
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
