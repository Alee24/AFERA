'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Plus, Edit2, Trash2, Calendar, User, FileText, 
  Search, RefreshCw, X, File, Image as ImageIcon, Loader2 
} from 'lucide-react';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';
import { Button } from '@/components/ui/Button';

export default function AdminBlogPage() {
  const { lang } = useParams();
  const { showNotification } = useNotification();
  
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    date: new Date().toISOString().split('T')[0],
    author: '',
    type: 'PPTX',
    filename: '',
    image: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/news-posts');
      setPosts(res.data);
    } catch (err: any) {
      showNotification('Failed to fetch posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenModal = (post: any = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        author: post.author,
        type: post.type,
        filename: post.filename || '',
        image: post.image || ''
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        excerpt: '',
        date: new Date().toISOString().split('T')[0],
        author: '',
        type: 'PPTX',
        filename: '',
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingPost) {
        await api.put(`/news-posts/${editingPost.id}`, formData);
        showNotification('Post updated successfully', 'success');
      } else {
        await api.post('/news-posts', formData);
        showNotification('Post created successfully', 'success');
      }
      handleCloseModal();
      fetchPosts();
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Action failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/news-posts/${id}`);
      showNotification('Post deleted successfully', 'success');
      fetchPosts();
    } catch (err: any) {
      showNotification('Failed to delete post', 'error');
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">Blog & Documents</h1>
          <p className="text-gray-400 text-sm mt-1">Manage the news and document attachments displayed on the homepage.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="rounded-full shadow-lg flex items-center space-x-2">
          <Plus size={18} /> <span>Create New Post</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-800">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, author..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl pl-12 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button onClick={fetchPosts} className="p-2 text-gray-400 hover:text-primary dark:hover:text-white">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center text-primary dark:text-white">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-20 text-center text-gray-400">No posts found. Get started by creating one!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-700">
                  <th className="py-5 px-8">Details</th>
                  <th className="py-5 px-6">Resource Type</th>
                  <th className="py-5 px-6">Upload Links</th>
                  <th className="py-5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-6 px-8 flex items-center space-x-4">
                      {post.image ? (
                        <img src={post.image} alt="" className="w-16 h-12 object-cover rounded-xl shadow-sm" />
                      ) : (
                        <div className="w-16 h-12 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-400"><ImageIcon size={20} /></div>
                      )}
                      <div>
                        <h4 className="font-bold text-primary dark:text-white leading-tight">{post.title}</h4>
                        <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1">
                          <span className="flex items-center"><Calendar size={12} className="mr-1" /> {post.date}</span>
                          <span className="flex items-center"><User size={12} className="mr-1" /> {post.author}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6 font-semibold text-sm text-gray-500 dark:text-gray-300">
                      <span className="px-3 py-1 bg-accent/10 text-accent font-bold rounded-lg text-xs tracking-wide uppercase">{post.type}</span>
                    </td>
                    <td className="py-6 px-6 text-xs text-gray-400">
                      <div className="max-w-[200px] truncate">{post.filename || 'None attached'}</div>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => handleOpenModal(post)} className="p-2 text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(post.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800">
            <div className="p-6 bg-primary text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">{editingPost ? 'Edit News Post' : 'Create New Post'}</h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Post Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 font-semibold text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. Cost Estimation for Roadworks"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Author / Publisher</label>
                  <input 
                    type="text" 
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 font-semibold text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. Directorate"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Publication Date</label>
                  <input 
                    type="text" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 font-semibold text-sm focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resource Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 font-semibold text-sm focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="PPTX">PowerPoint (PPTX)</option>
                    <option value="PDF">Document (PDF)</option>
                    <option value="DOCX">Word (DOCX)</option>
                    <option value="NEWS">General News</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Excerpt / Summary</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 font-semibold text-sm focus:ring-2 focus:ring-primary/20"
                  placeholder="Provide a quick overview..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Image Link / URL</label>
                  <input 
                    type="text" 
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 font-semibold text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Document Path / Filename</label>
                  <input 
                    type="text" 
                    value={formData.filename}
                    onChange={(e) => setFormData({...formData, filename: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 font-semibold text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="e.g. academic-presentation.pptx"
                  />
                </div>
              </div>

              <Button type="submit" disabled={submitting} className="w-full py-4 uppercase tracking-wider font-bold">
                {submitting ? <Loader2 className="animate-spin" /> : editingPost ? 'Update' : 'Create'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
