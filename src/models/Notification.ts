import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotification extends Document {
  user_id: Types.ObjectId;
  message: string;
  type: 'reply' | 'warning' | 'blocked' | 'unblocked';
  is_read: boolean;
  created_at: Date;
}

const NotificationSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['reply', 'warning', 'blocked', 'unblocked'], required: true },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
