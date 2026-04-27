import Link from 'next/link';

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    view_count: number;
    created_at: string;
    user_id: {
      username: string;
      full_name: string;
    };
  };
}

export default function PostCard({ post }: PostCardProps) {
  // Truncate description for preview
  const truncateDesc = (text: string, max: number) => {
    return text.length > max ? text.substring(0, max) + '...' : text;
  };

  // Basic relative time formatter
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

  return (
    <Link href={`/post/${post._id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {post.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {truncateDesc(post.description, 150)}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span key={index} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 dark:text-gray-300">
              {post.user_id?.full_name || post.user_id?.username || 'Unknown User'}
            </span>
            <span>•</span>
            <span>{timeSince(post.created_at)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{post.view_count || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
