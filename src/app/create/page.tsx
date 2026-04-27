"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PenSquare, Image as ImageIcon, Hash, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreatePost() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

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

  if (authLoading || !user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12 px-4 sm:px-6"
    >
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1.5" /> Back
        </Link>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <PenSquare className="text-[#10a37f]" size={32} /> Create a Discussion
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Share your knowledge, ask a question, or start a debate.
        </p>
      </div>

      <div className="bg-white dark:bg-[#171717] shadow-xl rounded-3xl p-6 sm:p-10 border border-gray-200 dark:border-[rgba(255,255,255,0.05)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#10a37f] to-[#10a37f]/50" />

        <form onSubmit={handleSubmit} className="space-y-8 mt-2">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <FileText size={16} className="text-[#10a37f]" /> Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-[rgba(255,255,255,0.1)] px-5 py-4 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-white focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/30 transition-all duration-200 text-lg font-medium placeholder:font-normal placeholder:text-gray-400"
              placeholder="What is your question or discussion topic?"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <MessageSquare size={16} className="text-[#10a37f]" /> Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-[rgba(255,255,255,0.1)] px-5 py-4 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-white focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/30 transition-all duration-200 placeholder:text-gray-400"
              placeholder="Provide more details here. You can use markdown to format your code and text..."
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <Hash size={16} className="text-[#10a37f]" /> Tags <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="tags"
              required
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-[rgba(255,255,255,0.1)] px-5 py-4 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-white focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/30 transition-all duration-200 font-mono text-sm placeholder:font-sans placeholder:text-gray-400"
              placeholder="e.g. react, nextjs, mongodb (comma separated)"
            />
          </div>

          <div>
            <label htmlFor="images" className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <ImageIcon size={16} className="text-[#10a37f]" /> Image URLs <span className="text-gray-500 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              id="images"
              value={imagesInput}
              onChange={(e) => setImagesInput(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-gray-300 dark:border-[rgba(255,255,255,0.1)] px-5 py-4 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-white focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/30 transition-all duration-200 text-sm placeholder:text-gray-400"
              placeholder="https://example.com/img1.png, https://example.com/img2.png"
            />
          </div>

          <div className="flex justify-end pt-8 border-t border-gray-200 dark:border-[rgba(255,255,255,0.05)]">
            <button
              type="button"
              onClick={() => router.back()}
              className="mr-4 bg-transparent py-3 px-8 rounded-xl text-base font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#212121] transition-all duration-200 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center justify-center py-3 px-10 shadow-lg text-base font-bold rounded-xl text-white ${loading ? 'bg-[#10a37f]/50 cursor-not-allowed' : 'bg-[#10a37f] hover:bg-[#0e906f] active:scale-95 shadow-[#10a37f]/20 hover:shadow-[#10a37f]/40'} transition-all duration-200`}
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
