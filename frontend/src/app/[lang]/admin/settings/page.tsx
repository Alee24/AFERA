'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Globe, Mail, Phone, MapPin, Palette, Type, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';

export default function SystemSettings() {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    site_name: '',
    site_description: '',
    logo_url: '',
    footer_logo_url: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    color_primary: '#051A31',
    color_accent: '#E7AB33'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/system/settings');
      setSettings(res.data);
    } catch (err) {
      showNotification('Failed to load system settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/system/settings', settings);
      showNotification('System settings updated successfully!', 'success');
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-black text-primary dark:text-white tracking-tight">System <span className="text-accent italic">Settings</span></h1>
        <p className="text-gray-500 mt-2 font-medium">Manage your platform brand, contact details, and appearance.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Brand & Content */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 space-y-6">
          <div className="flex items-center space-x-3 border-b border-gray-100 dark:border-slate-800 pb-4">
            <Type className="text-primary w-5 h-5" />
            <h3 className="text-lg font-bold text-primary dark:text-white">Brand & Content</h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Site Name</label>
              <input 
                type="text" 
                name="site_name"
                value={settings.site_name}
                onChange={handleChange}
                className="w-full h-12 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 font-bold text-sm text-primary dark:text-white focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Site Description</label>
              <textarea 
                name="site_description"
                value={settings.site_description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl p-4 font-bold text-sm text-primary dark:text-white focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
        </div>

        {/* Logos & Assets */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 space-y-6">
          <div className="flex items-center space-x-3 border-b border-gray-100 dark:border-slate-800 pb-4">
            <ImageIcon className="text-primary w-5 h-5" />
            <h3 className="text-lg font-bold text-primary dark:text-white">Assets & URLs</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Primary Logo URL</label>
              <input 
                type="text" 
                name="logo_url"
                value={settings.logo_url}
                onChange={handleChange}
                placeholder="/logo.png"
                className="w-full h-12 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 font-bold text-sm text-primary dark:text-white focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Footer Logo URL</label>
              <input 
                type="text" 
                name="footer_logo_url"
                value={settings.footer_logo_url}
                onChange={handleChange}
                placeholder="/logo-footer.png"
                className="w-full h-12 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 font-bold text-sm text-primary dark:text-white focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 space-y-6">
          <div className="flex items-center space-x-3 border-b border-gray-100 dark:border-slate-800 pb-4">
            <Globe className="text-primary w-5 h-5" />
            <h3 className="text-lg font-bold text-primary dark:text-white">Contact Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
              <input 
                type="email" 
                name="contact_email"
                value={settings.contact_email}
                onChange={handleChange}
                className="w-full h-12 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 font-bold text-sm text-primary dark:text-white focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
              <input 
                type="text" 
                name="contact_phone"
                value={settings.contact_phone}
                onChange={handleChange}
                className="w-full h-12 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 font-bold text-sm text-primary dark:text-white focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Physical Address</label>
              <input 
                type="text" 
                name="contact_address"
                value={settings.contact_address}
                onChange={handleChange}
                className="w-full h-12 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 font-bold text-sm text-primary dark:text-white focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 space-y-6">
          <div className="flex items-center space-x-3 border-b border-gray-100 dark:border-slate-800 pb-4">
            <Palette className="text-primary w-5 h-5" />
            <h3 className="text-lg font-bold text-primary dark:text-white">Visual Identity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Primary Color</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="color" 
                  name="color_primary"
                  value={settings.color_primary}
                  onChange={handleChange}
                  className="w-12 h-12 rounded-xl border-none p-1 bg-gray-50 dark:bg-slate-800 cursor-pointer"
                />
                <input 
                  type="text" 
                  name="color_primary"
                  value={settings.color_primary}
                  onChange={handleChange}
                  className="flex-1 h-12 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 font-bold text-sm text-primary dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Accent Color</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="color" 
                  name="color_accent"
                  value={settings.color_accent}
                  onChange={handleChange}
                  className="w-12 h-12 rounded-xl border-none p-1 bg-gray-50 dark:bg-slate-800 cursor-pointer"
                />
                <input 
                  type="text" 
                  name="color_accent"
                  value={settings.color_accent}
                  onChange={handleChange}
                  className="flex-1 h-12 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 font-bold text-sm text-primary dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={saving}
            className="h-14 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-xs px-8 shadow-lg shadow-primary/20"
          >
            {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
            Save System Configurations
          </Button>
        </div>
      </form>
    </div>
  );
}
