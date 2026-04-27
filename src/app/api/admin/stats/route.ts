import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { requireAdmin } from '@/middleware/auth';
import User from '@/models/User';
import Post from '@/models/Post';
import Reply from '@/models/Reply';

export async function GET(req: NextRequest) {
  try {
    const adminCheck = requireAdmin(req);
    if (!adminCheck.authorized) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    await connectToDatabase();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalUsers,
      totalPosts,
      totalReplies,
      flaggedPosts,
      flaggedReplies,
      blockedUsers,
      activeUsersLast7Days
    ] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Reply.countDocuments(),
      Post.countDocuments({ is_flagged: true }),
      Reply.countDocuments({ is_flagged: true }),
      User.countDocuments({ status: 'blocked' }),
      User.countDocuments({ created_at: { $gte: sevenDaysAgo } }) 
    ]);

    return NextResponse.json({
      total_users: totalUsers,
      total_posts: totalPosts,
      total_replies: totalReplies,
      flagged_posts: flaggedPosts,
      flagged_replies: flaggedReplies,
      total_flagged_content: flaggedPosts + flaggedReplies,
      blocked_users: blockedUsers,
      active_users_7d: activeUsersLast7Days
    }, { status: 200 });

  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
