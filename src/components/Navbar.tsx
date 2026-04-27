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
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-white font-bold text-xl tracking-tight">DevFlow</span>
            </Link>
          </div>
          
          <div className="flex-1 max-w-lg mx-8 hidden sm:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Search posts..."
                type="search"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="text-red-400 hover:text-red-300 px-3 py-2 rounded-md text-sm font-medium border border-red-900 hover:bg-red-900/30 transition-colors">
                    Admin
                  </Link>
                )}

                <Link href="/create" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium border border-gray-700 hover:bg-gray-800 transition-colors">
                  Create Post
                </Link>

                <NotificationBell />

                <div className="relative">
                  <button onClick={handleLogout} className="text-sm font-medium text-gray-300 hover:text-white px-3 py-2 rounded-md">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
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
