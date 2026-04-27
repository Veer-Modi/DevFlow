import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Post from '@/models/Post';
import { authenticate } from '@/middleware/auth';
import { handleModeration } from '@/utils/moderation';

export async function POST(req: NextRequest) {
  try {
    const user = authenticate(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const body = await req.json();
    const { title, description, tags, images } = body;

    if (!title || typeof title !== 'string' || title.length > 200) {
      return NextResponse.json({ error: 'Valid title (max 200 characters) is required' }, { status: 400 });
    }

    if (!description || typeof description !== 'string') {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    if (!Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json({ error: 'At least 1 tag is required' }, { status: 400 });
    }

    const newPost = new Post({
      user_id: user.id,
      title,
      description,
      tags,
      images: Array.isArray(images) ? images : [],
    });

    const moderation = await handleModeration(user.id, `${title}\n${description}`, 'post', newPost._id.toString());
    
    if (moderation.is_abusive) {
      newPost.is_flagged = true;
      newPost.flag_reason = moderation.reason;
    }

    await newPost.save();

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const sort = searchParams.get('sort') || 'latest';

    const skip = (page - 1) * limit;

    let sortOption: any = { created_at: -1 };
    if (sort === 'most_viewed') {
      sortOption = { view_count: -1 };
    } else if (sort === 'most_replied') {
      // Future field prepare
      sortOption = { created_at: -1 }; 
    }

    const posts = await Post.find()
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('user_id', 'username full_name profile_picture');

    const totalCount = await Post.countDocuments();

    return NextResponse.json({
      posts,
      totalCount,
      page,
      limit,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Get posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
