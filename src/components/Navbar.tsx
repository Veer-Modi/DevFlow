"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getToken, removeToken, getUser } from '@/utils/authClient';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
    if (token) {
      const user = getUser();
      setIsAdmin(user?.role === 'admin');
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="bg-[#0B0F17]/80 backdrop-blur-md border-b border-[rgba(255,255,255,0.05)] sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 group">
              <span className="text-white font-extrabold text-xl tracking-tight transition-all duration-200 group-hover:text-[#6366F1]">
                DevFlow<span className="text-[#6366F1]">.</span>
              </span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-6">
              <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Feed
              </Link>
              <Link href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Explore
              </Link>
            </div>
          </div>
          
          <div className="flex-1 max-w-xl mx-8 hidden sm:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-500 group-focus-within:text-[#6366F1] transition-colors" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-[rgba(255,255,255,0.1)] rounded-full leading-5 bg-[#0F172A] text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-[#111827] focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] sm:text-sm transition-all duration-200 ease-in-out hover:bg-[#111827]"
                placeholder="Search community..."
                type="search"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-5">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="text-red-400 hover:text-red-300 px-3 py-1.5 rounded-full text-xs font-semibold border border-red-900/50 hover:bg-red-900/20 hover:border-red-500/50 transition-all duration-200">
                    Admin
                  </Link>
                )}

                <Link href="/create" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                  Create Post
                </Link>

                <div className="flex items-center justify-center p-1 hover:bg-[#0F172A] rounded-full transition-colors cursor-pointer">
                  <NotificationBell />
                </div>

                <div className="relative">
                  <button onClick={handleLogout} className="text-sm font-medium text-gray-400 hover:text-white px-3 py-2 rounded-md hover:bg-[#0F172A] transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-[#0F172A]">
                  Log in
                </Link>
                <Link href="/register" className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
