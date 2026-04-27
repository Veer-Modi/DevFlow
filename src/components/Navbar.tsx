"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { Search, User as UserIcon, Settings, LogOut, Code, Hash, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white/80 dark:bg-[#0B0F17]/80 backdrop-blur-xl border-b border-gray-200 dark:border-[rgba(255,255,255,0.05)] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Primary Links */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 group flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#10a37f] to-teal-900 rounded-lg flex items-center justify-center shadow-lg shadow-[#10a37f]/20">
                <Code size={18} className="text-white" />
              </div>
              <span className="text-gray-900 dark:text-white font-extrabold text-xl tracking-tight">
                DevFlow
              </span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-1">
              <Link href="/" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-[#1f1f1f] transition-colors">
                Feed
              </Link>
              <Link href="/explore" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition-colors">
                Explore
              </Link>
            </div>
          </div>
          
          {/* Advanced Search */}
          <div className="flex-1 max-w-xl mx-8 hidden sm:block relative" ref={searchRef}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className={`transition-colors ${isSearchFocused ? 'text-[#10a37f]' : 'text-gray-400'}`} />
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-[rgba(255,255,255,0.1)] rounded-xl leading-5 bg-gray-50 dark:bg-[#171717] text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-[#1f1f1f] focus:ring-2 focus:ring-[#10a37f]/50 focus:border-[#10a37f] sm:text-sm transition-all duration-200"
                placeholder="Search community..."
                type="search"
                onFocus={() => setIsSearchFocused(true)}
              />
            </div>

            {/* Search Dropdown */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#171717] rounded-xl shadow-2xl border border-gray-200 dark:border-[rgba(255,255,255,0.05)] overflow-hidden z-50 p-2"
                >
                  <div className="p-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Flame size={12} className="text-orange-500" /> Trending Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['react', 'nextjs', 'typescript', 'architecture'].map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-[#212121] text-xs rounded-md text-gray-600 dark:text-gray-300 hover:bg-[#10a37f]/10 hover:text-[#10a37f] cursor-pointer transition-colors flex items-center gap-1">
                          <Hash size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {!loading && user ? (
              <>
                <Link href="/create" className="hidden sm:flex bg-[#10a37f] hover:bg-[#0e906f] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 items-center shadow-lg shadow-[#10a37f]/20">
                  New Post
                </Link>

                <div className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors cursor-pointer">
                  <NotificationBell />
                </div>

                <ThemeToggle />

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#10a37f] overflow-hidden"
                  >
                    <UserIcon size={16} className="text-gray-600 dark:text-gray-300" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-[rgba(255,255,255,0.05)] overflow-hidden z-50 py-1"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-[rgba(255,255,255,0.05)]">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.username || 'Developer'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email || 'user@devflow.com'}</p>
                        </div>
                        
                        <div className="py-1">
                          <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#212121] transition-colors">
                            <UserIcon size={16} className="mr-3" /> Your Profile
                          </Link>
                          {user.role === 'admin' && (
                            <Link href="/admin" className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                              <Settings size={16} className="mr-3" /> Admin Dashboard
                            </Link>
                          )}
                        </div>
                        
                        <div className="border-t border-gray-100 dark:border-[rgba(255,255,255,0.05)] py-1">
                          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#212121] transition-colors">
                            <LogOut size={16} className="mr-3" /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : !loading ? (
              <>
                <ThemeToggle />
                <Link href="/login" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-[#1f1f1f]">
                  Log in
                </Link>
                <Link href="/register" className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md">
                  Sign up
                </Link>
              </>
            ) : (
              <div className="w-10 h-10"></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
