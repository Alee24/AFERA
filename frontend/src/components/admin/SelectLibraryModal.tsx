'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Search, Filter, BookOpen, FileText, 
  HelpCircle, ClipboardList, GitMerge, CheckCircle2 
} from 'lucide-react';

interface LibraryItem {
  id: string;
  title: string;
  type: string;
  category?: string;
  image?: string;
}

interface SelectLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (items: LibraryItem[]) => void;
}

const SelectLibraryModal: React.FC<SelectLibraryModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchLibrary();
    }
  }, [isOpen]);

  const fetchLibrary = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/library', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      
      const flattened: LibraryItem[] = [
        ...data.courses.map((c: any) => ({ id: c.id, title: c.title_en, type: 'course', image: c.image_url })),
        ...data.pages.map((p: any) => ({ id: p.id, title: p.title, type: 'page' })),
        ...data.quizzes.map((q: any) => ({ id: q.id, title: q.title, type: 'quiz' })),
        ...data.assignments.map((a: any) => ({ id: a.id, title: a.title, type: 'assignment' })),
        ...data.wikis.map((w: any) => ({ id: w.id, title: w.title, type: 'wiki' })),
      ];
      
      setItems(flattened);
    } catch (error) {
      console.error('Failed to fetch library:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selected = items.filter(i => selectedItems.includes(i.id));
    onSelect(selected);
    onClose();
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Select from library</h2>
              <p className="text-sm text-slate-500">Add existing content to your module</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap gap-4 items-center border-b border-slate-100 dark:border-slate-800">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'course', 'page', 'quiz', 'assignment', 'wiki'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    selectedType === type 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedItems.includes(item.id)
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${
                        item.type === 'course' ? 'bg-blue-100 text-blue-600' :
                        item.type === 'page' ? 'bg-orange-100 text-orange-600' :
                        item.type === 'quiz' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {item.type === 'course' && <BookOpen className="w-5 h-5" />}
                        {item.type === 'page' && <FileText className="w-5 h-5" />}
                        {item.type === 'quiz' && <HelpCircle className="w-5 h-5" />}
                        {item.type === 'assignment' && <ClipboardList className="w-5 h-5" />}
                        {item.type === 'wiki' && <Search className="w-5 h-5" />}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.type}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-white line-clamp-2">{item.title}</h4>
                    
                    {selectedItems.includes(item.id) && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-6 h-6 text-primary fill-primary/10" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Search className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">No items found</p>
                <p className="text-sm">Try adjusting your filters or search term</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <p className="text-sm text-slate-500">
              <span className="font-bold text-primary">{selectedItems.length}</span> items selected
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={selectedItems.length === 0}
                onClick={handleConfirm}
                className="px-8 py-2 rounded-lg bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                Add to module
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SelectLibraryModal;
