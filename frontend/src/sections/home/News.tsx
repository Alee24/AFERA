'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, User, ArrowRight, Presentation, FileText, Eye, Download, X } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    title: "ARMFA 22nd AGM Liberia - Namibia Case Study",
    excerpt: "Detailed case study on road maintenance financing presented at the 2025 ARMFA AGM.",
    date: "Nov 12, 2025",
    author: "Sophia Tekie",
    type: "PPTX",
    filename: "ARMFA-22nd-AGM-Liberia-17-21-Nov-2025-Sophia-Tekie-Namibia.pptx",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Cost Estimation for Roadworks in Kenya",
    excerpt: "Technical presentation regarding the optimized cost estimation models for East African infrastructure.",
    date: "Nov 19, 2025",
    author: "Technical Committee",
    type: "PPTX",
    filename: "ARMFA-PPT-COST-ESTIMATION-FOR-ROADWORKS-IN-KENYA-19TH-NOV.pptx",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "AFERA Innov Centre Academy Vision",
    excerpt: "The institutional roadmap for 2026-2030, detailing our expansion into digital learning.",
    date: "Sep 28, 2025",
    author: "Directorate",
    type: "PPTX",
    filename: "Centre-Academy-AFERA-Innov.pptx",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "Gouvernance des FER - Maurice Niaty Mouamba",
    excerpt: "An in-depth analysis of Road Fund Governance models presented by Maurice Niaty Mouamba.",
    date: "Oct 15, 2025",
    author: "Maurice Niaty",
    type: "PPTX",
    filename: "La-Gouvernance-des-FER-Maurice-Niaty-Mouamba.pptx",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    title: "Modèle de Financement Péage FER SA Guinée",
    excerpt: "Presentation on the innovative toll financing model implemented by the Guinea Road Fund.",
    date: "Nov 05, 2025",
    author: "Finance Dept",
    type: "PPTX",
    filename: "MODELE-DE-FINANCEMENT-PEAGE-FER-SA-GUINEE.pptx",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    title: "Road Fund Performance & Capacity Building",
    excerpt: "Academic research on building sustainable capacity within African Road Maintenance Funds.",
    date: "Nov 21, 2025",
    author: "Prof. Angelo",
    type: "PPTX",
    filename: "PRESENTATION-3-PROF-ANGELO-PRES-SCIENTIFIC-COMMITTEE-ARMFA-Mission_-PrAngelo-Road-Fund-Performance-and-Capacity-Building.pptx",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
  }
];

export default function News() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  // Auto-rotation every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 3 >= newsItems.length ? 0 : prev + 3));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const visibleItems = newsItems.slice(currentIndex, currentIndex + 3);

  const getViewerUrl = (filename: string) => {
    if (typeof window === 'undefined') return '';
    const fileUrl = `${window.location.origin}/${filename}`;
    return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`;
  };

  return (
    <section className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-accent font-semibold tracking-wide uppercase mb-3">News & Events</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-primary">
              Stay Updated with Campus Life
            </h3>
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex space-x-1 mr-4">
                {Array.from({ length: Math.ceil(newsItems.length / 3) }).map((_, i) => (
                   <button 
                     key={i} 
                     onClick={() => setCurrentIndex(i * 3)}
                     className={`w-2 h-2 rounded-full transition-all ${currentIndex === i * 3 ? 'w-6 bg-accent' : 'bg-gray-200'}`}
                   />
                ))}
             </div>
             <Button variant="outline" className="rounded-full">
               View All News
             </Button>
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {visibleItems.map((item) => (
                <Card key={item.id} className="group overflow-hidden border-none shadow-premium h-full flex flex-col hover:shadow-2xl transition-all duration-500 rounded-[32px]">
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                       <button 
                         onClick={() => setSelectedDoc(item)}
                         className="p-3 bg-white text-primary rounded-xl hover:bg-accent hover:text-white transition-all shadow-lg"
                       >
                          <Eye size={20} />
                       </button>
                       <a 
                         href={`/${item.filename}`} 
                         download 
                         className="p-3 bg-white text-primary rounded-xl hover:bg-accent hover:text-white transition-all shadow-lg"
                       >
                          <Download size={20} />
                       </a>
                    </div>
                    <div className="absolute top-4 left-4 bg-accent text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                      {item.type} Resource
                    </div>
                  </div>
                  <CardHeader className="pt-8 px-8">
                    <div className="flex items-center space-x-4 text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest">
                      <span className="flex items-center bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                        <Calendar size={12} className="mr-1.5 text-accent" /> {item.date}
                      </span>
                      <span className="flex items-center bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                        <User size={12} className="mr-1.5 text-accent" /> {item.author}
                      </span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-accent transition-colors leading-tight font-bold">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 flex-1">
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter className="px-8 pb-8 pt-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedDoc(item)}
                      className="p-0 text-primary font-black text-xs uppercase tracking-widest group-hover:text-accent flex items-center"
                    >
                      View Presentation <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Presentation Viewer Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-primary/60 backdrop-blur-md"
               onClick={() => setSelectedDoc(null)}
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 30 }}
               className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
             >
                <div className="p-6 md:px-10 border-b border-gray-100 flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                         <Presentation size={20} />
                      </div>
                      <div>
                         <h4 className="font-bold text-primary leading-none mb-1">{selectedDoc.title}</h4>
                         <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">AFERA Resource Library • {selectedDoc.type}</p>
                      </div>
                   </div>
                   <div className="flex items-center space-x-3">
                      <a 
                        href={`/${selectedDoc.filename}`} 
                        download 
                        className="p-3 bg-gray-50 hover:bg-primary hover:text-white rounded-xl transition-all text-gray-500 hidden sm:flex items-center text-xs font-bold"
                      >
                         <Download size={16} className="mr-2" /> Download PPT
                      </a>
                      <button 
                        onClick={() => setSelectedDoc(null)}
                        className="p-3 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all text-gray-500"
                      >
                         <X size={20} />
                      </button>
                   </div>
                </div>
                <div className="flex-1 bg-gray-100 relative">
                   <iframe 
                     src={getViewerUrl(selectedDoc.filename)} 
                     className="w-full h-full border-none"
                     title="Document Viewer"
                   />
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

