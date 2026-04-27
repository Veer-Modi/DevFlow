import mongoose, { Schema } from 'mongoose';
import { IPost } from '../types/post';

const PostSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true },
  tags: { 
    type: [String], 
    required: true, 
    validate: [
      (val: string[]) => val.length > 0,
      'At least one tag is required'
    ] 
  },
  images: { type: [String], default: [] },
  is_flagged: { type: Boolean, default: false },
  flag_reason: { type: String, default: null },
  view_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
