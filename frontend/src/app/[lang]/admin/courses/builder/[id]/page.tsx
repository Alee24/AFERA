'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  BookOpen, 
  Layers, 
  MonitorPlay, 
  Puzzle, 
  Edit3, 
  ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/lib/NotificationContext';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

interface Module {
  id: string;
  title_en: string;
  description_en: string;
  order: number;
}

interface H5PItem {
  id: string;
  moduleId: string;
  type: 'quiz' | 'presentation' | 'video' | 'interactive';
  embedCode: string;
  title: string;
}

export default function CourseBuilderPage() {
  const { lang, id } = useParams();
  const router = useRouter();
  const { showNotification } = useNotification();
  
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [h5pItems, setH5pItems] = useState<H5PItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Creation States
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDesc, setModuleDesc] = useState('');
  
  const [isH5pModalOpen, setIsH5pModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [h5pTitle, setH5pTitle] = useState('');
  const [h5pType, setH5pType] = useState<'quiz' | 'presentation' | 'video' | 'interactive'>('quiz');
  const [h5pEmbed, setH5pEmbed] = useState('');

  useEffect(() => {
    fetchCourseAndModules();
  }, [id]);

  const fetchCourseAndModules = async () => {
    try {
      const courseRes = await api.get(`/courses/${id}`);
      setCourse(courseRes.data);
      setModules(courseRes.data?.Modules || []);
      
      // Load dummy/stored H5P items safely
      const savedH5P = localStorage.getItem(`course_${id}_h5p`);
      if (savedH5P) {
        setH5pItems(JSON.parse(savedH5P));
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to retrieve course data';
      showNotification(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(`/courses/${id}/modules`, {
        title_en: moduleTitle,
        description_en: moduleDesc,
        order: modules.length + 1,
        duration_weeks: 4
      });
      showNotification('Module added successfully', 'success');
      setModules([...modules, res.data]);
      setIsModuleModalOpen(false);
      setModuleTitle('');
      setModuleDesc('');
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to add module', 'error');
    }
  };

  const handleAddH5P = (e: React.FormEvent) => {
    e.preventDefault();
    if (!h5pEmbed.trim() || !h5pTitle.trim()) {
      showNotification('Please fill in all H5P item fields', 'error');
      return;
    }
    
    const newItem: H5PItem = {
      id: Math.random().toString(36).substr(2, 9),
      moduleId: selectedModuleId,
      type: h5pType,
      title: h5pTitle,
      embedCode: h5pEmbed
    };

    const updated = [...h5pItems, newItem];
    setH5pItems(updated);
    localStorage.setItem(`course_${id}_h5p`, JSON.stringify(updated));
    showNotification('Interactive H5P Item attached!', 'success');
    
    setIsH5pModalOpen(false);
    setH5pTitle('');
    setH5pEmbed('');
  };

  const deleteH5PItem = (itemId: string) => {
    const updated = h5pItems.filter(item => item.id !== itemId);
    setH5pItems(updated);
    localStorage.setItem(`course_${id}_h5p`, JSON.stringify(updated));
    showNotification('H5P item removed', 'info');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
    </div>
  );

  if (!course) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 text-center">
      <h2 className="text-3xl font-black text-primary dark:text-white mb-4">Course Not Found</h2>
      <p className="text-gray-400 mb-8 font-bold uppercase tracking-widest text-xs">The studio cannot load the requested program data.</p>
      <Button onClick={() => router.push(`/${lang}/admin/courses`)} variant="primary" className="rounded-2xl">Return to Program Catalog</Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-800">
         <div className="flex items-center space-x-4">
            <button onClick={() => router.push(`/${lang}/admin/courses`)} className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary transition-all">
               <ArrowLeft size={20} />
            </button>
            <div>
               <h1 className="text-3xl font-black text-primary dark:text-white tracking-tight">
                  Course <span className="text-accent italic">Builder Studio</span>
               </h1>
               <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Editing: {course?.title_en}</p>
            </div>
         </div>

         <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => {
              setSelectedModuleId(modules[0]?.id || '');
              setIsH5pModalOpen(true);
            }} className="rounded-2xl font-bold text-xs uppercase tracking-wider h-12">
               <Puzzle size={16} className="mr-2 text-accent" /> Integrate H5P
            </Button>
            <Button variant="accent" onClick={() => setIsModuleModalOpen(true)} className="rounded-2xl font-bold text-xs uppercase tracking-wider h-12">
               <Plus size={16} className="mr-2" /> New Module
            </Button>
         </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* Modules List */}
         <div className="lg:col-span-8 space-y-6">
            {modules.length === 0 ? (
               <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-[40px] border border-dashed border-gray-100 dark:border-slate-800">
                  <BookOpen size={40} className="mx-auto text-gray-300 mb-4" />
                  <h4 className="font-bold text-lg text-primary dark:text-white">No Modules Defined</h4>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto mt-2">Initialize modules cleanly to start populating interactive assets across your portal.</p>
               </div>
            ) : (
               modules.map((mod, index) => {
                 const moduleH5P = h5pItems.filter(h => h.moduleId === mod.id);

                 return (
                   <div key={mod.id} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-md border border-gray-50 dark:border-slate-800 hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between mb-4">
                         <div>
                            <span className="px-3 py-1 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest rounded-lg">
                               Module {index + 1}
                            </span>
                            <h3 className="text-xl font-bold text-primary dark:text-white mt-2">{mod.title_en}</h3>
                            <p className="text-sm text-gray-400 mt-1">{mod.description_en}</p>
                         </div>
                         <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => {
                              setSelectedModuleId(mod.id);
                              setIsH5pModalOpen(true);
                            }} className="rounded-xl text-xs">
                               <Plus size={14} className="mr-1" /> Add H5P
                            </Button>
                         </div>
                      </div>

                      {/* Attached H5P Tools/Objects */}
                      <div className="mt-6 pt-6 border-t border-gray-50 dark:border-slate-800 space-y-3">
                         {moduleH5P.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No H5P interactive tools added to this module yet.</p>
                         ) : (
                            moduleH5P.map(hItem => (
                               <div key={hItem.id} className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-transparent hover:border-primary/10 transition-all">
                                  <div className="flex items-center space-x-3">
                                     <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center shrink-0">
                                        <Puzzle size={18} />
                                     </div>
                                     <div>
                                        <p className="text-sm font-bold text-primary dark:text-white">{hItem.title}</p>
                                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mt-0.5">{hItem.type}</p>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                     <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg text-red-500 hover:bg-red-50 border-none" onClick={() => deleteH5PItem(hItem.id)}>
                                        <Trash2 size={14} />
                                     </Button>
                                  </div>
                               </div>
                            ))
                         )}
                      </div>
                   </div>
                 );
               })
            )}
         </div>

         {/* Helper/Tutorial Side Drawer */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-800">
               <div className="flex items-center space-x-3 mb-6">
                  <Puzzle size={24} className="text-accent" />
                  <h4 className="font-bold text-primary dark:text-white">H5P Sandbox Guidelines</h4>
               </div>
               <p className="text-xs text-gray-500 leading-relaxed">
                  Use tools like <strong>Lumi Education</strong> or <strong>H5P.org</strong> to construct interactive quizzes. Copy the <code>&lt;iframe&gt;</code> embed codes safely.
               </p>
               <hr className="my-6 border-gray-50 dark:border-slate-800" />
               <div className="space-y-4">
                  <a href="https://h5p.org" target="_blank" className="flex items-center justify-between text-xs font-bold text-primary dark:text-white hover:text-accent transition-colors">
                     <span>Launch H5P.org Editor</span>
                     <ExternalLink size={14} />
                  </a>
                  <a href="https://app.lumi.education" target="_blank" className="flex items-center justify-between text-xs font-bold text-primary dark:text-white hover:text-accent transition-colors">
                     <span>Explore Lumi Apps</span>
                     <ExternalLink size={14} />
                  </a>
               </div>
            </div>
         </div>
      </div>

      {/* Module Modal */}
      {isModuleModalOpen && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 max-w-md w-full shadow-2xl relative">
               <h3 className="text-2xl font-black text-primary dark:text-white mb-6">Append New Module</h3>
               <form onSubmit={handleAddModule} className="space-y-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-gray-400">Title</label>
                     <input 
                       type="text" 
                       value={moduleTitle} 
                       onChange={(e) => setModuleTitle(e.target.value)} 
                       placeholder="Module Name"
                       className="w-full h-14 px-4 bg-gray-50 dark:bg-slate-800 border-none rounded-xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                       required
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-gray-400">Description</label>
                     <textarea 
                       value={moduleDesc} 
                       onChange={(e) => setModuleDesc(e.target.value)} 
                       placeholder="Write summaries here"
                       className="w-full h-24 p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                       required
                     />
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                     <Button type="button" variant="outline" onClick={() => setIsModuleModalOpen(false)} className="rounded-xl">Cancel</Button>
                     <Button type="submit" variant="primary" className="rounded-xl">Save Module</Button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* H5P Modal */}
      {isH5pModalOpen && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 max-w-md w-full shadow-2xl relative">
               <h3 className="text-2xl font-black text-primary dark:text-white mb-6">Configure H5P Interaction</h3>
               <form onSubmit={handleAddH5P} className="space-y-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-gray-400">Attach To Module</label>
                     <select 
                       value={selectedModuleId} 
                       onChange={(e) => setSelectedModuleId(e.target.value)}
                       className="w-full h-14 px-4 bg-gray-50 dark:bg-slate-800 border-none rounded-xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                       required
                     >
                        {modules.map(m => (
                           <option key={m.id} value={m.id}>{m.title_en}</option>
                        ))}
                     </select>
                  </div>

                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-gray-400">Interaction Title</label>
                     <input 
                       type="text" 
                       value={h5pTitle} 
                       onChange={(e) => setH5pTitle(e.target.value)} 
                       placeholder="e.g. End of Module Exam"
                       className="w-full h-14 px-4 bg-gray-50 dark:bg-slate-800 border-none rounded-xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                       required
                     />
                  </div>

                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-gray-400">Format</label>
                     <select 
                       value={h5pType} 
                       onChange={(e) => setH5pType(e.target.value as any)}
                       className="w-full h-14 px-4 bg-gray-50 dark:bg-slate-800 border-none rounded-xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                     >
                        <option value="quiz">Interactive Quiz</option>
                        <option value="presentation">Presentation</option>
                        <option value="video">Interactive Video</option>
                        <option value="interactive">Drag & Drop Space</option>
                     </select>
                  </div>

                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-gray-400">H5P Embed Code / URL</label>
                     <textarea 
                       value={h5pEmbed} 
                       onChange={(e) => setH5pEmbed(e.target.value)} 
                       placeholder="<iframe>...</iframe>"
                       className="w-full h-24 p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-xl font-mono text-xs focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                       required
                     />
                  </div>

                  <div className="flex gap-3 justify-end mt-6">
                     <Button type="button" variant="outline" onClick={() => setIsH5pModalOpen(false)} className="rounded-xl">Cancel</Button>
                     <Button type="submit" variant="accent" className="rounded-xl">Deploy H5P</Button>
                  </div>
               </form>
            </div>
         </div>
      )}

    </div>
  );
}
