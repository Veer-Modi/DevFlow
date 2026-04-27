"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { getToken } from '@/utils/authClient';
import { toast } from 'sonner';

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (!getToken()) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast.success("Post created successfully!");
      // We don't need a hard reload here, next.js will transition via soft nav
      router.push(`/post/${res.data._id}`);
    } catch (err: any) {
      console.error('Create post error:', err);
      if (err.response?.status === 429) {
        toast.error('You are posting too fast. Please wait before submitting again.');
      } else {
        toast.error(err.response?.data?.error || 'Failed to create post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-[#111827] shadow-xl rounded-2xl p-6 sm:p-8 border border-[rgba(255,255,255,0.05)]">
        <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Create a New Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1.5">
              Title <span className="text-indigo-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-[rgba(255,255,255,0.1)] px-4 py-3 bg-[#0F172A] text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
              placeholder="What is your question or discussion topic?"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1.5">
              Description <span className="text-indigo-500">*</span>
            </label>
            <textarea
              id="description"
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-[rgba(255,255,255,0.1)] px-4 py-3 bg-[#0F172A] text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
              placeholder="Provide more details here..."
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1.5">
              Tags <span className="text-indigo-500">*</span>
            </label>
            <input
              type="text"
              id="tags"
              required
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-[rgba(255,255,255,0.1)] px-4 py-3 bg-[#0F172A] text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
              placeholder="e.g. react, nextjs, mongodb (comma separated)"
            />
          </div>

          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-300 mb-1.5">
              Image URLs <span className="text-gray-500 text-xs font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              id="images"
              value={imagesInput}
              onChange={(e) => setImagesInput(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-[rgba(255,255,255,0.1)] px-4 py-3 bg-[#0F172A] text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
              placeholder="https://example.com/img1.png, https://example.com/img2.png"
            />
          </div>

          <div className="flex justify-end pt-6 border-t border-[rgba(255,255,255,0.05)]">
            <button
              type="button"
              onClick={() => router.back()}
              className="mr-4 bg-transparent py-2.5 px-6 border border-[rgba(255,255,255,0.1)] rounded-lg text-sm font-medium text-gray-300 hover:bg-[#0F172A] hover:text-white transition-all duration-200 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex justify-center py-2.5 px-8 border border-transparent shadow-lg text-sm font-semibold rounded-lg text-white ${loading ? 'bg-indigo-500/50 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 hover:shadow-indigo-500/25 active:scale-95'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#111827] transition-all duration-200`}
            >
              {loading ? 'Submitting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
