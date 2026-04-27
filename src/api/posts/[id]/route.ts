import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/db';
import Post from '../../../../models/Post';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const postId = params.id;

    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { view_count: 1 } },
      { new: true }
    ).populate('user_id', 'username full_name profile_picture');

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    console.error('Get single post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
