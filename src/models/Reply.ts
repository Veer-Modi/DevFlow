import mongoose, { Schema } from 'mongoose';
import { IReply } from '@/types/reply';

const ReplySchema: Schema = new Schema({
  post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  images: { type: [String], default: [] },
  is_flagged: { type: Boolean, default: false },
  flag_reason: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Reply || mongoose.model<IReply>('Reply', ReplySchema);
