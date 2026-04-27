'use client';

import React, { useState, useEffect } from 'react';
import { 
  Presentation, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Upload, 
  Image as ImageIcon,
  FileText,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';

export default function AdminWorkshopsPage() {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title_en: '',
    description_en: '',
    category: 'Technical Workshop',
    type: 'PPTX',
    image_url: '',
    file_url: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const { showNotification } = useNotification();

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const res = await api.get('/workshops');
      setWorkshops(res.data);
    } catch (err) {
      showNotification('Failed to load workshops', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title_en) return showNotification('Title is required', 'error');
    setSubmitting(true);
    try {
      if (editingWorkshop) {
        await api.put(`/workshops/${editingWorkshop.id}`, formData);
        showNotification('Workshop updated successfully', 'success');
      } else {
        await api.post('/workshops', formData);
        showNotification('Workshop created successfully', 'success');
      }
      setIsModalOpen(false);
      setEditingWorkshop(null);
      setFormData({
        title_en: '',
        description_en: '',
        category: 'Technical Workshop',
        type: 'PPTX',
        image_url: '',
        file_url: ''
      });
      fetchWorkshops();
    } catch (err) {
      showNotification('Failed to save workshop', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workshop?')) return;
    try {
      await api.delete(`/workshops/${id}`);
      showNotification('Workshop deleted', 'success');
      fetchWorkshops();
    } catch (err) {
      showNotification('Failed to delete workshop', 'error');
    }
  };

  const filteredWorkshops = workshops.filter(w => 
    w.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-white/20 flex flex-col max-h-[90vh]"
            >
               <div className="p-10 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="text-2xl font-black text-primary dark:text-white">{editingWorkshop ? 'Edit' : 'Create'} Workshop</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
               </div>

               <div className="p-10 overflow-y-auto space-y-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Workshop Title (EN)</label>
                     <input 
                       value={formData.title_en} 
                       onChange={e => setFormData({...formData, title_en: e.target.value})} 
                       type="text" 
                       className="w-full h-16 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold" 
                       placeholder="e.g. TREPP 2026 Presentation" 
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Category</label>
                       <select 
                         value={formData.category} 
                         onChange={e => setFormData({...formData, category: e.target.value})} 
                         className="w-full h-16 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold"
                       >
                         <option>Technical Workshop</option>
                         <option>Case Study</option>
                         <option>Strategic Planning</option>
                         <option>Institutional</option>
                         <option>Governance</option>
                         <option>Finance</option>
                         <option>Leadership</option>
                         <option>Academic</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">File Type</label>
                       <select 
                         value={formData.type} 
                         onChange={e => setFormData({...formData, type: e.target.value})} 
                         className="w-full h-16 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold"
                       >
                         <option>PPTX</option>
                         <option>PDF</option>
                         <option>DOCX</option>
                       </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Description</label>
                     <textarea 
                       value={formData.description_en} 
                       onChange={e => setFormData({...formData, description_en: e.target.value})} 
                       className="w-full h-32 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl p-6 font-bold" 
                       placeholder="Brief workshop overview..." 
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Thumbnail URL</label>
                       <div className="relative">
                          <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            value={formData.image_url} 
                            onChange={e => setFormData({...formData, image_url: e.target.value})} 
                            type="text" 
                            className="w-full h-16 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl pl-14 pr-6 font-bold" 
                            placeholder="https://..." 
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">File URL / Download Link</label>
                       <div className="relative">
                          <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            value={formData.file_url} 
                            onChange={e => setFormData({...formData, file_url: e.target.value})} 
                            type="text" 
                            className="w-full h-16 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl pl-14 pr-6 font-bold" 
                            placeholder="e.g. workshop.pptx" 
                          />
                       </div>
                    </div>
                  </div>
               </div>

               <div className="p-10 bg-gray-50 dark:bg-slate-800/50 flex space-x-4">
                  <Button 
                    onClick={handleSave} 
                    disabled={submitting}
                    className="flex-1 h-16 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-primary/20"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> Save Workshop</>}
                  </Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary dark:text-white tracking-tight">Thematic <span className="text-accent italic">Workshops</span></h1>
          <p className="text-gray-500 mt-2 font-medium">Manage the resource library and academic presentations.</p>
        </div>
        <Button onClick={() => { setIsModalOpen(true); setEditingWorkshop(null); setFormData({ title_en: '', description_en: '', category: 'Technical Workshop', type: 'PPTX', image_url: '', file_url: '' }); }} className="bg-primary text-white rounded-[24px] px-8 h-16 font-bold shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
           <Plus size={20} className="mr-3" /> Add New Item
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[36px] shadow-sm border border-gray-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center gap-6">
         <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              type="text" 
              placeholder="Search by title or category..." 
              className="w-full pl-14 pr-6 h-16 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold" 
            />
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {loading ? (
            <div className="col-span-3 text-center py-20 animate-pulse text-gray-400 font-black uppercase tracking-widest">Loading Resources...</div>
         ) : filteredWorkshops.length === 0 ? (
            <div className="col-span-3 text-center py-20 text-gray-400 font-medium">No resources found matching your search.</div>
         ) : filteredWorkshops.map((workshop) => (
            <motion.div 
              key={workshop.id} 
              layout
              className="bg-white dark:bg-slate-900 rounded-[40px] border border-gray-50 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-xl transition-all"
            >
               <div className="h-48 bg-gray-100 dark:bg-slate-800 relative">
                  {workshop.image_url ? (
                    <img src={workshop.image_url} alt={workshop.title_en} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Presentation size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-accent">
                    {workshop.category}
                  </div>
               </div>
               <div className="p-8">
                  <h4 className="text-xl font-bold text-primary dark:text-white mb-2 line-clamp-1">{workshop.title_en}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-6">{workshop.description_en}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-slate-800">
                     <div className="flex space-x-2">
                        <Button onClick={() => { setIsModalOpen(true); setEditingWorkshop(workshop); setFormData({ title_en: workshop.title_en, description_en: workshop.description_en, category: workshop.category, type: workshop.type, image_url: workshop.image_url || '', file_url: workshop.file_url || '' }); }} variant="ghost" className="w-10 h-10 p-0 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-primary"><Edit size={16} /></Button>
                        <Button onClick={() => handleDelete(workshop.id)} variant="ghost" className="w-10 h-10 p-0 rounded-xl bg-gray-50 dark:bg-slate-800 text-red-400 hover:bg-red-50"><Trash2 size={16} /></Button>
                     </div>
                     <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{workshop.type}</span>
                        <a href={workshop.file_url} target="_blank" className="text-primary hover:text-accent transition-colors"><ExternalLink size={16} /></a>
                     </div>
                  </div>
               </div>
            </motion.div>
         ))}
      </div>
    </div>
  );
}
