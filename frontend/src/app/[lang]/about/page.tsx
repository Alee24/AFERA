'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Target, Eye, Heart, History } from 'lucide-react';
import Partners from '@/sections/home/Partners';

const values = [
  {
    title: "Our Mission",
    description: "To provide accessible, high-quality education that empowers individuals to lead and innovate in a global society.",
    icon: Target,
    color: "text-blue-600",
  },
  {
    title: "Our Vision",
    description: "To be a world-renowned institution recognized for excellence in research, teaching, and social impact.",
    icon: Eye,
    color: "text-accent",
  },
  {
    title: "Our Values",
    description: "Integrity, innovation, diversity, and excellence guide everything we do as an academic community.",
    icon: Heart,
    color: "text-red-600",
  }
];

const timeline = [
  { year: "2001", event: "AFERA INNOV ACADEMY founded with 3 faculties." },
  { year: "2010", event: "Acquisition of main campus and expansion to 10 departments." },
  { year: "2018", event: "Launch of the Innovation & Research Hub." },
  { year: "2024", event: "Global recognition as a top-tier educational institution." }
];

export default function AboutPage() {
  return (
    <main className="pt-24">
      {/* Page Header */}
      <section className="relative py-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="/hero-bg.png" alt="Overlay" fill className="object-cover" />
          <div className="absolute inset-0 bg-primary mix-blend-multiply"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">About Us</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover the history, values, and community that make AFERA INNOV ACADEMY a unique place to learn and grow.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image src="/LOGO1.png" alt="University Campus" width={800} height={600} className="w-full object-cover rounded-3xl" />
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">A Legacy of Knowledge</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                AFERA INNOV ACADEMY is more than just an educational institution; it's a community of thinkers, creators, and leaders. For over two decades, we have been at the forefront of academic excellence, providing students with a transformative experience that extends beyond the classroom.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our campus is a hub of diversity and innovation, where students from all walks of life come together to solve complex problems and prepare for their future careers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full text-center p-8 border-none shadow-premium">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mb-6 ${value.color}`}>
                    <value.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <Partners />

      {/* History Timeline */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-accent font-semibold uppercase tracking-widest mb-4">Our History</h2>
            <h3 className="text-3xl sm:text-4xl font-bold">Milestones of Progress</h3>
          </div>
          <div className="relative border-l-2 border-white/20 ml-4 md:ml-0 md:flex md:border-l-0 md:border-t-2 md:pt-8 md:justify-between">
            {timeline.map((item, i) => (
              <div key={i} className="relative pl-8 mb-12 md:mb-0 md:pl-0 md:w-1/4">
                <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-accent md:top-[-41px] md:left-1/2 md:-ml-2"></div>
                <div className="text-3xl font-bold text-accent mb-2 md:text-center">{item.year}</div>
                <p className="text-gray-300 md:text-center px-4">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
