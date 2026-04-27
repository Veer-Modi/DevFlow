"use client";

import { useState } from 'react';
import api from '@/utils/api';

interface ReplyCardProps {
  reply: any;
  currentUser: any;
  onDeleted: () => void;
}

export default function ReplyCard({ reply, currentUser, onDeleted }: ReplyCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this reply?')) return;
    
    setIsDeleting(true);
    setError('');
    
    try {
      await api.delete(`/replies/${reply._id}`);
      onDeleted();
    } catch (err: any) {
      console.error('Delete reply error:', err);
      setError(err.response?.data?.error || 'Failed to delete reply');
      setIsDeleting(false);
    }
  };

  const isOwner = currentUser && (currentUser.id === reply.user_id?._id || currentUser.role === 'admin');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-4">
      {error && (
        <div className="text-red-500 text-sm mb-3">{error}</div>
      )}
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-sm uppercase">
            {(reply.user_id?.full_name || reply.user_id?.username || 'U')[0]}
          </div>
          <div>
            <div className="font-medium text-sm text-gray-900 dark:text-white">
              {reply.user_id?.full_name || reply.user_id?.username || 'Unknown User'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {timeSince(reply.created_at)}
            </div>
          </div>
        </div>

        {isOwner && (
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium focus:outline-none transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>

      <div className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap ml-11">
        {reply.content}
      </div>

      {reply.images && reply.images.length > 0 && (
        <div className="mt-4 ml-11 flex flex-wrap gap-2">
          {reply.images.map((img: string, idx: number) => (
            <img key={idx} src={img} alt="Reply attachment" className="h-20 w-auto rounded border border-gray-200 dark:border-gray-700 object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}
