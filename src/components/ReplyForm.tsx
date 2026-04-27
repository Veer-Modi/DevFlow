"use client";

import { useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';

interface ReplyFormProps {
  postId: string;
  currentUser: any;
  onReplyAdded: () => void;
}

export default function ReplyForm({ postId, currentUser, onReplyAdded }: ReplyFormProps) {
  const [content, setContent] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!currentUser) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">You must be logged in to reply to this post.</p>
        <Link href="/login" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Login to reply
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setError('');
    setLoading(true);

    const images = imagesInput.split(',').map(img => img.trim()).filter(Boolean);

    try {
      await api.post(`/posts/${postId}/replies`, {
        content,
        images
      });
      setContent('');
      setImagesInput('');
      onReplyAdded();
    } catch (err: any) {
      console.error('Submit reply error:', err);
      if (err.response?.status === 429) {
        setError('You are posting too fast. Please wait before submitting again.');
      } else {
        setError(err.response?.data?.error || 'Failed to submit reply. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add a Reply</h3>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="sr-only">Reply content</label>
          <textarea
            id="content"
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Write your reply here..."
          />
        </div>
        
        <div>
          <label htmlFor="reply_images" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Image URLs (optional, comma-separated)
          </label>
          <input
            type="text"
            id="reply_images"
            value={imagesInput}
            onChange={(e) => setImagesInput(e.target.value)}
            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://example.com/img1.png"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${loading || !content.trim() ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
          >
            {loading ? 'Posting...' : 'Post Reply'}
          </button>
        </div>
      </form>
    </div>
  );
}
