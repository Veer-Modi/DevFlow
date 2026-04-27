import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { requireAdmin } from '@/middleware/auth';
import Post from '@/models/Post';
import Reply from '@/models/Reply';

export async function GET(req: NextRequest) {
  try {
    const adminCheck = requireAdmin(req);
    if (!adminCheck.authorized) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    await connectToDatabase();

    const [flaggedPosts, flaggedReplies] = await Promise.all([
      Post.find({ is_flagged: true })
        .populate('user_id', 'username email')
        .sort({ created_at: -1 })
        .lean(),
      Reply.find({ is_flagged: true })
        .populate('user_id', 'username email')
        .sort({ created_at: -1 })
        .lean()
    ]);

    const formattedPosts = flaggedPosts.map((post: any) => ({
      _id: post._id,
      type: 'post',
      content: post.title + '\n' + post.description,
      author: post.user_id,
      flag_reason: post.flag_reason,
      created_at: post.created_at
    }));

    const formattedReplies = flaggedReplies.map((reply: any) => ({
      _id: reply._id,
      type: 'reply',
      content: reply.content,
      author: reply.user_id,
      flag_reason: reply.flag_reason,
      created_at: reply.created_at
    }));

    return NextResponse.json({
      flagged_content: [...formattedPosts, ...formattedReplies].sort((a: any, b: any) => b.created_at - a.created_at)
    }, { status: 200 });

  } catch (error: any) {
    console.error('Admin flagged content error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
