import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAbuseLog extends Document {
  user_id: Types.ObjectId;
  content_type: 'post' | 'reply';
  content_id: Types.ObjectId;
  ai_reason: string;
  ai_confidence: number;
  created_at: Date;
}

const AbuseLogSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content_type: { type: String, enum: ['post', 'reply'], required: true },
  content_id: { type: Schema.Types.ObjectId, required: true },
  ai_reason: { type: String, required: true },
  ai_confidence: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.AbuseLog || mongoose.model<IAbuseLog>('AbuseLog', AbuseLogSchema);
