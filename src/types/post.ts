import { Document, Types } from 'mongoose';

export interface IPost extends Document {
  user_id: Types.ObjectId;
  title: string;
  description: string;
  tags: string[];
  images: string[];
  is_flagged: boolean;
  flag_reason: string | null;
  view_count: number;
  created_at: Date;
}
