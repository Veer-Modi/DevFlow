import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { requireAdmin } from '@/middleware/auth';
import Post from '@/models/Post';
import Reply from '@/models/Reply';
import { Types } from 'mongoose';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminCheck = requireAdmin(req);
    if (!adminCheck.authorized) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    await connectToDatabase();

    const contentId = params.id;
    if (!Types.ObjectId.isValid(contentId)) {
      return NextResponse.json({ error: 'Invalid content ID' }, { status: 400 });
    }

    let deleted = false;
    let type = '';

    const deletedPost = await Post.findByIdAndDelete(contentId);
    if (deletedPost) {
      deleted = true;
      type = 'post';
    } else {
      const deletedReply = await Reply.findByIdAndDelete(contentId);
      if (deletedReply) {
        deleted = true;
        type = 'reply';
      }
    }

    if (!deleted) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json({ message: `Content (${type}) deleted successfully` }, { status: 200 });

  } catch (error: any) {
    console.error('Admin delete content error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
