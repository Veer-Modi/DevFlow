import { Document, Types } from 'mongoose';

export interface IReply extends Document {
  post_id: Types.ObjectId;
  user_id: Types.ObjectId;
  content: string;
  images: string[];
  is_flagged: boolean;
  flag_reason: string | null;
  created_at: Date;
}
