'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, User, ArrowRight } from 'lucide-react';

const news = [
  {
    title: "AFERA INNOV ACADEMY Ranked Top 5 for Innovation",
    excerpt: "Our commitment to research and technology has been recognized in the latest global university rankings.",
    date: "Oct 12, 2026",
    author: "Admin",
    image: "https://images.unsplash.com/photo-1523050853064-dbad323b7ff3?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "New Research Center for AI and Ethics",
    excerpt: "Opening this fall, the center will explore the societal impact of artificial intelligence.",
    date: "Oct 08, 2026",
    author: "Dr. Jane Smith",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Campus Re-opening: What You Need to Know",
    excerpt: "Guidelines and safety protocols for the upcoming semester as we welcome students back.",
    date: "Sep 28, 2026",
    author: "Campus Life",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
  }
];

export default function News() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-accent font-semibold tracking-wide uppercase mb-3">News & Events</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-primary">
              Stay Updated with Campus Life
            </h3>
          </div>
          <Button variant="outline" className="rounded-full">
            View All News
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group overflow-hidden border-none shadow-premium h-full">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                    Latest News
                  </div>
                </div>
                <CardHeader className="pt-6">
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center"><Calendar size={14} className="mr-1" /> {item.date}</span>
                    <span className="flex items-center"><User size={14} className="mr-1" /> {item.author}</span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-accent transition-colors leading-tight">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                    {item.excerpt}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="p-0 text-primary font-bold group-hover:text-accent flex items-center">
                    Read More <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
