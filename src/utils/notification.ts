import Notification from '@/models/Notification';
import { connectToDatabase } from '@/lib/db';

export async function createNotification(
  userId: string,
  message: string,
  type: 'reply' | 'warning' | 'blocked' | 'unblocked'
) {
  try {
    await connectToDatabase();
    const notification = new Notification({
      user_id: userId,
      message,
      type,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    // Don't break main logic on notification failure
  }
}
