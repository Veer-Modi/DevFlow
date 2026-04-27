"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import api from '@/utils/api';
import Link from 'next/link';
import { getUser } from '@/utils/authClient';
import ReplyCard from '@/components/ReplyCard';
import ReplyForm from '@/components/ReplyForm';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingReplies, setLoadingReplies] = useState(true);
  
  const [error, setError] = useState('');
  const [repliesError, setRepliesError] = useState('');

  const currentUser = getUser();

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

  const handleReplyAddedOrDeleted = () => {
    fetchReplies();
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
    return Math.floor(seconds) + " seconds ago";
  };

  if (loadingPost) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 text-center">
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-200 px-4 py-8 rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-lg font-medium mb-2">{error || 'Post not found'}</h2>
          <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            &larr; Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-6 transition-colors">
        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to feed
      </Link>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-8">
        <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map((tag: string, index: number) => (
              <span key={index} className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
            {post.title}
          </h1>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-8">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold uppercase">
                {(post.user_id?.full_name || post.user_id?.username || 'U')[0]}
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {post.user_id?.full_name || post.user_id?.username || 'Unknown User'}
              </span>
              <span>•</span>
              <span>{timeSince(post.created_at)}</span>
            </div>
            
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="font-medium">{post.view_count || 0}</span>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {post.description}
          </div>

          {post.images && post.images.length > 0 && (
            <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2">
              {post.images.map((img: string, idx: number) => (
                <img key={idx} src={img} alt={`Post attachment ${idx + 1}`} className="rounded-lg border border-gray-200 dark:border-gray-700 w-full object-cover" />
              ))}
            </div>
          )}
        </div>

        {/* Replies Section */}
        <div className="bg-gray-50 dark:bg-gray-900 p-6 sm:p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Replies ({replies.length})
          </h3>
          
          {repliesError && (
            <div className="text-red-500 text-sm mb-4">{repliesError}</div>
          )}

          {loadingReplies ? (
            <div className="space-y-4">
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
            </div>
          ) : replies.length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm mb-6">
              <p className="text-gray-500 dark:text-gray-400">No replies yet. Be the first to reply!</p>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {replies.map((reply) => (
                <ReplyCard 
                  key={reply._id} 
                  reply={reply} 
                  currentUser={currentUser} 
                  onDeleted={handleReplyAddedOrDeleted} 
                />
              ))}
            </div>
          )}
        </div>
        
        <ReplyForm 
          postId={id as string} 
          currentUser={currentUser} 
          onReplyAdded={handleReplyAddedOrDeleted} 
        />
      </div>
    </div>
  );
}
