'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, GitMerge, MoreVertical, 
  Trash2, Edit, ChevronRight, Users, Calendar, BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/AdminSidebar';

interface LearningPath {
  id: string;
  title: string;
  Items: any[];
  Trainer?: { first_name: string; last_name: string };
  created_at: string;
}

const LearningPathsPage = () => {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    try {
      const response = await fetch('/api/learning-paths', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setPaths(data);
    } catch (error) {
      console.error('Failed to fetch paths:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPaths = paths.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar lang="en" />
      
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Learning Paths</h1>
            <p className="text-slate-500 mt-1">Design and manage structured educational journeys</p>
          </div>
          
          <Link 
            href="/admin/learning-paths/builder/new"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Path
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Paths', value: paths.length, icon: GitMerge, color: 'text-pink-600', bg: 'bg-pink-100' },
            { label: 'Active Students', value: '1,284', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
            { label: 'Avg. Completion', value: '74%', icon: Calendar, color: 'text-green-600', bg: 'bg-green-100' },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.bg} dark:bg-opacity-10`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search learning paths..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Paths List */}
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPaths.map((path) => (
              <motion.div
                key={path.id}
                whileHover={{ y: -4 }}
                className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-primary/10 transition-colors">
                    <GitMerge className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      href={`/admin/learning-paths/builder/${path.id}`}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-all"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg text-slate-400 hover:text-rose-500 transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {path.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    {path.Items?.length || 0} Modules
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {path.Trainer ? `${path.Trainer.first_name} ${path.Trainer.last_name}` : 'No Trainer'}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Created {new Date(path.created_at).toLocaleDateString()}
                  </span>
                  <Link 
                    href={`/admin/learning-paths/builder/${path.id}`}
                    className="flex items-center gap-1 text-primary font-bold text-sm hover:underline"
                  >
                    View Builder <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}

            {filteredPaths.length === 0 && !loading && (
              <div className="col-span-full py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400">
                <GitMerge className="w-16 h-16 mb-4 opacity-10" />
                <p className="text-xl font-medium">No learning paths found</p>
                <Link href="/admin/learning-paths/builder/new" className="mt-4 text-primary font-bold hover:underline">
                  Create your first path
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default LearningPathsPage;
