import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/db';
import Reply from '../../../../models/Reply';
import { authenticate } from '../../../../middleware/auth';
import { Types } from 'mongoose';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = authenticate(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const replyId = params.id;
    if (!Types.ObjectId.isValid(replyId)) {
      return NextResponse.json({ error: 'Invalid reply ID' }, { status: 400 });
    }

    const reply = await Reply.findById(replyId);
    if (!reply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
    }

    if (reply.user_id.toString() !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden. You do not have permission to delete this reply.' }, { status: 403 });
    }

    await Reply.findByIdAndDelete(replyId);

    return NextResponse.json({ message: 'Reply deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete reply error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
