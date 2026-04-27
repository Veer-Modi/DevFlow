import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { requireAdmin } from '@/middleware/auth';
import User from '@/models/User';
import { Types } from 'mongoose';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminCheck = requireAdmin(req);
    if (!adminCheck.authorized) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    await connectToDatabase();

    const userId = params.id;
    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const body = await req.json();
    const { status } = body;

    if (status !== 'active' && status !== 'blocked') {
      return NextResponse.json({ error: 'Status must be active or blocked' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.status = status;
    if (status === 'active') {
      user.abuse_count = 0; // Reset abuse count on unblock
    }

    await user.save();

    return NextResponse.json({ message: `User status updated to ${status}` }, { status: 200 });
  } catch (error: any) {
    console.error('Admin update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
