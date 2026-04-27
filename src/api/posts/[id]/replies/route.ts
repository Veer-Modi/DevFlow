import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../../lib/db';
import Reply from '../../../../../models/Reply';
import Post from '../../../../../models/Post';
import { authenticate } from '../../../../../middleware/auth';
import { Types } from 'mongoose';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = authenticate(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const postId = params.id;
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

    await newReply.save();

    return NextResponse.json(newReply, { status: 201 });
  } catch (error: any) {
    console.error('Create reply error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const postId = params.id;
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
