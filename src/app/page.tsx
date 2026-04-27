"use client";

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('latest');

  useEffect(() => {
    fetchPosts();
  }, [sort]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/posts?sort=${sort}`);
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error('Failed to fetch posts', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden subtle-grid py-16 sm:py-24 border-b border-[rgba(255,255,255,0.05)] bg-[#0B0F17]">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-white">Build</span>{' '}
            <span className="hero-gradient">Together.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 font-medium max-w-2xl mx-auto mb-10">
            Ask questions, share knowledge, and solve problems with a community of world-class developers.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/create" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-8 py-3.5 rounded-full font-bold shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-200">
              Start a Discussion
            </Link>
            <a href="#feed" className="bg-[#111827] hover:bg-[#1E293B] text-gray-300 border border-[rgba(255,255,255,0.1)] px-8 py-3.5 rounded-full font-bold transition-all duration-200">
              Explore Feed
            </a>
          </div>
        </div>
      </section>

      {/* Main Feed Container */}
      <main id="feed" className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-[rgba(255,255,255,0.05)] space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-100 flex items-center">
            <svg className="w-6 h-6 mr-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Community Posts
          </h2>
          <div className="relative group">
            <label htmlFor="sort" className="sr-only">Sort by</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </div>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none block w-full sm:w-auto pl-10 pr-10 py-2.5 bg-[#0F172A] border border-[rgba(255,255,255,0.1)] text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg text-sm font-medium transition-colors hover:bg-[#111827] cursor-pointer"
            >
              <option value="latest">Latest Updates</option>
              <option value="most_viewed">Most Viewed</option>
            </select>
            {/* Custom select arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl mb-8 flex items-start">
            <svg className="h-5 w-5 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#111827] rounded-xl p-6 border border-[rgba(255,255,255,0.05)] animate-pulse shadow-md">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-10 w-10 bg-[#1E293B] rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-[#1E293B] rounded w-32"></div>
                    <div className="h-3 bg-[#1E293B] rounded w-24"></div>
                  </div>
                </div>
                <div className="h-6 bg-[#1E293B] rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-[#1E293B] rounded w-full mb-2"></div>
                <div className="h-4 bg-[#1E293B] rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 px-6 bg-[#111827] rounded-2xl shadow-xl border border-[rgba(255,255,255,0.05)]">
            <div className="mx-auto h-20 w-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
              <svg className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">It's quiet in here...</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Be the first to share a coding challenge, insight, or question with the community.
            </p>
            <Link href="/create" className="inline-flex items-center bg-[#6366F1] hover:bg-[#4F46E5] text-white px-6 py-3 rounded-full font-bold transition-all duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
