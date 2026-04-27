'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Target, Eye, Shield, History, CheckCircle2, Cpu, GraduationCap, Globe2, BarChart3 } from 'lucide-react';
import Partners from '@/sections/home/Partners';

const strategicObjectives = [
  "Develop the technical and managerial skills of African Road Funds.",
  "Ensure the professionalization and certification of agents.",
  "Promote digitalization and innovation in road management.",
  "Strengthen cooperation, harmonization and sharing of experiences.",
  "Contribute to the sustainability and resilience of road infrastructure."
];

const strategicAxes = [
  {
    title: "Axis 1: Technical Skills",
    description: "Maintenance, road safety, climate resilience and infrastructure modernization.",
    icon: Shield,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Axis 2: Governance & Management",
    description: "Sustainable financing, institutional governance, and transparency standards.",
    icon: BarChart3,
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Axis 3: Digital Innovation",
    description: "Digital platforms, digital marketing, and community management integration.",
    icon: Cpu,
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    title: "Axis 4: Professional Certification",
    description: "RBM, quality systems, HRM, public management, and academic accreditations.",
    icon: GraduationCap,
    color: "bg-green-500/10 text-green-600",
  }
];

export default function AboutPage() {
  return (
    <main className="pt-24 bg-white overflow-hidden">
      {/* Page Header */}
      <section className="relative py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent"></div>
        </div>
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-accent/20 text-accent text-xs font-black uppercase tracking-[0.3em] mb-6">About the Academy</span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              Strengthening <span className="text-accent">African Road Funds</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
              Through the AFERA Innov Academy, ARMFA is committed to sustainably strengthening the institutional and human capacities of Road Funds across the continent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Strategic Vision */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-accent font-black uppercase tracking-[0.2em] text-xs mb-4">Our Commitment</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
                  Addressing Global Challenges through Specialized Education
                </h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                Road Maintenance Funds today face unprecedented challenges: climate resilience, sustainable finance, technological innovation, and the absolute need for transparent governance. 
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                  "Efficiency in Management",
                  "Modernized Governance",
                  "Digital Integration",
                  "International Standards"
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <CheckCircle2 className="text-accent w-5 h-5 shrink-0" />
                    <span className="text-sm font-bold text-primary">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
               <div className="absolute -inset-4 bg-accent/10 rounded-[40px] rotate-3 -z-10"></div>
               <div className="relative bg-white p-4 rounded-[40px] shadow-2xl border border-gray-100">
                  <Image src="/LOGO1.png" alt="AFERA Academy" width={800} height={600} className="w-full rounded-[30px]" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Objectives */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-accent font-black uppercase tracking-[0.2em] text-xs mb-4">Core Strategy</h2>
            <h3 className="text-4xl font-bold text-white">Strategic Objectives</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {strategicObjectives.map((obj, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 p-8 rounded-[30px] hover:bg-white/10 transition-colors group"
              >
                <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <Target size={24} />
                </div>
                <p className="text-white font-medium leading-relaxed">{obj}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Axes */}
      <section className="py-32">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-accent font-black uppercase tracking-[0.2em] text-xs mb-4">Roadmap</h2>
            <h3 className="text-4xl font-bold text-primary mb-6">Strategic Directions</h3>
            <p className="text-gray-500">Our roadmap is built on four core axes that define the future of infrastructure management in Africa.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {strategicAxes.map((axis, i) => (
              <div key={i} className="group p-8 bg-white border border-gray-100 rounded-[40px] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${axis.color}`}>
                  <axis.icon size={28} />
                </div>
                <h4 className="text-xl font-bold text-primary mb-4">{axis.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{axis.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <div className="pb-24">
        <div className="text-center mb-16">
          <h2 className="text-accent font-black uppercase tracking-[0.2em] text-xs mb-4">Our Ecosystem</h2>
          <h3 className="text-3xl font-bold text-primary">Institutional Partners</h3>
        </div>
        <Partners />
      </div>
    </main>
  );
}

