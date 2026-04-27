"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import api from '@/utils/api';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ReplyCard from '@/components/ReplyCard';
import ReplyForm from '@/components/ReplyForm';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Eye, Clock, User as UserIcon } from 'lucide-react';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingReplies, setLoadingReplies] = useState(true);
  
  const [error, setError] = useState('');
  const [repliesError, setRepliesError] = useState('');

  const { user: currentUser } = useAuth();

  const fetchPost = useCallback(async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } catch (err: any) {
      console.error('Fetch post error:', err);
      setError(err.response?.data?.error || 'Failed to load post.');
    } finally {
      setLoadingPost(false);
    }
  }, [id]);

  const fetchReplies = useCallback(async () => {
    setLoadingReplies(true);
    setRepliesError('');
    try {
      const res = await api.get(`/posts/${id}/replies`);
      setReplies(res.data || []);
    } catch (err: any) {
      console.error('Fetch replies error:', err);
      setRepliesError('Failed to load replies.');
    } finally {
      setLoadingReplies(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchReplies();
    }
  }, [id, fetchPost, fetchReplies]);

  const handleReplySubmit = async (content: string, images: string[]) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticReply = {
      _id: tempId,
      content,
      images,
      user_id: currentUser ? { _id: currentUser.id, username: currentUser.username, full_name: currentUser.username } : null,
      created_at: new Date().toISOString(),
      isOptimistic: true
    };

    setReplies(prev => [...prev, optimisticReply]);

    try {
      const res = await api.post(`/posts/${id}/replies`, { content, images });
      setReplies(prev => prev.map(r => r._id === tempId ? res.data : r));
      toast.success('Reply added successfully!');
    } catch (err: any) {
      setReplies(prev => prev.filter(r => r._id !== tempId));
      toast.error(err.response?.data?.error || 'Failed to post reply.');
      throw err;
    }
  };

  const handleReplyDelete = async (replyId: string) => {
    const replyToDelete = replies.find(r => r._id === replyId);
    if (!replyToDelete) return;

    setReplies(prev => prev.filter(r => r._id !== replyId));

    try {
      await api.delete(`/replies/${replyId}`);
      toast.success('Reply deleted');
    } catch (err: any) {
      setReplies(prev => [...prev, replyToDelete].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
      toast.error(err.response?.data?.error || 'Failed to delete reply');
    }
  };

  const timeSince = (dateStr: string) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "just now";
  };

  if (loadingPost) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white dark:bg-[#171717] rounded-3xl p-8 border border-gray-200 dark:border-[rgba(255,255,255,0.05)] animate-pulse shadow-sm">
          <div className="h-10 bg-gray-200 dark:bg-[#212121] rounded w-3/4 mb-6"></div>
          <div className="flex space-x-4 mb-8">
             <div className="h-12 w-12 bg-gray-200 dark:bg-[#212121] rounded-full"></div>
             <div className="h-8 bg-gray-200 dark:bg-[#212121] rounded w-32 mt-2"></div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-[#212121] rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-[#212121] rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-[#212121] rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 text-center">
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 px-4 py-12 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">{error || 'Post not found'}</h2>
          <Link href="/" className="inline-flex items-center text-[#10a37f] hover:text-[#0e906f] font-medium transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-8 px-4 sm:px-6"
    >
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 mb-6 transition-colors">
        <ArrowLeft size={16} className="mr-1.5" /> Back to feed
      </Link>

      <div className="bg-white dark:bg-[#171717] shadow-lg rounded-3xl overflow-hidden mb-8 border border-gray-200 dark:border-[rgba(255,255,255,0.05)] relative">
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#10a37f] to-[#10a37f]/50" />
        
        <div className="p-6 sm:p-10 border-b border-gray-200 dark:border-[rgba(255,255,255,0.05)]">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags?.map((tag: string, index: number) => (
              <span key={index} className="px-3 py-1 rounded-md text-xs font-mono font-medium tracking-wide bg-[#10a37f]/10 text-[#10a37f] border border-[#10a37f]/20">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 border-b border-gray-200 dark:border-[rgba(255,255,255,0.05)] pb-8">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#10a37f]/20 to-teal-900/40 flex items-center justify-center text-[#10a37f] font-bold text-lg uppercase shadow-inner border border-[#10a37f]/20">
                {(post.user_id?.full_name || post.user_id?.username || 'U')[0]}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 dark:text-gray-100 text-base">
                  {post.user_id?.full_name || post.user_id?.username || 'Unknown User'}
                </span>
                <span className="text-xs flex items-center gap-1 mt-0.5">
                  <Clock size={12} /> {timeSince(post.created_at)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-gray-50 dark:bg-[#212121] px-4 py-2 rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.03)] text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1.5 font-medium">
                <Eye size={16} className="text-[#10a37f]" /> {post.view_count || 0}
              </div>
            </div>
          </div>

          <div className="prose prose-base sm:prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {post.description}
          </div>

          {post.images && post.images.length > 0 && (
            <div className="mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2">
              {post.images.map((img: string, idx: number) => (
                <img key={idx} src={img} alt={`Post attachment ${idx + 1}`} className="rounded-2xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] w-full object-cover shadow-md hover:shadow-xl transition-shadow" />
              ))}
            </div>
          )}
        </div>

        {/* Replies Section */}
        <div className="bg-gray-50/50 dark:bg-[#0B0F17]/30 p-6 sm:p-10 relative">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
            <MessageSquare size={24} className="text-[#10a37f]" />
            Discussion <span className="text-gray-400 font-normal text-lg">({replies.length})</span>
          </h3>
          
          {repliesError && (
            <div className="text-red-600 dark:text-red-400 text-sm mb-6 bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-200 dark:border-red-500/20 font-medium">
              {repliesError}
            </div>
          )}

          {loadingReplies ? (
            <div className="space-y-6">
              <div className="h-32 bg-white dark:bg-[#171717] rounded-2xl animate-pulse w-full border border-gray-200 dark:border-[rgba(255,255,255,0.02)]"></div>
              <div className="h-32 bg-white dark:bg-[#171717] rounded-2xl animate-pulse w-full border border-gray-200 dark:border-[rgba(255,255,255,0.02)]"></div>
            </div>
          ) : replies.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#171717] border border-gray-200 dark:border-[rgba(255,255,255,0.05)] rounded-3xl shadow-sm mb-4">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">No replies yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-6 mb-4">
              {replies.map((reply) => (
                <motion.div 
                  key={reply._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ReplyCard 
                    reply={reply} 
                    currentUser={currentUser} 
                    onDelete={handleReplyDelete} 
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        <ReplyForm 
          postId={id as string} 
          currentUser={currentUser} 
          onSubmit={handleReplySubmit} 
        />
      </div>
    </motion.div>
  );
}
