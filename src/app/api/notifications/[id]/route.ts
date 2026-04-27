import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Notification from '@/models/Notification';
import { authenticate } from '@/middleware/auth';
import { Types } from 'mongoose';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = authenticate(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const notificationId = (await params).id;
    if (!Types.ObjectId.isValid(notificationId)) {
      return NextResponse.json({ error: 'Invalid notification ID' }, { status: 400 });
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    if (notification.user_id.toString() !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    notification.is_read = true;
    await notification.save();

    return NextResponse.json({ message: 'Notification marked as read', notification }, { status: 200 });
  } catch (error: any) {
    console.error('Update notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
