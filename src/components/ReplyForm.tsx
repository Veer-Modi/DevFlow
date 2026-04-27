"use client";

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

interface ReplyFormProps {
  postId: string;
  currentUser: any;
  onSubmit: (content: string, images: string[]) => Promise<void>;
}

export default function ReplyForm({ postId, currentUser, onSubmit }: ReplyFormProps) {
  const [content, setContent] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!currentUser) {
    return (
      <div className="bg-[#111827] p-6 sm:p-8 border-t border-[rgba(255,255,255,0.05)] text-center rounded-b-2xl">
        <p className="text-gray-400 mb-4">You must be logged in to reply to this post.</p>
        <Link href="/login" className="inline-flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-500 hover:bg-indigo-600 transition-colors active:scale-95 shadow-lg hover:shadow-indigo-500/25">
          Login to reply
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);

    const images = imagesInput.split(',').map(img => img.trim()).filter(Boolean);
    const currentContent = content;
    const currentImages = images;

    // Reset form instantly for UX
    setContent('');
    setImagesInput('');

    try {
      await onSubmit(currentContent, currentImages);
    } catch (err: any) {
      // Revert form state if it failed
      setContent(currentContent);
      setImagesInput(currentImages.join(', '));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111827] p-6 sm:p-8 border-t border-[rgba(255,255,255,0.05)] rounded-b-2xl">
      <h3 className="text-lg font-medium text-white mb-4">Add a Reply</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="sr-only">Reply content</label>
          <textarea
            id="content"
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="block w-full rounded-lg border border-[rgba(255,255,255,0.1)] px-4 py-3 bg-[#0F172A] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
            placeholder="Write your reply here..."
          />
        </div>
        
        <div>
          <label htmlFor="reply_images" className="block text-xs font-medium text-gray-400 mb-1.5">
            Image URLs (optional, comma-separated)
          </label>
          <input
            type="text"
            id="reply_images"
            value={imagesInput}
            onChange={(e) => setImagesInput(e.target.value)}
            className="block w-full rounded-lg border border-[rgba(255,255,255,0.1)] px-4 py-3 bg-[#0F172A] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
            placeholder="https://example.com/img1.png"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className={`inline-flex justify-center py-2.5 px-6 border border-transparent shadow-lg text-sm font-semibold rounded-lg text-white ${loading || !content.trim() ? 'bg-indigo-500/50 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 hover:shadow-indigo-500/25 active:scale-95'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#0B0F17] transition-all duration-200`}
          >
            {loading ? 'Posting...' : 'Post Reply'}
          </button>
        </div>
      </form>
    </div>
  );
}
