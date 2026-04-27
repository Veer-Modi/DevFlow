"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { getUser } from '@/utils/authClient';
import FlaggedContentCard from '@/components/admin/FlaggedContentCard';
import Link from 'next/link';

export default function AdminFlaggedPage() {
  const router = useRouter();
  const [flaggedItems, setFlaggedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchFlaggedContent();
  }, [router]);

  const fetchFlaggedContent = async () => {
    try {
      const res = await api.get('/admin/flagged');
      setFlaggedItems(res.data.flaggedContent || []);
    } catch (err: any) {
      console.error('Failed to fetch admin flagged content:', err);
      setError('Failed to load flagged content.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Flagged Content</h1>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 p-4 rounded-md">
          {error}
        </div>
      ) : flaggedItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">All Clear</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">No flagged content pending review.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {flaggedItems.map((item) => (
            <FlaggedContentCard key={item._id} item={item} onRefresh={fetchFlaggedContent} />
          ))}
        </div>
      )}
    </div>
  );
}
