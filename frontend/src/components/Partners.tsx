'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const partners = [
  { src: "/P1.png", alt: "Partner 1" },
  { src: "/P2.jpg", alt: "Partner 2" },
  { src: "/P3.jpg", alt: "Partner 3" },
  { src: "/P4.jpg", alt: "Partner 4" },
  { src: "/P5.png", alt: "Partner 5" },
];

export default function Partners() {
  // Create a tripled list to ensure enough content for smooth scrolling
  const scrollingPartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 text-center mb-12">
        <h2 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Our Trusted Partners</h2>
        <div className="h-1 w-12 bg-accent mx-auto"></div>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        <motion.div 
          className="flex whitespace-nowrap space-x-16 items-center py-4"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {scrollingPartners.map((partner, i) => (
            <div key={i} className="flex-shrink-0 w-40 h-20 relative grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
              <Image
                src={partner.src}
                alt={partner.alt}
                fill
                className="object-contain px-4"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
