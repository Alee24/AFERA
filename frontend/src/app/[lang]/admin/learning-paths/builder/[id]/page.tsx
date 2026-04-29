'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Plus, Save, Trash2, GripVertical, ChevronRight, 
  BookOpen, FileText, HelpCircle, GitMerge, MoreVertical,
  Layers, Trophy, Target
} from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import AdminSidebar from '@/components/AdminSidebar';
import SelectLibraryModal from '@/components/admin/SelectLibraryModal';
import CreateContentModal from '@/components/admin/CreateContentModal';

interface LPItem {
  id: string;
  title: string;
  type: string;
  stage: string;
  order: number;
}

const LearningPathBuilder = () => {
  const { id, lang } = useParams();
  const router = useRouter();
  const [pathTitle, setPathTitle] = useState('New Learning Path');
  const [items, setItems] = useState<LPItem[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeStage, setActiveStage] = useState('Junior');
  const [loading, setLoading] = useState(true);

  const stages = ['Junior', 'Mid', 'Senior'];

  useEffect(() => {
    if (id !== 'new') {
      fetchPathData();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchPathData = async () => {
    try {
      const response = await fetch(`/api/learning-paths/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setPathTitle(data.title);
      setItems(data.Items || []);
    } catch (error) {
      console.error('Failed to fetch path:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItemToStage = (stage: string) => {
    setActiveStage(stage);
    setIsLibraryOpen(true);
  };

  const handleLibrarySelect = (selected: any[]) => {
    const newItems = selected.map((s, index) => ({
      id: s.id, // Using real ID from library
      title: s.title,
      type: s.type,
      stage: activeStage,
      order: items.length + index
    }));
    setItems([...items, ...newItems]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleSave = async () => {
    try {
      const method = id === 'new' ? 'POST' : 'PUT';
      const url = id === 'new' ? '/api/learning-paths' : `/api/learning-paths/${id}`;
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title: pathTitle, items })
      });

      if (response.ok) {
        alert('Learning Path saved successfully!');
        router.push('/admin/learning-paths');
      }
    } catch (error) {
      alert('Failed to save learning path');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar lang={lang as string} />
      
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
              <GitMerge className="w-8 h-8 text-pink-600" />
            </div>
            <div>
              <input 
                value={pathTitle}
                onChange={(e) => setPathTitle(e.target.value)}
                className="text-3xl font-bold bg-transparent border-b border-transparent focus:border-slate-300 dark:focus:border-slate-700 outline-none text-slate-800 dark:text-white"
                placeholder="Enter path title..."
              />
              <p className="text-slate-500 flex items-center gap-2 mt-1">
                Learning Path Builder <ChevronRight className="w-4 h-4" /> Curriculum Design
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Content
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-all"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Stages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {stages.map((stage) => (
            <div key={stage} className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    stage === 'Junior' ? 'bg-green-100 text-green-600' :
                    stage === 'Mid' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {stage === 'Junior' && <Target className="w-5 h-5" />}
                    {stage === 'Mid' && <Layers className="w-5 h-5" />}
                    {stage === 'Senior' && <Trophy className="w-5 h-5" />}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">{stage} Stage</h3>
                </div>
                <button 
                  onClick={() => addItemToStage(stage)}
                  className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-primary"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Items in Stage */}
              <div className="min-h-[400px] flex flex-col gap-3">
                {items.filter(i => i.stage === stage).map((item, idx) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-all group"
                  >
                    <GripVertical className="w-5 h-5 text-slate-300 group-hover:text-slate-400 cursor-grab" />
                    <div className={`p-2 rounded-lg ${
                      item.type === 'course' ? 'bg-blue-50 text-blue-500' :
                      item.type === 'page' ? 'bg-orange-50 text-orange-500' :
                      item.type === 'quiz' ? 'bg-yellow-50 text-yellow-500' :
                      'bg-slate-50 text-slate-500'
                    }`}>
                      {item.type === 'course' && <BookOpen className="w-5 h-5" />}
                      {item.type === 'page' && <FileText className="w-5 h-5" />}
                      {item.type === 'quiz' && <HelpCircle className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 dark:text-white truncate">{item.title}</h4>
                      <p className="text-xs text-slate-400 capitalize">{item.type} • Order {idx + 1}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}

                {items.filter(i => i.stage === stage).length === 0 && (
                  <button 
                    onClick={() => addItemToStage(stage)}
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:border-primary hover:text-primary transition-all group bg-white/50 dark:bg-slate-900/50"
                  >
                    <Plus className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-sm">Add item to {stage}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modals */}
        <SelectLibraryModal 
          isOpen={isLibraryOpen}
          onClose={() => setIsLibraryOpen(false)}
          onSelect={handleLibrarySelect}
        />
        
        <CreateContentModal 
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSelect={(type) => {
            setIsCreateOpen(false);
            // Logic to open specific creation form based on type
            console.log('Creating', type);
          }}
        />
      </main>
    </div>
  );
};

export default LearningPathBuilder;
