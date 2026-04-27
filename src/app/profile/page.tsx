"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User as UserIcon, Calendar, MessageSquare, Heart, Settings, ShieldAlert, BookOpen } from 'lucide-react';
import api from '@/utils/api';
import Link from 'next/link';
import PostCard from '@/components/PostCard';

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('posts');
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && activeTab === 'posts') {
      fetchUserPosts();
    }
  }, [user, activeTab]);

  const fetchUserPosts = async () => {
    setLoadingPosts(true);
    try {
      // In a real app, you would have an endpoint like /users/me/posts
      // For now, we fetch all posts and filter (just as an example if endpoint missing)
      const res = await api.get('/posts');
      const filtered = res.data.posts.filter((p: any) => p.author?._id === user?.userId);
      setUserPosts(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-[#0B0F17]">
        <div className="w-10 h-10 border-4 border-[#10a37f]/30 border-t-[#10a37f] rounded-full animate-spin"></div>
      </div>
    );
  }

  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0B0F17]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#171717] rounded-3xl p-8 sm:p-10 border border-gray-200 dark:border-[rgba(255,255,255,0.05)] shadow-sm mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#10a37f]/20 to-teal-900/40"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-12">
            <div className="w-32 h-32 bg-white dark:bg-[#212121] rounded-full border-4 border-white dark:border-[#171717] shadow-xl flex items-center justify-center overflow-hidden shrink-0">
              <UserIcon size={64} className="text-gray-400 dark:text-gray-500" />
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.username}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar size={16} /> Joined {joinDate}
                </span>
                {user.role === 'admin' && (
                  <span className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-md">
                    <ShieldAlert size={16} /> Community Admin
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/settings" className="px-4 py-2 bg-gray-100 dark:bg-[#212121] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors flex items-center gap-2">
                <Settings size={16} /> Edit Profile
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200 dark:border-[rgba(255,255,255,0.05)] mb-8">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'posts' ? 'border-[#10a37f] text-[#10a37f]' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
          >
            <BookOpen size={18} /> My Posts
          </button>
          <button 
            onClick={() => setActiveTab('activity')}
            className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'activity' ? 'border-[#10a37f] text-[#10a37f]' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
          >
            <MessageSquare size={18} /> Recent Activity
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'saved' ? 'border-[#10a37f] text-[#10a37f]' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
          >
            <Heart size={18} /> Saved
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'posts' && (
            loadingPosts ? (
              <div className="space-y-4">
                {[1, 2].map(n => (
                  <div key={n} className="bg-white dark:bg-[#171717] h-32 rounded-2xl animate-pulse border border-gray-200 dark:border-[rgba(255,255,255,0.05)]"></div>
                ))}
              </div>
            ) : userPosts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-[rgba(255,255,255,0.05)] shadow-sm">
                <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't published any posts yet.</p>
                <Link href="/create" className="text-[#10a37f] font-medium hover:underline">Write your first post</Link>
              </div>
            ) : (
              <div className="space-y-6">
                {userPosts.map(post => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )
          )}
          
          {activeTab === 'activity' && (
            <div className="text-center py-16 bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-[rgba(255,255,255,0.05)] shadow-sm">
              <p className="text-gray-500 dark:text-gray-400">Activity history is coming soon.</p>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="text-center py-16 bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-[rgba(255,255,255,0.05)] shadow-sm">
              <p className="text-gray-500 dark:text-gray-400">Saved posts feature is coming soon.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
