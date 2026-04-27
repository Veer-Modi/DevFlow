"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-md border-b border-gray-200 dark:border-[rgba(255,255,255,0.05)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 group">
              <span className="text-gray-900 dark:text-white font-extrabold text-xl tracking-tight transition-all duration-200 group-hover:text-[#10a37f]">
                DevFlow<span className="text-[#10a37f]">.</span>
              </span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-6">
              <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                Feed
              </Link>
              <Link href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                Explore
              </Link>
            </div>
          </div>
          
          <div className="flex-1 max-w-xl mx-8 hidden sm:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400 group-focus-within:text-[#10a37f] transition-colors" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-[rgba(255,255,255,0.1)] rounded-full leading-5 bg-gray-50 dark:bg-[#171717] text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-[#1f1f1f] focus:ring-1 focus:ring-[#10a37f] focus:border-[#10a37f] sm:text-sm transition-all duration-200 ease-in-out hover:bg-white dark:hover:bg-[#1f1f1f]"
                placeholder="Search community..."
                type="search"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-5">
            {!loading && user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-3 py-1.5 rounded-full text-xs font-semibold border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200">
                    Admin
                  </Link>
                )}

                <Link href="/create" className="bg-[#10a37f] hover:bg-[#0e906f] text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200">
                  Create Post
                </Link>

                <div className="flex items-center justify-center p-1 hover:bg-gray-100 dark:hover:bg-[#1f1f1f] rounded-full transition-colors cursor-pointer">
                  <NotificationBell />
                </div>

                <ThemeToggle />

                <div className="relative">
                  <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : !loading ? (
              <>
                <ThemeToggle />
                <Link href="/login" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-[#1f1f1f]">
                  Log in
                </Link>
                <Link href="/register" className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200">
                  Sign up
                </Link>
              </>
            ) : (
              <div className="w-10 h-10"></div> // Loading placeholder
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
