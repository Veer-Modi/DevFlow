"use client";

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, TrendingUp, Compass, Plus, ArrowRight, Flame } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('latest');
  const router = useRouter();
  const { user } = useAuth();

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

  const handleCreatePost = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/create');
    } else {
      router.push('/login');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden subtle-grid py-20 sm:py-32 border-b border-gray-200 dark:border-[rgba(255,255,255,0.05)] bg-white dark:bg-[#0B0F17]">
        {/* Abstract animated glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10a37f]/20 rounded-full blur-[120px] opacity-50 pointer-events-none mix-blend-screen dark:mix-blend-color-dodge"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10a37f]/10 text-[#10a37f] text-sm font-semibold mb-6 border border-[#10a37f]/20"
          >
            <Sparkles size={14} /> The New DevFlow is Here
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 text-gray-900 dark:text-white"
          >
            Solve Problems. <br className="hidden sm:block" />
            <span className="hero-gradient">Ship Faster.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto mb-10"
          >
            Join the elite community of developers asking tough questions, sharing architectural patterns, and building the future together.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={handleCreatePost} 
              className="w-full sm:w-auto bg-[#10a37f] hover:bg-[#0e906f] text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 active:scale-95 shadow-lg shadow-[#10a37f]/20 flex items-center justify-center gap-2"
            >
              Start a Discussion <ArrowRight size={18} />
            </button>
            <a href="#feed" className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 dark:bg-[#171717] dark:hover:bg-[#212121] text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-[rgba(255,255,255,0.1)] px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2">
              <Compass size={18} /> Explore Feed
            </a>
          </motion.div>
        </div>
      </section>

      {/* Main Feed Container */}
      <main id="feed" className="flex-1 max-w-5xl mx-auto px-4 w-full py-16 scroll-mt-20">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-[rgba(255,255,255,0.05)] gap-4">
          <div className="flex items-center gap-6 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <button 
              onClick={() => setSort('latest')}
              className={`flex items-center gap-2 text-sm font-semibold pb-4 -mb-[18px] transition-colors border-b-2 whitespace-nowrap ${sort === 'latest' ? 'border-[#10a37f] text-[#10a37f]' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
            >
              <TrendingUp size={16} /> Latest Updates
            </button>
            <button 
              onClick={() => setSort('most_viewed')}
              className={`flex items-center gap-2 text-sm font-semibold pb-4 -mb-[18px] transition-colors border-b-2 whitespace-nowrap ${sort === 'most_viewed' ? 'border-[#10a37f] text-[#10a37f]' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
            >
              <Flame size={16} /> Most Viewed
            </button>
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 px-6 py-4 rounded-xl mb-8 flex items-start">
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white dark:bg-[#171717] rounded-2xl h-32 animate-pulse shadow-sm border border-gray-200 dark:border-[rgba(255,255,255,0.05)] p-6 flex flex-col justify-between">
                <div>
                  <div className="h-5 bg-gray-200 dark:bg-[#212121] rounded w-2/3 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-[#212121] rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-[#212121] rounded w-4/5"></div>
                </div>
                <div className="flex gap-4 mt-4">
                  <div className="h-4 w-16 bg-gray-200 dark:bg-[#212121] rounded-full"></div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-[#212121] rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 px-6 bg-white dark:bg-[#171717] rounded-3xl shadow-sm border border-gray-200 dark:border-[rgba(255,255,255,0.05)]"
          >
            <div className="mx-auto h-24 w-24 bg-[#10a37f]/10 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="h-12 w-12 text-[#10a37f]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">The Feed is Quiet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
              Be the pioneer. Start the first conversation and help set the standard for the community.
            </p>
            <button 
              onClick={handleCreatePost} 
              className="inline-flex items-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 active:scale-95 cursor-pointer shadow-lg"
            >
              <Plus size={20} className="mr-2" /> Create First Post
            </button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {posts.map((post) => (
              <motion.div key={post._id} variants={itemVariants}>
                <PostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
