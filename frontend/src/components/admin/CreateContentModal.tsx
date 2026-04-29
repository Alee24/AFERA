'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, BookOpen, FileText, HelpCircle, 
  ClipboardList, GitMerge, Search, Sparkles 
} from 'lucide-react';

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: string) => void;
}

const contentTypes = [
  {
    id: 'course',
    title: 'Course',
    description: 'Create and publish educational content for learners.',
    icon: BookOpen,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    ai: false,
  },
  {
    id: 'page',
    title: 'Page',
    description: 'Create a standalone pages containing educational content.',
    icon: FileText,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    ai: true,
  },
  {
    id: 'quiz',
    title: 'Quiz',
    description: 'Create an assessments that evaluate learners\' understanding of the material.',
    icon: HelpCircle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    ai: true,
  },
  {
    id: 'assignment',
    title: 'Assignment',
    description: 'Create assignments for learners to do within a certain deadline.',
    icon: ClipboardList,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    ai: false,
  },
  {
    id: 'learning-path',
    title: 'Learning Path',
    description: 'Create a structured and sequenced journey for learners to follow.',
    icon: GitMerge,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    ai: false,
  },
  {
    id: 'wiki',
    title: 'Wiki',
    description: 'Create a knowledge base where information related to the course.',
    icon: Search,
    color: 'text-teal-500',
    bgColor: 'bg-teal-50',
    ai: false,
    badge: 'New',
  }
];

const CreateContentModal: React.FC<CreateContentModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create new content</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          {/* Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
            {contentTypes.map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                onClick={() => onSelect(type.id)}
                className="flex flex-col p-5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-800 text-left transition-all group relative"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg ${type.bgColor} dark:bg-opacity-10`}>
                    <type.icon className={`w-6 h-6 ${type.color}`} />
                  </div>
                  <div className="flex gap-2">
                    {type.ai && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-medium border border-indigo-100 dark:border-indigo-800">
                        <Sparkles className="w-3 h-3" />
                        AI Powered
                      </span>
                    )}
                    {type.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-[10px] font-medium border border-teal-100 dark:border-teal-800">
                        {type.badge}
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 group-hover:text-primary transition-colors">
                  {type.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {type.description}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateContentModal;
