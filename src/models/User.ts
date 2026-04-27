import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  full_name: string;
  username: string;
  email: string;
  password_hash: string;
  profile_picture?: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
  abuse_count: number;
  created_at: Date;
}

const UserSchema: Schema = new Schema({
  full_name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  profile_picture: { type: String, required: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  abuse_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

// Safely export the model
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
