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
  // Triple the partners for smooth infinite scrolling
  const scrollingPartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-16 bg-white dark:bg-slate-900 overflow-hidden border-t border-gray-100 dark:border-slate-800">
      <div className="container mx-auto px-4 text-center mb-10">
        <h2 className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Our Strategic Partners</h2>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        <motion.div 
          className="flex whitespace-nowrap space-x-20 items-center"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {scrollingPartners.map((partner, i) => (
            <div key={i} className="flex-shrink-0 w-36 h-16 relative transition-transform duration-300 hover:scale-110">
              <Image
                src={partner.src}
                alt={partner.alt}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
