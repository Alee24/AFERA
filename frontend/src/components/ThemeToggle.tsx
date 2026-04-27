'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-accent dark:hover:text-accent transition-all shadow-sm border border-transparent hover:border-accent/20"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon size={20} className="fill-current" />
      ) : (
        <Sun size={20} className="fill-current" />
      )}
    </motion.button>
  );
}
