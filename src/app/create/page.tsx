"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { getToken } from '@/utils/authClient';

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not logged in
    if (!getToken()) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
    const images = imagesInput.split(',').map(img => img.trim()).filter(Boolean);

    try {
      const res = await api.post('/posts', {
        title,
        description,
        tags,
        images
      });
      router.push(`/post/${res.data._id}`);
    } catch (err: any) {
      console.error('Create post error:', err);
      if (err.response?.status === 429) {
        setError('You are posting too fast. Please wait before submitting again.');
      } else {
        setError(err.response?.data?.error || 'Failed to create post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create a New Post</h1>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="What is your question or discussion topic?"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Provide more details here..."
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="tags"
              required
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g. react, nextjs, mongodb (comma separated)"
            />
          </div>

          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image URLs <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              id="images"
              value={imagesInput}
              onChange={(e) => setImagesInput(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="https://example.com/img1.png, https://example.com/img2.png"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="mr-4 bg-white dark:bg-gray-800 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? 'Submitting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
