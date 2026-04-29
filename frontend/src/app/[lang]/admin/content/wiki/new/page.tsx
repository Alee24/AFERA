'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ArrowLeft, Save } from 'lucide-react';

export default function NewWikiPage({ params }: { params: { lang: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = searchParams.get('module_id');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert('Please enter a title');

    setIsSubmitting(true);
    try {
      // 1. Create Wiki
      const res = await fetch('/api/wikis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category
        })
      });

      if (!res.ok) throw new Error('Failed to create wiki');
      const wiki = await res.json();

      // 2. Associate with module
      if (moduleId) {
        const linkRes = await fetch(`/api/modules/${moduleId}/contents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'wiki',
            reference_id: wiki.id,
            title: wiki.title
          })
        });
        if (!linkRes.ok) throw new Error('Failed to link wiki to module');
      }

      alert('Wiki page created and linked successfully!');
      router.back();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between items-center bg-slate-900/50 backdrop-blur border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Wiki Page</h1>
                <p className="text-slate-400 mt-1">Build reference knowledge bases for students.</p>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-3 rounded-xl transition shadow-lg shadow-amber-600/25 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Saving...' : 'Save & Publish'}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Wiki Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="e.g. Overview of Machine Learning"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Category Tag</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="e.g. AI, Math, Basics"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Content (Supports HTML / Text)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors h-64 font-mono text-sm"
                placeholder="Write the wiki content here..."
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
