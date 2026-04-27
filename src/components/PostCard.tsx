import Link from 'next/link';

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    view_count: number;
    reply_count?: number;
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
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "just now";
  };

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const getTagStyles = (tag: string) => {
    const t = tag.toLowerCase();
    if (t === 'react' || t === 'reactjs') return "bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:bg-blue-500/20";
    if (t === 'node' || t === 'nodejs') return "bg-green-500/10 text-green-400 border-green-500/20 group-hover:bg-green-500/20";
    if (t === 'python') return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 group-hover:bg-yellow-500/20";
    if (t === 'css' || t === 'tailwind') return "bg-teal-500/10 text-teal-400 border-teal-500/20 group-hover:bg-teal-500/20";
    if (t === 'nextjs' || t === 'next.js') return "bg-gray-500/10 text-gray-300 border-gray-500/20 group-hover:bg-gray-500/20";
    return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover:bg-indigo-500/20";
  };

  // Generate a pseudo-random color for the avatar based on the username
  const avatarColors = ['bg-indigo-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-rose-500', 'bg-amber-500'];
  const nameLen = post.user_id?.username ? post.user_id.username.length : 0;
  const avatarBg = avatarColors[nameLen % avatarColors.length];

  return (
    <Link href={`/post/${post._id}`} className="block group">
      <div className="bg-[#111827] rounded-xl shadow-md hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-indigo-500/10 transition-all duration-300 p-6 border border-[rgba(255,255,255,0.05)] hover:border-indigo-500/30 hover:-translate-y-1 relative overflow-hidden">
        
        {/* Subtle accent line on top of card on hover */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold text-gray-100 group-hover:text-indigo-400 transition-colors duration-200 leading-tight">
            {post.title}
          </h2>
        </div>
        
        <p className="text-gray-400 text-sm mt-3 mb-5 leading-relaxed">
          {truncateDesc(post.description, 180)}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag, index) => (
            <span key={index} className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium tracking-wide border transition-colors duration-200 ${getTagStyles(tag)}`}>
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center space-x-3">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${avatarBg} shadow-inner`}>
              {getInitials(post.user_id?.full_name || post.user_id?.username)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-300 group-hover:text-gray-200 transition-colors">
                {post.user_id?.full_name || post.user_id?.username || 'Unknown User'}
              </span>
              <span className="text-xs text-gray-500">
                {timeSince(post.created_at)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 text-gray-500 group-hover:text-gray-300 transition-colors">
              <span className="text-sm">👁</span>
              <span className="text-xs font-medium">{post.view_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-gray-500 group-hover:text-gray-300 transition-colors">
              <span className="text-sm">💬</span>
              <span className="text-xs font-medium">{post.reply_count || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
