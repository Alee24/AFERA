'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Calendar, User, ArrowLeft, Share2, Bookmark, Globe, Send, Linkedin } from 'lucide-react';

export default function WorkshopDetailPage() {
  return (
    <main className="pt-24 min-h-screen bg-white">
      {/* Article Progress Bar */}
      <div className="fixed top-24 left-0 w-full h-1 bg-gray-100 z-50">
        <motion.div 
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: '45%' }} // Placeholder progress
        />
      </div>

      <article className="py-16">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Breadcrumbs & Back */}
          <div className="mb-10">
            <Link href="/workshops" className="text-gray-500 hover:text-primary flex items-center transition-colors">
              <ArrowLeft size={18} className="mr-2" /> Back to Workshops
            </Link>
          </div>

          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center space-x-2 text-accent text-sm font-bold uppercase tracking-widest mb-4">
              <span>Technology</span>
              <span>•</span>
              <span>10 Min Read</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-8 leading-tight">
              The Future of AI in Modern Education
            </h1>
            
            <div className="flex items-center justify-between py-6 border-y border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border">
                  <Image src="https://i.pravatar.cc/150?u=alan" alt="Author" fill className="object-cover" />
                </div>
                <div>
                  <div className="font-bold text-primary">Dr. Alan Turing</div>
                  <div className="text-xs text-gray-500">Senior Lecturer, CS Department</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="p-2 hover:bg-muted rounded-full transition-colors text-gray-400 hover:text-primary">
                  <Share2 size={20} />
                </button>
                <button className="p-2 hover:bg-muted rounded-full transition-colors text-gray-400 hover:text-primary">
                  <Bookmark size={20} />
                </button>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-xl">
            <Image 
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200" 
              alt="AI and Education" 
              fill 
              className="object-cover" 
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-accent">
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Artificial Intelligence is no longer a futuristic concept. It is here, and it is fundamentally changing how we approach teaching and learning. From personalized learning paths to automated grading, the impact is profound.
            </p>
            
            <h2 className="text-3xl font-bold mt-12 mb-6">Personalized Learning Paths</h2>
            <p className="mb-6">
              One of the most significant advantages of AI in education is the ability to provide personalized learning experiences. Traditional classroom settings often follow a "one size fits all" approach, which can leave some students behind while others are not sufficiently challenged.
            </p>
            
            <blockquote className="border-l-4 border-accent pl-6 py-4 my-10 italic text-2xl text-primary bg-muted/30 rounded-r-xl">
              "The goal of AI in education isn't to replace teachers, but to augment their abilities and provide students with a more tailored learning journey."
            </blockquote>

            <p className="mb-6">
              AI algorithms can analyze a student's performance in real-time, identifying areas where they struggle and suggesting additional resources or exercises to help them master the topic.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">The Role of the Educator</h2>
            <p className="mb-6">
              As AI takes over administrative tasks and provides data-driven insights, the role of the teacher is evolving. Educators are becoming mentors and facilitators, focusing on critical thinking, emotional intelligence, and complex problem-solving—skills that AI cannot easily replicate.
            </p>
          </div>

          {/* Footer / Share */}
          <footer className="mt-16 pt-8 border-t">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-gray-400">TAGS:</span>
                <span className="bg-muted px-3 py-1 rounded-full text-xs font-medium">Education</span>
                <span className="bg-muted px-3 py-1 rounded-full text-xs font-medium">AI</span>
                <span className="bg-muted px-3 py-1 rounded-full text-xs font-medium">Future</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">Share this article:</span>
                <div className="flex space-x-2">
                  <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white transition-all">
                    <Globe size={16} />
                  </a>
                  <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-400 hover:text-white transition-all">
                    <Send size={16} />
                  </a>
                  <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-700 hover:text-white transition-all">
                    <User size={16} />
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4">
          <h3 className="text-2xl font-bold mb-10">You might also like</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Dummy Related Items */}
            {[2, 3, 4].map((id) => (
              <div key={id} className="bg-white rounded-2xl overflow-hidden shadow-premium group">
                <div className="relative h-40">
                  <Image src={`https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400`} alt="Related" fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h4 className="font-bold group-hover:text-accent transition-colors line-clamp-2">Effective Leadership in a Digital World</h4>
                  <Link href={`/workshops/${id}`} className="text-accent text-sm font-bold mt-4 inline-block">Read More →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
