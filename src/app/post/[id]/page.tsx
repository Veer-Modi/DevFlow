"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import api from '@/utils/api';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ReplyCard from '@/components/ReplyCard';
import ReplyForm from '@/components/ReplyForm';
import { toast } from 'sonner';

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

    // Optimistically add to UI instantly
    setReplies(prev => [...prev, optimisticReply]);

    try {
      const res = await api.post(`/posts/${id}/replies`, { content, images });
      // Replace optimistic reply with real reply from server
      setReplies(prev => prev.map(r => r._id === tempId ? res.data : r));
      toast.success('Reply added successfully!');
    } catch (err: any) {
      // Revert optimistic addition
      setReplies(prev => prev.filter(r => r._id !== tempId));
      toast.error(err.response?.data?.error || 'Failed to post reply.');
      throw err; // Let ReplyForm know it failed
    }
  };

  const handleReplyDelete = async (replyId: string) => {
    const replyToDelete = replies.find(r => r._id === replyId);
    if (!replyToDelete) return;

    // Optimistically remove from UI
    setReplies(prev => prev.filter(r => r._id !== replyId));

    try {
      await api.delete(`/replies/${replyId}`);
      toast.success('Reply deleted');
    } catch (err: any) {
      // Revert optimistic deletion
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
        <div className="bg-white dark:bg-[#171717] rounded-2xl p-8 border border-gray-200 dark:border-[rgba(255,255,255,0.05)] animate-pulse shadow-sm">
          <div className="h-10 bg-gray-200 dark:bg-[#212121] rounded w-3/4 mb-6"></div>
          <div className="flex space-x-4 mb-8">
             <div className="h-8 w-8 bg-gray-200 dark:bg-[#212121] rounded-full"></div>
             <div className="h-8 bg-gray-200 dark:bg-[#212121] rounded w-32"></div>
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
          <svg className="mx-auto h-12 w-12 mb-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold mb-4">{error || 'Post not found'}</h2>
          <Link href="/" className="inline-flex items-center text-[#10a37f] hover:text-[#0e906f] font-medium transition-colors">
            &larr; Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 mb-6 transition-colors">
        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to feed
      </Link>

      <div className="bg-white dark:bg-[#171717] shadow-sm rounded-2xl overflow-hidden mb-8 border border-gray-200 dark:border-[rgba(255,255,255,0.05)] relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#10a37f]" />
        
        <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-[rgba(255,255,255,0.05)]">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags?.map((tag: string, index: number) => (
              <span key={index} className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium tracking-wide bg-gray-100 dark:bg-[#212121] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[rgba(255,255,255,0.05)]">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-8 border-b border-gray-200 dark:border-[rgba(255,255,255,0.05)] pb-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-[#10a37f]/10 flex items-center justify-center text-[#10a37f] font-bold uppercase shadow-inner border border-[#10a37f]/20">
                {(post.user_id?.full_name || post.user_id?.username || 'U')[0]}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 dark:text-gray-200">
                  {post.user_id?.full_name || post.user_id?.username || 'Unknown User'}
                </span>
                <span className="text-xs text-gray-500">{timeSince(post.created_at)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-[#212121] px-3 py-1.5 rounded-full border border-gray-200 dark:border-[rgba(255,255,255,0.03)] text-gray-600 dark:text-gray-400">
              <span className="text-sm">👁</span>
              <span className="font-medium">{post.view_count || 0}</span>
            </div>
          </div>

          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {post.description}
          </div>

          {post.images && post.images.length > 0 && (
            <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2">
              {post.images.map((img: string, idx: number) => (
                <img key={idx} src={img} alt={`Post attachment ${idx + 1}`} className="rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] w-full object-cover shadow-sm" />
              ))}
            </div>
          )}
        </div>

        {/* Replies Section */}
        <div className="bg-gray-50 dark:bg-[#121212] p-6 sm:p-8 relative">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="mr-2">💬</span> 
            Discussion ({replies.length})
          </h3>
          
          {repliesError && (
            <div className="text-red-600 dark:text-red-400 text-sm mb-6 bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/20">{repliesError}</div>
          )}

          {loadingReplies ? (
            <div className="space-y-4">
              <div className="h-24 bg-white dark:bg-[#171717] rounded-xl animate-pulse w-full border border-gray-200 dark:border-[rgba(255,255,255,0.02)]"></div>
              <div className="h-24 bg-white dark:bg-[#171717] rounded-xl animate-pulse w-full border border-gray-200 dark:border-[rgba(255,255,255,0.02)]"></div>
            </div>
          ) : replies.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#171717] border border-gray-200 dark:border-[rgba(255,255,255,0.05)] rounded-xl shadow-sm mb-2">
              <div className="text-4xl mb-4 opacity-50">💭</div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No replies yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4 mb-2">
              {replies.map((reply) => (
                <ReplyCard 
                  key={reply._id} 
                  reply={reply} 
                  currentUser={currentUser} 
                  onDelete={handleReplyDelete} 
                />
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
    </div>
  );
}
