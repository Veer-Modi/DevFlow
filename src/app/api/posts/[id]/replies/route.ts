import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Reply from '@/models/Reply';
import Post from '@/models/Post';
import { authenticate } from '@/middleware/auth';
import { Types } from 'mongoose';
import { handleModeration } from '@/utils/moderation';
import { rateLimit } from '@/middleware/rateLimit';
import { createNotification } from '@/utils/notification';
import { CustomJwtPayload } from '@/types/jwt';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = authenticate(req) as CustomJwtPayload | null;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimitResult = rateLimit({
      key: `post_reply:${user.id}`,
      limit: 5,
      windowMs: 60 * 1000 // 1 minute
    });

    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'You are posting too fast. Please wait before submitting again.' }, { status: 429 });
    }

    await connectToDatabase();

    const postId = (await params).id;
    if (!Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const body = await req.json();
    const { content, images } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const newReply = new Reply({
      post_id: postId,
      user_id: user.id,
      content,
      images: Array.isArray(images) ? images : [],
    });

    const moderation = await handleModeration(user.id, content, 'reply', newReply._id.toString());

    if (moderation.is_abusive) {
      newReply.is_flagged = true;
      newReply.flag_reason = moderation.reason;
    }

    await newReply.save();

    if (post.user_id.toString() !== user.id) {
      await createNotification(
        post.user_id.toString(),
        "Someone replied to your post",
        "reply"
      );
    }

    return NextResponse.json(newReply, { status: 201 });
  } catch (error: any) {
    console.error('Create reply error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();

    const postId = (await params).id;
    if (!Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const replies = await Reply.find({ post_id: postId })
      .sort({ created_at: 1 }) // oldest to newest
      .populate('user_id', 'username full_name profile_picture');

    return NextResponse.json(replies, { status: 200 });
  } catch (error: any) {
    console.error('Get replies error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
