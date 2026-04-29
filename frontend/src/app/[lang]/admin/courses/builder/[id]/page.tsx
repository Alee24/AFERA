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
  ExternalLink,
  File,
  X,
  Search,
  ClipboardList,
  GitMerge,
  HelpCircle,
  Type,
  Video,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/lib/NotificationContext';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import SelectLibraryModal from '@/components/admin/SelectLibraryModal';
import CreateContentModal from '@/components/admin/CreateContentModal';

interface Module {
  id: string;
  title_en: string;
  description_en: string;
  order: number;
  Contents?: ModuleContent[];
}

interface ModuleContent {
  id: string;
  module_id: string;
  type: 'text' | 'video' | 'h5p' | 'document' | 'image' | 'quiz' | 'assignment' | 'wiki' | 'page';
  title: string;
  content_en?: string;
  file_url?: string;
  video_url?: string;
  h5p_embed?: string;
  order: number;
}

export default function CourseBuilderPage() {
  const { lang, id } = useParams();
  const router = useRouter();
  const { showNotification } = useNotification();
  
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Creation States
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDesc, setModuleDesc] = useState('');
  
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isCreateContentOpen, setIsCreateContentOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [contentType, setContentType] = useState<'text' | 'video' | 'h5p' | 'document'>('text');
  const [contentTitle, setContentTitle] = useState('');
  const [contentText, setContentText] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [h5pEmbed, setH5pEmbed] = useState('');

  useEffect(() => {
    fetchCourseAndModules();
  }, [id]);

  const fetchCourseAndModules = async () => {
    try {
      const courseRes = await api.get(`/courses/${id}`);
      setCourse(courseRes.data);
      setModules(courseRes.data?.Modules || []);
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
      setModules([...modules, { ...res.data, Contents: [] }]);
      setIsModuleModalOpen(false);
      setModuleTitle('');
      setModuleDesc('');
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to add module', 'error');
    }
  };

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentTitle.trim()) {
      showNotification('Please provide a title', 'error');
      return;
    }
    
    const payload: any = {
      type: contentType,
      title: contentTitle,
      order: (modules.find(m => m.id === selectedModuleId)?.Contents?.length || 0) + 1
    };

    if (contentType === 'text') payload.content_en = contentText;
    if (contentType === 'video') payload.video_url = contentUrl;
    if (contentType === 'document') payload.file_url = contentUrl;
    if (contentType === 'h5p') payload.h5p_embed = h5pEmbed;

    try {
      const res = await api.post(`/modules/${selectedModuleId}/contents`, payload);
      
      setModules(modules.map(m => {
        if (m.id === selectedModuleId) {
          return { ...m, Contents: [...(m.Contents || []), res.data] };
        }
        return m;
      }));

      showNotification('Content added successfully!', 'success');
      setIsContentModalOpen(false);
      resetContentForm();
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to add content', 'error');
    }
  };

  const resetContentForm = () => {
    setContentTitle('');
    setContentText('');
    setContentUrl('');
    setH5pEmbed('');
    setContentType('text');
  };

  const deleteContent = async (contentId: string, moduleId: string) => {
    try {
      await api.delete(`/contents/${contentId}`);
      setModules(modules.map(m => {
        if (m.id === moduleId) {
          return { ...m, Contents: m.Contents?.filter(c => c.id !== contentId) };
        }
        return m;
      }));
      showNotification('Content removed', 'info');
    } catch (err: any) {
      showNotification('Failed to remove content', 'error');
    }
  };

  const deleteModuleLocal = async (modId: string) => {
    if (!window.confirm('Are you sure you want to delete this module and all its contents?')) return;
    try {
      await api.delete(`/modules/${modId}`);
      setModules(modules.filter(m => m.id !== modId));
      showNotification('Module deleted', 'info');
    } catch (err: any) {
      showNotification('Failed to delete module', 'error');
    }
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
               modules.sort((a,b) => a.order - b.order).map((mod, index) => {
                 const contents = mod.Contents || [];

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
                               setIsLibraryOpen(true);
                             }} className="rounded-xl text-[10px] font-bold h-9">
                                <Search size={12} className="mr-1" /> Library
                             </Button>
                             <Button variant="outline" size="sm" onClick={() => {
                               setSelectedModuleId(mod.id);
                               setIsCreateContentOpen(true);
                             }} className="rounded-xl text-[10px] font-bold h-9">
                                <Plus size={12} className="mr-1" /> Create
                             </Button>
                             <Button variant="outline" size="sm" onClick={() => deleteModuleLocal(mod.id)} className="rounded-xl h-9 w-9 p-0 text-red-500 hover:bg-red-50 border-red-100">
                                <Trash2 size={14} />
                             </Button>
                          </div>
                      </div>

                      {/* Attached Contents */}
                      <div className="mt-6 pt-6 border-t border-gray-50 dark:border-slate-800 space-y-3">
                         {contents.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No content added to this module yet.</p>
                         ) : (
                            contents.sort((a,b) => a.order - b.order).map(c => (
                               <div key={c.id} className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-transparent hover:border-primary/10 transition-all">
                                  <div className="flex items-center space-x-3">
                                     <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center shrink-0">
                                        {c.type === 'text' && <Type size={18} />}
                                        {c.type === 'video' && <Video size={18} />}
                                        {c.type === 'h5p' && <Puzzle size={18} />}
                                        {c.type === 'document' && <FileText size={18} />}
                                        {c.type === 'quiz' && <HelpCircle size={18} />}
                                        {c.type === 'assignment' && <ClipboardList size={18} />}
                                        {c.type === 'wiki' && <Search size={18} />}
                                        {c.type === 'page' && <FileText size={18} />}
                                     </div>
                                     <div>
                                        <p className="text-sm font-bold text-primary dark:text-white">{c.title}</p>
                                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mt-0.5">{c.type}</p>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                     <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg text-red-500 hover:bg-red-50 border-none" onClick={() => deleteContent(c.id, mod.id)}>
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
                  <h4 className="font-bold text-primary dark:text-white">Modular Architecture</h4>
               </div>
               <p className="text-xs text-gray-500 leading-relaxed">
                  You can now add multiple content types to a single module. <strong>Text</strong> for reading, <strong>Video</strong> for visual learning, and <strong>H5P</strong> for interactivity.
               </p>
               <hr className="my-6 border-gray-50 dark:border-slate-800" />
               <div className="space-y-4">
                  <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     <Type size={14} className="mr-2" /> Textual Content
                  </div>
                  <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     <Video size={14} className="mr-2" /> Video Streaming
                  </div>
                  <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     <Puzzle size={14} className="mr-2" /> H5P Interactivity
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Module Modal */}
      {isModuleModalOpen && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 max-w-md w-full shadow-2xl relative">
               <button onClick={() => setIsModuleModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-primary transition-all">
                  <X size={24} />
               </button>
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

      {/* Content Modal */}
      {isContentModalOpen && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden">
               <button onClick={() => setIsContentModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-primary transition-all">
                  <X size={24} />
               </button>
               <h3 className="text-2xl font-black text-primary dark:text-white mb-6">Add Module Content</h3>
               
               <div className="flex space-x-2 mb-8 bg-gray-50 dark:bg-slate-800 p-1.5 rounded-2xl">
                  {[
                    { id: 'text', icon: Type, label: 'Text' },
                    { id: 'video', icon: Video, label: 'Video' },
                    { id: 'h5p', icon: Puzzle, label: 'H5P' },
                    { id: 'document', icon: FileText, label: 'Doc' }
                  ].map(t => (
                    <button 
                      key={t.id}
                      onClick={() => setContentType(t.id as any)}
                      className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all ${
                        contentType === t.id ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }`}
                    >
                       <t.icon size={20} className="mb-1" />
                       <span className="text-[10px] font-black uppercase tracking-tighter">{t.label}</span>
                    </button>
                  ))}
               </div>

               <form onSubmit={handleAddContent} className="space-y-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase text-gray-400">Content Title</label>
                     <input 
                       type="text" 
                       value={contentTitle} 
                       onChange={(e) => setContentTitle(e.target.value)} 
                       placeholder="e.g. Introduction to RBM"
                       className="w-full h-14 px-4 bg-gray-50 dark:bg-slate-800 border-none rounded-xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                       required
                     />
                  </div>

                  {contentType === 'text' && (
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-gray-400">Textual Content (Markdown supported)</label>
                       <textarea 
                         value={contentText} 
                         onChange={(e) => setContentText(e.target.value)} 
                         placeholder="Type or paste your lesson content here..."
                         className="w-full h-40 p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                         required
                       />
                    </div>
                  )}

                  {(contentType === 'video' || contentType === 'document') && (
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-gray-400">{contentType === 'video' ? 'Video URL (YouTube/Vimeo)' : 'Document URL'}</label>
                       <input 
                         type="url" 
                         value={contentUrl} 
                         onChange={(e) => setContentUrl(e.target.value)} 
                         placeholder="https://..."
                         className="w-full h-14 px-4 bg-gray-50 dark:bg-slate-800 border-none rounded-xl font-medium focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                         required
                       />
                    </div>
                  )}

                  {contentType === 'h5p' && (
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-gray-400">H5P Embed Code</label>
                       <textarea 
                         value={h5pEmbed} 
                         onChange={(e) => setH5pEmbed(e.target.value)} 
                         placeholder="<iframe>...</iframe>"
                         className="w-full h-32 p-4 bg-gray-50 dark:bg-slate-800 border-none rounded-xl font-mono text-xs focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                         required
                       />
                    </div>
                  )}

                  <div className="flex gap-3 justify-end mt-6">
                     <Button type="button" variant="outline" onClick={() => setIsContentModalOpen(false)} className="rounded-xl">Cancel</Button>
                     <Button type="submit" variant="primary" className="rounded-xl">Save Content</Button>
                  </div>
               </form>
            </div>
         </div>
      )}

      <SelectLibraryModal 
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelect={async (selected) => {
          for (const item of selected) {
            await api.post(`/modules/${selectedModuleId}/contents`, {
              type: item.type,
              title: item.title,
              reference_id: item.id,
              order: (modules.find(m => m.id === selectedModuleId)?.Contents?.length || 0) + 1
            });
          }
          fetchCourseAndModules();
          showNotification(`Added ${selected.length} items from library`, 'success');
        }}
      />

      <CreateContentModal 
        isOpen={isCreateContentOpen}
        onClose={() => setIsCreateContentOpen(false)}
        onSelect={(type) => {
          setIsCreateContentOpen(false);
          if (['text', 'video', 'h5p', 'document'].includes(type)) {
            setContentType(type as any);
            setIsContentModalOpen(true);
          } else {
            router.push(`/${lang}/admin/content/${type}/new?module_id=${selectedModuleId}`);
          }
        }}
      />
    </div>
  );
}
