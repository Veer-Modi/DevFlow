"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Moon, Sun, Monitor, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9"></div>;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#10a37f] flex items-center justify-center"
        aria-label="Theme menu"
      >
        {resolvedTheme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg bg-white dark:bg-[#171717] border border-gray-200 dark:border-[rgba(255,255,255,0.05)] overflow-hidden z-50 py-1"
          >
            <div className="px-3 py-2 border-b border-gray-100 dark:border-[rgba(255,255,255,0.05)] mb-1">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center">
                <Palette size={12} className="mr-1.5" /> Appearance
              </p>
            </div>
            
            <button
              onClick={() => { setTheme('light'); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm flex items-center transition-colors ${theme === 'light' ? 'text-[#10a37f] bg-[#10a37f]/10 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#212121]'}`}
            >
              <Sun size={16} className="mr-3" /> Light
            </button>
            <button
              onClick={() => { setTheme('dark'); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm flex items-center transition-colors ${theme === 'dark' ? 'text-[#10a37f] bg-[#10a37f]/10 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#212121]'}`}
            >
              <Moon size={16} className="mr-3" /> Dark
            </button>
            <button
              onClick={() => { setTheme('system'); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm flex items-center transition-colors ${theme === 'system' ? 'text-[#10a37f] bg-[#10a37f]/10 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#212121]'}`}
            >
              <Monitor size={16} className="mr-3" /> System
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
