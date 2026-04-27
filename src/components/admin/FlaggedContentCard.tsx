"use client";

import { useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';

interface FlaggedContentCardProps {
  item: any;
  onRefresh: () => void;
}

export default function FlaggedContentCard({ item, onRefresh }: FlaggedContentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this flagged content?')) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/admin/content/${item.content_id}`);
      onRefresh();
    } catch (err) {
      console.error('Failed to delete content', err);
      alert('Failed to delete content');
      setIsDeleting(false);
    }
  };

  const handleDismiss = async () => {
    if (!window.confirm('Are you sure you want to dismiss this flag? The content will remain active.')) return;
    
    setIsDeleting(true);
    try {
      // Assuming a patch endpoint to clear the flag, or just ignore for now since it's not strictly specified
      // For this phase, if missing, we could just alert that this requires an endpoint
      alert('Dismiss flag feature requires backend support. Please implement DELETE on the flagged log or PATCH content to remove flag.');
      setIsDeleting(false);
    } catch (err) {
      console.error('Failed to dismiss', err);
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-red-200 dark:border-red-900 overflow-hidden mb-4">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/10">
        <div className="flex justify-between items-center">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 uppercase tracking-wide mr-2">
              {item.content_type}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Flagged on {new Date(item.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="text-sm font-medium text-red-600 dark:text-red-400">
            Confidence: {item.ai_confidence ? `${Math.round(item.ai_confidence * 100)}%` : 'N/A'}
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-900 dark:text-white font-medium">
          Reason: {item.ai_reason}
        </p>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Author</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {item.user_id?.full_name || 'Unknown'} (@{item.user_id?.username || 'unknown'})
          </div>
        </div>
        
        <div className="mb-6">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Content Snippet</div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 break-words whitespace-pre-wrap">
            {item.content_id ? (item.content_id.description || item.content_id.content || 'Content unreadable') : 'Content deleted'}
          </div>
          {item.content_type === 'post' && item.content_id && (
            <Link href={`/post/${item.content_id._id}`} className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              View full post &rarr;
            </Link>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleDelete}
            disabled={isDeleting || !item.content_id}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
          >
            {isDeleting ? 'Processing...' : 'Delete Content'}
          </button>
          
          <button
            onClick={handleDismiss}
            disabled={isDeleting}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            Dismiss Flag
          </button>
        </div>
      </div>
    </div>
  );
}
