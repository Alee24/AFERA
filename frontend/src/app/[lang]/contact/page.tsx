'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import axios from '@/lib/api';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/contacts', {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      setSubmitted(true);
      // Reset after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
      setFormData({ firstName: '', lastName: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (err) {
      console.error('Failed to submit contact form', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 bg-gray-50 dark:bg-slate-900 min-h-screen">
      {/* Page Header */}
      <section className="bg-primary py-20 border-b border-primary/20">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-semibold tracking-wider text-accent uppercase mb-6">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions about admissions, programs, or campus life? We're here to help you every step of the way.
          </p>
        </div>
      </section>

      <section className="py-24 -mt-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <Card className="p-8 shadow-premium border-0 bg-white dark:bg-slate-800">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/10 p-4 rounded-xl text-accent">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-primary dark:text-white">Our Location</h3>
                    <p className="text-gray-600 dark:text-gray-400">123 University Avenue,<br />Nairobi, Kenya</p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 shadow-premium border-0 bg-white dark:bg-slate-800">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/10 p-4 rounded-xl text-accent">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-primary dark:text-white">Phone Number</h3>
                    <p className="text-gray-600 dark:text-gray-400">+254 700 000 000</p>
                    <p className="text-sm text-gray-500 mt-1">Mon-Fri, 8am - 5pm</p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 shadow-premium border-0 bg-white dark:bg-slate-800">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/10 p-4 rounded-xl text-accent">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-primary dark:text-white">Email Address</h3>
                    <p className="text-gray-600 dark:text-gray-400">info@afera.ac.ke</p>
                    <p className="text-gray-600 dark:text-gray-400">admissions@afera.ac.ke</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8 md:p-12 shadow-premium border-0 bg-white dark:bg-slate-800">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-primary dark:text-white mb-2">Send us a Message</h2>
                  <p className="text-gray-500 dark:text-gray-400">Fill out the form below and our team will get back to you within 24 hours.</p>
                </div>

                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-12 text-center"
                  >
                    <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={32} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">Message Sent!</h3>
                    <p className="text-green-600 dark:text-green-500">Thank you for reaching out. We will respond shortly.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">First Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="John" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Last Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Doe" 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="john@example.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Subject</label>
                      <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                      >
                        <option>General Inquiry</option>
                        <option>Admissions</option>
                        <option>Academic Programs</option>
                        <option>Technical Support</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Your Message</label>
                      <textarea 
                        required
                        rows={5} 
                        placeholder="How can we help you?" 
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                      ></textarea>
                    </div>

                    <Button type="submit" variant="accent" size="lg" className="w-full py-4" disabled={loading}>
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Send size={18} className="mr-2" /> Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[400px] bg-gray-200 dark:bg-slate-800 relative grayscale opacity-70 border-t border-gray-200 dark:border-slate-700">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20">
            <MapPin size={48} className="mx-auto text-primary mb-4" />
            <h3 className="text-2xl font-bold text-primary dark:text-white mb-2">Campus Location</h3>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Interactive Map Integration Ready</p>
          </div>
        </div>
      </section>
    </main>
  );
}
