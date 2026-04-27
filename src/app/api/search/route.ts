import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Post from '@/models/Post';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    if (!q || q.trim() === '') {
      return NextResponse.json({ error: 'Search query (q) is required' }, { status: 400 });
    }

    const page = Math.max(1, parseInt(pageParam || '1', 10));
    const limit = Math.max(1, parseInt(limitParam || '10', 10));
    const skip = (page - 1) * limit;

    const searchQuery = {
      $text: { $search: q }
    };

    const posts = await Post.find(searchQuery, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' }, created_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user_id', 'username full_name profile_picture')
      .lean();

    const totalCount = await Post.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalCount / limit);

    // Format the response
    const formattedPosts = posts.map((post: any) => ({
      id: post._id,
      title: post.title,
      description: post.description.length > 200 ? post.description.substring(0, 200) + '...' : post.description,
      tags: post.tags,
      view_count: post.view_count,
      created_at: post.created_at,
      author: post.user_id
    }));

    return NextResponse.json({
      posts: formattedPosts,
      totalCount,
      currentPage: page,
      totalPages,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
