"use client";

interface ReplyCardProps {
  reply: any;
  currentUser: any;
  onDelete: (replyId: string) => void;
}

export default function ReplyCard({ reply, currentUser, onDelete }: ReplyCardProps) {

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
    return "just now";
  };

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this reply?')) return;
    onDelete(reply._id);
  };

  const isOwner = currentUser && (currentUser.id === reply.user_id?._id || currentUser.role === 'admin');
  
  // Optimistic replies might have an 'optimistic' flag, we can fade them slightly
  const isOptimistic = reply.isOptimistic;

  return (
    <div className={`bg-white dark:bg-[#171717] rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.05)] p-5 mb-4 transition-all duration-200 shadow-sm ${isOptimistic ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-[#10a37f]/10 text-[#10a37f] flex items-center justify-center font-bold text-sm uppercase border border-[#10a37f]/20">
            {(reply.user_id?.full_name || reply.user_id?.username || 'U')[0]}
          </div>
          <div>
            <div className="font-medium text-sm text-gray-900 dark:text-gray-200">
              {reply.user_id?.full_name || reply.user_id?.username || 'Unknown User'}
            </div>
            <div className="text-xs text-gray-500">
              {timeSince(reply.created_at)}
            </div>
          </div>
        </div>

        {isOwner && !isOptimistic && (
          <button 
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 text-sm font-medium focus:outline-none transition-colors"
            title="Delete reply"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <div className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap ml-11 leading-relaxed">
        {reply.content}
      </div>

      {reply.images && reply.images.length > 0 && (
        <div className="mt-4 ml-11 flex flex-wrap gap-2">
          {reply.images.map((img: string, idx: number) => (
            <img key={idx} src={img} alt="Reply attachment" className="h-20 w-auto rounded border border-gray-200 dark:border-[rgba(255,255,255,0.1)] object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}
